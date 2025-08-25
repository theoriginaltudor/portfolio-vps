using System;

namespace PortfolioBack.DTOs;

public class ProjectSkillGetDto
{
  public int? ProjectId { get; set; }
  public int? SkillId { get; set; }
  public DateTime? CreatedAt { get; set; }
}
