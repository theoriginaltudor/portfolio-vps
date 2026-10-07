using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using PortfolioBack.DTOs;
using PortfolioBack.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Runtime.InteropServices.JavaScript;

[ApiController]
[Route("api/[controller]")]
public class LoginController(LoginService loginService, IConfiguration configuration) : ControllerBase
{
  // [HttpPost("signup")]
  // [AllowAnonymous]
  // public async Task<ActionResult<AuthUserDto>> Signup([FromBody] SignupRequestDto request)
  // {
  //   var authUserDto = loginService.Signup(request);
  //   if (authUserDto is null) return Conflict(new { message = "Username already exists" });
  //   return Ok(authUserDto);
  // }

  [HttpPost("login")]
  [AllowAnonymous]
  public async Task<ActionResult<AuthUserDto>> Login([FromBody] LoginRequestDto request)
  {
    var authUserDto = await loginService.Login(request);
    if (authUserDto is null)
    {
      await Task.Delay(Random.Shared.Next(50, 150)); // timing noise
      return Unauthorized(new { message = "Invalid credentials" });
    }
    int.TryParse(configuration.GetValue<string>("Jwt:RefreshTokenExpirationDays"), out int days);
    var options = new CookieOptions
    {
      HttpOnly = true,
      Secure = Request.IsHttps,
      SameSite = SameSiteMode.Strict,
      Path = "/api/Login",
      Expires = DateTime.UtcNow.AddDays(days > 0 ? days : 7)
    };

    // check if production and add Domain to cookie options

    Response.Cookies.Append("auth", authUserDto.RefreshToken!, options);
    authUserDto.RefreshToken = null;
    return Ok(authUserDto);
  }

  [HttpPost("logout")]
  [AllowAnonymous]
  public IActionResult Logout()
  {
    Response.Cookies.Delete("auth", new CookieOptions { Path = "/", Secure = Request.IsHttps, SameSite = SameSiteMode.Strict });
    Response.Cookies.Delete("auth", new CookieOptions { Path = "/api/Login", Secure = Request.IsHttps, SameSite = SameSiteMode.Strict });
    return NoContent();
  }

  [HttpGet("me")]
  [Authorize]
  public ActionResult<AuthUserDto> Me()
  {
    var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
    var name = User.Identity?.Name ?? User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
    if (string.IsNullOrEmpty(id)) return Unauthorized();
    return Ok(new AuthUserDto
    {
      Id = int.Parse(id),
      Username = name
    });
  }

  [HttpGet("refresh")]
  [AllowAnonymous]
  public async Task<ActionResult<object>> Refresh()
  {
    var refreshToken = Request.Cookies.FirstOrDefault(cookie => string.Equals(cookie.Key, "auth"));
    if (string.IsNullOrEmpty(refreshToken.Value)) return Unauthorized();
    var accessToken = await loginService.RefreshToken(refreshToken.Value);
    if (accessToken is null) return Unauthorized();
    return Ok(new { Token = accessToken });
  }
}
