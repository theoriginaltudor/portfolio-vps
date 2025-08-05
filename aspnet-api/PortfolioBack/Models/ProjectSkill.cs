using System.ComponentModel.DataAnnotations;

namespace PortfolioBack.Models;

public class ProjectSkill
{
  public int ProjectId { get; set; }
  public Project Project { get; set; } = null!;

  public int SkillId { get; set; }
  public Skill Skill { get; set; } = null!;

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
