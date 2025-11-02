using PortfolioBack.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSetup(builder.Configuration.GetConnectionString("DefaultConnection"));

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
