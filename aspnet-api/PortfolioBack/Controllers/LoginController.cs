using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using PortfolioBack.DTOs;
using PortfolioBack.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;

[ApiController]
[Route("api/[controller]")]
public class LoginController(LoginService loginService) : ControllerBase
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
    return Ok(authUserDto);
  }

  [HttpPost("logout")]
  [Authorize]
  public async Task<IActionResult> Logout()
  {
    await HttpContext.SignOutAsync(JwtBearerDefaults.AuthenticationScheme);
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


}
