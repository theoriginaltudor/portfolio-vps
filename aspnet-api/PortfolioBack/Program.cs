
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;
using System.Text.Json.Serialization;
using PortfolioBack.Data;
using PortfolioBack.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(o =>
{
    // Prevent cycles from causing serialization errors (e.g., Project -> ProjectAssets -> Project)
    o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Add Entity Framework
builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
        o => o.UseVector()));

builder.Services.AddAuth(builder.Environment);

// Add custom services
builder.Services.AddCustom();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
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
