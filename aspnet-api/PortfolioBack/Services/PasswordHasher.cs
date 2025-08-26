using System.Security.Cryptography;

namespace PortfolioBack.Services;

public interface IPasswordHasher
{
  (byte[] hash, byte[] salt, int iterations) HashPassword(string password, int? iterations = null);
  bool Verify(string password, byte[] expectedHash, byte[] salt, int iterations);
}

public class PasswordHasher : IPasswordHasher
{
  private const int DefaultIterations = 100_000;
  private const int SaltSize = 16; // 128-bit
  private const int KeySize = 32;  // 256-bit

  public (byte[] hash, byte[] salt, int iterations) HashPassword(string password, int? iterations = null)
  {
    var iters = iterations ?? DefaultIterations;
    var salt = RandomNumberGenerator.GetBytes(SaltSize);
    using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iters, HashAlgorithmName.SHA256);
    var hash = pbkdf2.GetBytes(KeySize);
    return (hash, salt, iters);
  }

  public bool Verify(string password, byte[] expectedHash, byte[] salt, int iterations)
  {
    using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
    var candidate = pbkdf2.GetBytes(expectedHash.Length);
    return CryptographicOperations.FixedTimeEquals(candidate, expectedHash);
  }
}
