using Microsoft.EntityFrameworkCore;
using Pgvector;
using PortfolioBack.Data;
using PortfolioBack.DTOs;

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
    var results = await _context.Database
        .SqlQueryRaw<ProjectSearchResult>(@"
                SELECT slug, title, description, long_description, similarity 
                FROM search_articles($1, $2, $3)",
            queryEmbedding, matchThreshold, matchCount)
        .ToListAsync();

    return results;
  }
}
