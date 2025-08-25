using System;
using System.Collections.Generic;

namespace PortfolioBack.DTOs;

public class ExtendedProjectGetDto
{
  // Base project fields
  public int? Id { get; set; }
  public string? Slug { get; set; }
  public string? Title { get; set; }
  public string? Description { get; set; }
  public string? LongDescription { get; set; }
  public float[]? Embedding { get; set; }
  public DateTime? CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }

  // Related collections
  public IEnumerable<ProjectAssetGetDto>? ProjectAssets { get; set; }
  public IEnumerable<SkillGetDto>? Skills { get; set; }
}
