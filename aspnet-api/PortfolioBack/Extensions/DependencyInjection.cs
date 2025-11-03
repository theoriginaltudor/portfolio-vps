using PortfolioBack.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using PortfolioBack.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace PortfolioBack.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddAuth(this IServiceCollection services, IWebHostEnvironment environment)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {

            });

        services.AddAuthorization();

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

    public static IServiceCollection AddSetup(this IServiceCollection services, string? connectionString)
    {
        services.AddOpenApi();

        // Add services to the container. (has to be view controller for antiforgery attributes on controllers to work)
        services.AddControllers().AddJsonOptions(o =>
        {
            // Prevent cycles from causing serialization errors (e.g., Project -> ProjectAssets -> Project)
            o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });

        // Add Entity Framework
        services.AddDbContext<PortfolioDbContext>(options =>
            options.UseNpgsql(connectionString,
                o => o.UseVector()));
        return services;
    }
}
