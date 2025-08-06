using Microsoft.EntityFrameworkCore;
using PortfolioBack.Data;
using PortfolioBack.Models;

namespace PortfolioBack.Services;

public class ProjectAssetService
{
  private readonly PortfolioDbContext _context;
  public ProjectAssetService(PortfolioDbContext context)
  {
    _context = context;
  }

  public async Task<List<ProjectAsset>> GetAllAsync()
  {
    return await _context.ProjectAssets
        .Include(pa => pa.Project)
        .ToListAsync();
  }
}
