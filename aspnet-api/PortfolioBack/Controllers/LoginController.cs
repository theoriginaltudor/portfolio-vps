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
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

[ApiController]
[Route("api/[controller]")]
public class LoginController(PortfolioDbContext db, IPasswordHasher hasher, IConfiguration configuration) : ControllerBase
{

  // [HttpPost("signup")]
  // [AllowAnonymous]
  // public async Task<ActionResult<AuthUserDto>> Signup([FromBody] SignupRequestDto request)
  // {
  //   var username = request.Username.Trim();
  //   var exists = await db.Users.AnyAsync(u => u.Username == username);
  //   if (exists) return Conflict(new { message = "Username already exists" });

  //   var (hash, salt, iterations) = hasher.HashPassword(request.Password);
  //   var user = new User
  //   {
  //     Username = username,
  //     PasswordHash = hash,
  //     PasswordSalt = salt,
  //     PasswordIterations = iterations
  //   };
  //   db.Users.Add(user);
  //   await db.SaveChangesAsync();

  //   var token = CreateToken(user);
  //   return Ok(new AuthUserDto {
  //     Id = user.Id,
  //     Username = user.Username,
  //     Token = token
  //   });
  // }

  [HttpPost("login")]
  [AllowAnonymous]
  public async Task<ActionResult<AuthUserDto>> Login([FromBody] LoginRequestDto request)
  {
    var username = request.Username.Trim();
    var user = await db.Users.SingleOrDefaultAsync(u => u.Username == username);
    if (user == null)
    {
      await Task.Delay(Random.Shared.Next(50, 150)); // timing noise
      return Unauthorized(new { message = "Invalid credentials" });
    }

    var valid = hasher.Verify(request.Password, user.PasswordHash, user.PasswordSalt, user.PasswordIterations);
    if (!valid) return Unauthorized(new { message = "Invalid credentials" });

    var token = CreateToken(user, configuration);
    return Ok(new AuthUserDto
    {
      Id = user.Id,
      Username = user.Username,
      Token = token
    });
  }

  [HttpPost("logout")]
  [Authorize]
  [ValidateAntiForgeryToken]
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
    return Ok(new AuthUserDto
    {
      Id = int.Parse(id),
      Username = name
    });
  }

  private string CreateToken(User user, IConfiguration configuration)
  {
    var claims = new List<Claim>
    {
      new Claim(ClaimTypes.Name, user.Username),
      new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
    };

    var jwtKey = configuration.GetValue<string>("Jwt:Key");
    var jwtIssuer = configuration.GetValue<string>("Jwt:Issuer");
    var jwtAudience = configuration.GetValue<string>("Jwt:Audience");

    if (new List<string?>
    {
        jwtAudience, jwtIssuer, jwtKey
    }.Any(s => s == null))
    { throw new NullReferenceException("Jwt settings are missing"); }

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!));

    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var tokenDescriptor = new JwtSecurityToken(
      issuer: jwtIssuer,
      audience: jwtAudience,
      claims: claims,
      expires: DateTime.UtcNow.AddDays(1),
      signingCredentials: credentials);

    return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
  }
}
