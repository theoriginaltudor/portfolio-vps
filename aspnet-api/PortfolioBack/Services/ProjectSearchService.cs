using Microsoft.EntityFrameworkCore;
using Pgvector;
using PortfolioBack.Data;
using PortfolioBack.DTOs;
using System.Text.Json;

namespace PortfolioBack.Services;

public interface IProjectSearchService
{
  Task<List<ProjectSearchResult>> SearchProjectsAsync(Vector queryEmbedding, double matchThreshold = 0.5, int matchCount = 10);
}

public class ProjectSearchService : IProjectSearchService
{
  private readonly PortfolioDbContext _context;

  public ProjectSearchService(PortfolioDbContext context)
  {
    _context = context;
  }

  public async Task<List<ProjectSearchResult>> SearchProjectsAsync(Vector queryEmbedding, double matchThreshold = 0.5, int matchCount = 10)
  {
    // Use the updated search_articles function that now includes skills as JSON
    var searchResults = await _context.Database
        .SqlQueryRaw<SearchArticleResult>(@"
                SELECT slug, title, description, long_description, similarity, skills 
                FROM search_articles({0}, {1}, {2})",
            queryEmbedding, matchThreshold, matchCount)
        .ToListAsync();

    // Convert the results to DTOs, parsing the JSON skills
    var results = searchResults.Select(r => new ProjectSearchResult
    {
      Slug = r.Slug,
      Title = r.Title,
      Description = r.Description,
      LongDescription = r.Long_Description,
      Similarity = r.Similarity,
      Skills = ParseSkillsFromJson(r.Skills)
    }).ToList();

    return results;
  }

  private List<SkillGetDto> ParseSkillsFromJson(string? skillsJson)
  {
    if (string.IsNullOrEmpty(skillsJson))
      return new List<SkillGetDto>();

    try
    {
      var skillsArray = JsonSerializer.Deserialize<SkillGetDto[]>(skillsJson);
      return skillsArray?.ToList() ?? new List<SkillGetDto>();
    }
    catch
    {
      return new List<SkillGetDto>();
    }
  }
}

// Helper class that matches the updated search_articles function return structure
public class SearchArticleResult
{
  public string Slug { get; set; } = string.Empty;
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string? Long_Description { get; set; }
  public double Similarity { get; set; }
  public string? Skills { get; set; }
}
