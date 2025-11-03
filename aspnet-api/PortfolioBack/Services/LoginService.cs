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

namespace PortfolioBack.Services;

public class LoginService(PortfolioDbContext db, IPasswordHasher hasher, IConfiguration configuration)
{
    public async Task<AuthUserDto?> Login(LoginRequestDto request)
    {
        var username = request.Username.Trim();
        var user = await db.Users.SingleOrDefaultAsync(u => u.Username == username);
        if (user == null)
        {
            return null;
        }

        var valid = hasher.Verify(request.Password, user.PasswordHash, user.PasswordSalt, user.PasswordIterations);
        if (!valid) return null;

        var token = CreateToken(user, configuration);

        return new AuthUserDto
        {
            Token = token,
            Username = user.Username,
            Id = user.Id
        };
    }

    public async Task<AuthUserDto?> Signup(SignupRequestDto request)
    {
        var username = request.Username.Trim();
        var exists = await db.Users.AnyAsync(u => u.Username == username);
        if (exists) return null;

        var (hash, salt, iterations) = hasher.HashPassword(request.Password);
        var user = new User
        {
            Username = username,
            PasswordHash = hash,
            PasswordSalt = salt,
            PasswordIterations = iterations
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var token = CreateToken(user, configuration);
        return new AuthUserDto
        {
            Id = user.Id,
            Username = user.Username,
            Token = token
        };
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
        var jwtExpMinutes = configuration.GetValue<string>("Jwt:AccessTokenExpirationMinutes");

        if (new List<string?>
            {
                jwtAudience, jwtIssuer, jwtKey, jwtExpMinutes
            }.Any(s => s == null))
        { throw new NullReferenceException("Jwt settings are missing"); }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        int minutes;
        if (!Int32.TryParse(jwtExpMinutes, out minutes))
        {
            minutes = 30;
        }
        var tokenDescriptor = new JwtSecurityToken(
          issuer: jwtIssuer,
          audience: jwtAudience,
          claims: claims,
          expires: DateTime.UtcNow.AddMinutes(minutes),
          signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }
}
