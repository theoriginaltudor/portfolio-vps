using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore;
using PortfolioBack.Data;
using PortfolioBack.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSetup(builder.Configuration.GetConnectionString("DefaultConnection"));
builder.Services.AddAuth(builder.Configuration);
builder.Services.AddCustom();
// Published builds use wwwroot; local builds use Vite's dist directory.
var spaRoot = Directory.Exists(Path.Combine(builder.Environment.ContentRootPath, "wwwroot"))
    ? "wwwroot"
    : Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "../../react-app/dist"));
builder.Services.AddSpaStaticFiles(options => options.RootPath = spaRoot);

var app = builder.Build();
if (app.Environment.IsDevelopment() && builder.Configuration.GetValue<bool>("Database:ApplyMigrations"))
{
    using var scope = app.Services.CreateScope();
    await scope.ServiceProvider.GetRequiredService<PortfolioDbContext>().Database.MigrateAsync();
}
app.UseForwarded();
app.UseExceptionHandler("/api/error");
app.Use(async (context, next) =>
{
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    if (context.Request.Path.StartsWithSegments("/login"))
        context.Response.Headers["X-Robots-Tag"] = "noindex, nofollow";
    await next();
});
if (app.Environment.IsDevelopment()) app.UseSwagger();
app.UseStaticFiles();
app.UseSpaStaticFiles();
var imagesRoot = Path.GetFullPath(builder.Configuration["Images:Path"]
    ?? Path.Combine(app.Environment.ContentRootPath, "../images"));
if (Directory.Exists(imagesRoot))
    app.UseStaticFiles(new StaticFileOptions { FileProvider = new PhysicalFileProvider(imagesRoot), RequestPath = "/images" });

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
#pragma warning disable ASP0014 // Endpoints must run before the terminal SPA middleware.
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    if (app.Environment.IsDevelopment()) endpoints.MapSwagger();
});
#pragma warning restore ASP0014
// Unknown API routes and asset paths must never return the SPA's HTML.
app.Use(async (context, next) =>
{
    if (context.Request.Path.Equals("/embedding")
        || context.Request.Path.StartsWithSegments("/api")
        || context.Request.Path.StartsWithSegments("/images")
        || (Path.HasExtension(context.Request.Path.Value) && !context.Request.Path.StartsWithSegments("/project"))
        || !(HttpMethods.IsGet(context.Request.Method) || HttpMethods.IsHead(context.Request.Method)))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }
    await next();
});
app.UseSpa(spa => spa.Options.SourcePath = "../../react-app");
app.Run();
