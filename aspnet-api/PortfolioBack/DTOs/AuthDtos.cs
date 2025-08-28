using System.ComponentModel.DataAnnotations;

namespace PortfolioBack.DTOs;

public record SignupRequestDto(
  [param: Required, MinLength(3), MaxLength(100)] string Username,
  [param: Required, MinLength(6), MaxLength(100)] string Password
);

public record LoginRequestDto(
  [param: Required] string Username,
  [param: Required] string Password
);

public record AuthUserDto(int Id, string Username);
