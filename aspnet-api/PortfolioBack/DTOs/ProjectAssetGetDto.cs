using System;

namespace PortfolioBack.DTOs;

public class ProjectAssetGetDto
{
  public int? Id { get; set; }
  public string? Path { get; set; }
  public int? ProjectId { get; set; }
  public DateTime? CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
}
