using PortfolioBack.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using PortfolioBack.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;

namespace PortfolioBack.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddAuth(this IServiceCollection services, IConfigurationManager configuration)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = configuration.GetValue<string>("Jwt:Issuer"),
                    ValidateAudience = true,
                    ValidAudience = configuration.GetValue<string>("Jwt:Audience"),
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("Jwt:Key")!)),
                    ValidateIssuerSigningKey = true
                };
            });

        services.AddAuthorization();

        return services;
    }

    public static IServiceCollection AddCustom(this IServiceCollection services)
    {
        services.AddScoped<IProjectSearchService, ProjectSearchService>();
        services.AddScoped<DataTransferService>();
        services.AddScoped<LoginService>();
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
        services.AddControllers(options =>
            options.ModelMetadataDetailsProviders.Add(new SystemTextJsonValidationMetadataProvider()
        )
        ).AddJsonOptions(o =>
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
