using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PortfolioBack.Models;

public class ProjectSkill
{
  public int ProjectId { get; set; }
  [JsonIgnore]
  public Project Project { get; set; } = null!;

  public int SkillId { get; set; }
  [JsonIgnore]
  public Skill Skill { get; set; } = null!;

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
