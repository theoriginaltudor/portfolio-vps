using System;

namespace PortfolioBack.DTOs;

public class ProjectGetDto
{
  public int? Id { get; set; }
  public string? Slug { get; set; }
  public string? Title { get; set; }
  public string? Description { get; set; }
  public string? LongDescription { get; set; }
  public float[]? Embedding { get; set; }
  public DateTime? CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
}
