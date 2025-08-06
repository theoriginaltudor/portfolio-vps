using Microsoft.EntityFrameworkCore;
using PortfolioBack.Data;
using PortfolioBack.Models;

namespace PortfolioBack.Services;

public class ProjectService
{
  private readonly PortfolioDbContext _context;
  public ProjectService(PortfolioDbContext context)
  {
    _context = context;
  }

  public async Task<List<Project>> GetAllAsync()
  {
    return await _context.Projects
        .Include(p => p.ProjectSkills)
        .Include(p => p.ProjectAssets)
        .ToListAsync();
  }
}
