namespace PortfolioBack.DTOs;

public class ProjectSearchResult
{
  public int Id { get; set; }
  public string Slug { get; set; } = string.Empty;
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string? LongDescription { get; set; }
  public double Similarity { get; set; }
}
