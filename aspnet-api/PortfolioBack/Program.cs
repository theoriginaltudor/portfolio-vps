
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using System.Text.Json.Serialization;
using System;
using PortfolioBack.Data;
using PortfolioBack.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(o =>
{
    // Prevent cycles from causing serialization errors (e.g., Project -> ProjectAssets -> Project)
    o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
        o => o.UseVector()));


// Authentication/Authorization (Cookie-based)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
    var isDev = builder.Environment.IsDevelopment();
    // Paths for interactive flows (adjust to your app's routes)
    options.LoginPath = "/login";
    options.AccessDeniedPath = "/access-denied";

    // Cookie settings
    options.Cookie.Name = "auth";
    options.Cookie.HttpOnly = true;
    // In Development allow HTTP for local testing; in Production require HTTPS and SameSite=None for cross-site
    options.Cookie.SecurePolicy = isDev ? CookieSecurePolicy.None : CookieSecurePolicy.Always;
    options.Cookie.SameSite = isDev ? SameSiteMode.Lax : SameSiteMode.None; 
        // In production, share auth across www and apex
        if (!isDev)
        {
            options.Cookie.Domain = ".tudor-dev.com"; // valid for tudor-dev.com and www.tudor-dev.com
        }
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromDays(1);

        // For APIs, return 401/403 instead of HTML redirects
        options.Events = new CookieAuthenticationEvents
        {
            OnRedirectToLogin = context =>
            {
                var isApi = context.Request.Path.StartsWithSegments("/api")
                             || context.Request.Headers["Accept"].ToString().Contains("application/json")
                             || string.Equals(context.Request.Headers["X-Requested-With"], "XMLHttpRequest", StringComparison.OrdinalIgnoreCase);

                if (isApi)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                }

                context.Response.Redirect(context.RedirectUri);
                return Task.CompletedTask;
            },
            OnRedirectToAccessDenied = context =>
            {
                var isApi = context.Request.Path.StartsWithSegments("/api")
                             || context.Request.Headers["Accept"].ToString().Contains("application/json")
                             || string.Equals(context.Request.Headers["X-Requested-With"], "XMLHttpRequest", StringComparison.OrdinalIgnoreCase);

                if (isApi)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                }

                context.Response.Redirect(context.RedirectUri);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Add custom services
builder.Services.AddScoped<IProjectSearchService, ProjectSearchService>();
builder.Services.AddScoped<DataTransferService>();
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<SkillService>();
builder.Services.AddScoped<ProjectAssetService>();
builder.Services.AddScoped<ProjectSkillService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Respect X-Forwarded-* headers from Nginx so scheme/remote IP/host are correct behind the proxy
var fwd = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost,
    ForwardLimit = null,
    RequireHeaderSymmetry = false
};
// Trust all proxies/networks inside the Docker network
fwd.KnownNetworks.Clear();
fwd.KnownProxies.Clear();
app.UseForwardedHeaders(fwd);

// Don't force HTTPS here; TLS terminates at Nginx/Cloudflare.
// If Forwarded Proto is honored, downstream will already appear as https.
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
