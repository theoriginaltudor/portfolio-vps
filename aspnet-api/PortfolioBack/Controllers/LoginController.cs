using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using PortfolioBack.Data;
using PortfolioBack.DTOs;
using PortfolioBack.Models;
using PortfolioBack.Services;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
  private readonly PortfolioDbContext _db;
  private readonly IPasswordHasher _hasher;

  public LoginController(PortfolioDbContext db, IPasswordHasher hasher)
  {
    _db = db;
    _hasher = hasher;
  }

  [HttpPost("signup")]
  [AllowAnonymous]
  public async Task<ActionResult<AuthUserDto>> Signup([FromBody] SignupRequestDto request)
  {
    var username = request.Username.Trim();
    var exists = await _db.Users.AnyAsync(u => u.Username == username);
    if (exists) return Conflict(new { message = "Username already exists" });

    var (hash, salt, iterations) = _hasher.HashPassword(request.Password);
    var user = new User
    {
      Username = username,
      PasswordHash = hash,
      PasswordSalt = salt,
      PasswordIterations = iterations
    };
    _db.Users.Add(user);
    await _db.SaveChangesAsync();

    await SignInUserAsync(user);
    return Ok(new AuthUserDto(user.Id, user.Username));
  }

  [HttpPost("login")]
  [AllowAnonymous]
  public async Task<ActionResult<AuthUserDto>> Login([FromBody] LoginRequestDto request)
  {
    var username = request.Username.Trim();
    var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == username);
    if (user == null)
    {
      await Task.Delay(Random.Shared.Next(50, 150)); // timing noise
      return Unauthorized(new { message = "Invalid credentials" });
    }

    var valid = _hasher.Verify(request.Password, user.PasswordHash, user.PasswordSalt, user.PasswordIterations);
    if (!valid) return Unauthorized(new { message = "Invalid credentials" });

    await SignInUserAsync(user);
    return Ok(new AuthUserDto(user.Id, user.Username));
  }

  [HttpPost("logout")]
  [Authorize]
  public async Task<IActionResult> Logout()
  {
    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return NoContent();
  }

  [HttpGet("me")]
  [Authorize]
  public ActionResult<AuthUserDto> Me()
  {
    var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
    var name = User.Identity?.Name ?? User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
    if (string.IsNullOrEmpty(id)) return Unauthorized();
    return Ok(new AuthUserDto(int.Parse(id), name));
  }

  private async Task SignInUserAsync(User user)
  {
    var claims = new List<Claim>
    {
      new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
      new Claim(ClaimTypes.Name, user.Username)
    };
    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    var principal = new ClaimsPrincipal(identity);
    var props = new AuthenticationProperties
    {
      IsPersistent = true,
      ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
    };
    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, props);
  }
}

