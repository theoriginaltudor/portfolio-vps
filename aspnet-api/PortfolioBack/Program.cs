
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using PortfolioBack.Data;
using PortfolioBack.Extensions;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Add services to the container. (has to be view controller for antiforgery attributes on controllers to work)
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
}).AddJsonOptions(o =>
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

app.UseForwarded();

// Don't force HTTPS here; TLS terminates at Nginx/Cloudflare.
// If Forwarded Proto is honored, downstream will already appear as https.
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
