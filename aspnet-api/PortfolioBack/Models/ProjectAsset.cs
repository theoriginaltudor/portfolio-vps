using System.ComponentModel.DataAnnotations;

namespace PortfolioBack.Models;

public class ProjectAsset
{
  public int Id { get; set; }

  [Required]
  [StringLength(500)]
  public string Path { get; set; } = string.Empty;

  public int ProjectId { get; set; }
  public Project Project { get; set; } = null!;

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  public DateTime? UpdatedAt { get; set; }
}
