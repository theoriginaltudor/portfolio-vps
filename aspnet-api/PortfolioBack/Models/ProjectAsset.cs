using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PortfolioBack.Models;

public class ProjectAsset
{
  public int Id { get; set; }

  [Required]
  [StringLength(500)]
  public string Path { get; set; } = string.Empty;

  public int ProjectId { get; set; }
  [JsonIgnore]
  public virtual Project Project { get; set; } = null!;

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  public DateTime? UpdatedAt { get; set; }
}
