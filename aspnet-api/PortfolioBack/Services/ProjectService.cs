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
  public async Task<Project?> GetBySlugAsync(string slug)
  {
    return await _context.Projects
      .Include(p => p.ProjectSkills)
        .ThenInclude(ps => ps.Skill)
      .Include(p => p.ProjectAssets)
      .FirstOrDefaultAsync(p => p.Slug == slug);
  }

  public async Task<Project> CreateAsync(Project project)
  {
    _context.Projects.Add(project);
    await _context.SaveChangesAsync();
    return project;
  }

  public async Task<Project?> UpdateAsync(Project project)
  {
    var existing = await _context.Projects.FindAsync(project.Id);
    if (existing == null) return null;
    _context.Entry(existing).CurrentValues.SetValues(project);
    await _context.SaveChangesAsync();
    return existing;
  }

  public async Task<bool> DeleteAsync(int id)
  {
    var project = await _context.Projects.FindAsync(id);
    if (project == null) return false;
    _context.Projects.Remove(project);
    await _context.SaveChangesAsync();
    return true;
  }
}
