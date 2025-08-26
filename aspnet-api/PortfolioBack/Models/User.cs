using System.ComponentModel.DataAnnotations;

namespace PortfolioBack.Models;

public class User
{
  public int Id { get; set; }

  [Required]
  [MaxLength(100)]
  public string Username { get; set; } = string.Empty;

  // PBKDF2 storage
  [Required]
  public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

  [Required]
  public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

  public int PasswordIterations { get; set; } = 100_000;

  public DateTime CreatedAt { get; set; }
}
