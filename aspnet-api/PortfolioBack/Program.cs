
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
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


// Add custom services
builder.Services.AddScoped<IProjectSearchService, ProjectSearchService>();
builder.Services.AddScoped<DataTransferService>();
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<SkillService>();
builder.Services.AddScoped<ProjectAssetService>();
builder.Services.AddScoped<ProjectSkillService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
