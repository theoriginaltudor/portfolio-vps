using System.Security.Claims;
using PortfolioBack.Data;
using PortfolioBack.DTOs;
using PortfolioBack.Models;
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

        var tokens = CreateTokens(user);
        return new AuthUserDto
        {
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken,
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

        var tokens = CreateTokens(user);
        return new AuthUserDto
        {
            Id = user.Id,
            Username = user.Username,
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken,
        };
    }

    public async Task<string?> RefreshToken(string refreshToken)
    {
        var valid = await new JwtSecurityTokenHandler().ValidateTokenAsync(refreshToken, new TokenValidationParameters());
        if (valid is null || !valid.IsValid) return null;
        var token = new JwtSecurityTokenHandler().ReadJwtToken(refreshToken);
        if (token is null)
        {
            return null;
        }

        var tokenUsername = token.Claims.FirstOrDefault<Claim>(c => string.Equals(c.Type, ClaimTypes.Name));

        var user = await db.Users.FirstOrDefaultAsync<User>(u => string.Equals(u.Username, tokenUsername));

        if (user is null) return null;

        return new JwtSecurityTokenHandler().WriteToken(CreateNewToken(user, TokenType.AccessToken));
    }

    private JwtTokens CreateTokens(User user)
    {

        var tokenDescriptor = CreateNewToken(user, TokenType.RefreshToken);
        var accessTokenDescriptor = CreateNewToken(user, TokenType.AccessToken);

        return new JwtTokens(new JwtSecurityTokenHandler().WriteToken(tokenDescriptor), new JwtSecurityTokenHandler().WriteToken(accessTokenDescriptor));
    }

    private record JwtTokens(string RefreshToken, string AccessToken);

    private JwtSecurityToken CreateNewToken(User user, TokenType type)
    {
        var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

        var jwtKey = configuration.GetValue<string>("Jwt:Key");
        var jwtRefreshKey = configuration.GetValue<string>("Jwt:RefreshKey");
        var jwtIssuer = configuration.GetValue<string>("Jwt:Issuer");
        var jwtAudience = configuration.GetValue<string>("Jwt:Audience");
        var jwtExpMinutes = configuration.GetValue<string>("Jwt:AccessTokenExpirationMinutes");
        var jwtExpDays = configuration.GetValue<string>("Jwt:RefreshTokenExpirationDays");

        if (new List<string?>
            {
                jwtAudience, jwtIssuer, jwtKey, jwtExpMinutes, jwtRefreshKey
            }.Any(s => s == null))
        { throw new NullReferenceException("Jwt settings are missing"); }

        DateTime expires;
        SigningCredentials credentials;

        switch (type)
        {
            case TokenType.RefreshToken:
                int days;
                if (!Int32.TryParse(jwtExpDays, out days))
                {
                    days = 7;
                }

                expires = DateTime.UtcNow.AddDays(days);
                var keyR = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtRefreshKey!));

                credentials = new SigningCredentials(keyR, SecurityAlgorithms.HmacSha256);
                break;
            default:
                int minutes;
                if (!Int32.TryParse(jwtExpMinutes, out minutes))
                {
                    minutes = 7;
                }

                expires = DateTime.UtcNow.AddMinutes(minutes);
                var keyA = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!));

                credentials = new SigningCredentials(keyA, SecurityAlgorithms.HmacSha256);
                break;
        }

        var tokenDescriptor = new JwtSecurityToken(
          issuer: jwtIssuer,
          audience: jwtAudience,
          claims: claims,
          expires: expires,
          signingCredentials: credentials);

        return tokenDescriptor;
    }
}

public enum TokenType
{
    AccessToken,
    RefreshToken
}