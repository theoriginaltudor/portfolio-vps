using System;
using Microsoft.AspNetCore.Authentication.Cookies;
using PortfolioBack.Services;

namespace PortfolioBack.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddAuth(this IServiceCollection services, IWebHostEnvironment environment)
    {
        // Authentication/Authorization (Cookie-based)
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                var isDev = environment.IsDevelopment();

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

        services.AddAuthorization();
        services.AddAntiforgery(options => {
            options.HeaderName = "X-XSRF-TOKEN";
        });

        return services;
    }
    
    public static IServiceCollection AddCustom(this IServiceCollection services)
    {
        services.AddScoped<IProjectSearchService, ProjectSearchService>();
        services.AddScoped<DataTransferService>();
        services.AddScoped<ProjectService>();
        services.AddScoped<SkillService>();
        services.AddScoped<ProjectAssetService>();
        services.AddScoped<ProjectSkillService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        
        return services;
    }
}
