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
        .ToListAsync();
  }
  public async Task<ProjectAsset?> GetByIdAsync(int id)
  {
    return await _context.ProjectAssets.FirstOrDefaultAsync(pa => pa.Id == id);
  }

  public async Task<ProjectAsset> CreateAsync(ProjectAsset asset)
  {
    _context.ProjectAssets.Add(asset);
    await _context.SaveChangesAsync();
    return asset;
  }

  public async Task<ProjectAsset[]> CreateAsync(ProjectAsset[] assets)
  {
    _context.ProjectAssets.AddRange(assets);
    await _context.SaveChangesAsync();
    return assets;
  }

  public async Task<ProjectAsset?> UpdateAsync(ProjectAsset asset)
  {
    var existing = await _context.ProjectAssets.FindAsync(asset.Id);
    if (existing == null) return null;
    _context.Entry(existing).CurrentValues.SetValues(asset);
    await _context.SaveChangesAsync();
    return existing;
  }

  public async Task<bool> DeleteAsync(int id)
  {
    var asset = await _context.ProjectAssets.FindAsync(id);
    if (asset == null) return false;
    _context.ProjectAssets.Remove(asset);
    await _context.SaveChangesAsync();
    return true;
  }
}
