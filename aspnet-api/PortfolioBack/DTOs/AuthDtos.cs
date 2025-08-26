using System.ComponentModel.DataAnnotations;

namespace PortfolioBack.DTOs;

public record SignupRequestDto(
  [property: Required, MinLength(3), MaxLength(100)] string Username,
  [property: Required, MinLength(6), MaxLength(100)] string Password
);

public record LoginRequestDto(
  [property: Required] string Username,
  [property: Required] string Password
);

public record AuthUserDto(int Id, string Username);
