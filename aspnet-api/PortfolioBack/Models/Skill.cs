using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PortfolioBack.Models;

public class Skill
{
  public int Id { get; set; }

  [Required]
  [StringLength(100)]
  public string Name { get; set; } = string.Empty;

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  public DateTime? UpdatedAt { get; set; }

  // Navigation properties
  [JsonIgnore]
  public virtual ICollection<ProjectSkill> ProjectSkills { get; set; } = new List<ProjectSkill>();
}
