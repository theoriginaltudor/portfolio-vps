using System.ComponentModel.DataAnnotations;
using Pgvector;

namespace PortfolioBack.Models;

public class Project
{
  public int Id { get; set; }

  [Required]
  [StringLength(200)]
  public string Slug { get; set; } = string.Empty;

  [Required]
  [StringLength(200)]
  public string Title { get; set; } = string.Empty;

  [Required]
  [StringLength(500)]
  public string Description { get; set; } = string.Empty;

  [Required]
  public string LongDescription { get; set; } = string.Empty;

  public Vector? Embedding { get; set; }

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  public DateTime? UpdatedAt { get; set; }

  // Navigation properties
  public ICollection<ProjectSkill> ProjectSkills { get; set; } = new List<ProjectSkill>();
  public ICollection<ProjectAsset> ProjectAssets { get; set; } = new List<ProjectAsset>();
}
