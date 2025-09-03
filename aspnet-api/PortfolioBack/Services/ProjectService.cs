using Microsoft.EntityFrameworkCore;
using PortfolioBack.Data;
using PortfolioBack.Models;
using PortfolioBack.DTOs;

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
        .ToListAsync();
  }
  public async Task<Project?> GetBySlugAsync(string slug)
  {
    return await _context.Projects
      .FirstOrDefaultAsync(p => p.Slug == slug);
  }

  public async Task<Project?> GetBySlugWithRelationsAsync(string slug)
  {
    return await _context.Projects
      .Include(p => p.ProjectAssets)
      .Include(p => p.ProjectSkills)
        .ThenInclude(ps => ps.Skill)
      .FirstOrDefaultAsync(p => p.Slug == slug);
  }

  public async Task<Project> CreateAsync(Project project)
  {
    _context.Projects.Add(project);
    await _context.SaveChangesAsync();
    return project;
  }

  public async Task<Project?> UpdateAsync(ProjectGetDto project)
  {
    var existing = await _context.Projects.FindAsync(project.Id);
    if (existing == null) return null;
    if (project.LongDescription != null)
      existing.LongDescription = project.LongDescription;
    if (project.Description != null)
      existing.Description = project.Description;
    if (project.Title != null)
      existing.Title = project.Title;
    if (project.Slug != null)
      existing.Slug = project.Slug;
    existing.UpdatedAt = DateTime.UtcNow;
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
