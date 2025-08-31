using Microsoft.EntityFrameworkCore;
using PortfolioBack.Data;
using PortfolioBack.Models;

namespace PortfolioBack.Services;

public class ProjectSkillService
{
  private readonly PortfolioDbContext _context;
  public ProjectSkillService(PortfolioDbContext context)
  {
    _context = context;
  }

  public async Task<List<ProjectSkill>> GetAllAsync()
  {
    return await _context.ProjectSkills
        .ToListAsync();
  }
  public async Task<ProjectSkill?> GetByIdAsync(int projectId, int skillId)
  {
    return await _context.ProjectSkills
      .FirstOrDefaultAsync(ps => ps.ProjectId == projectId && ps.SkillId == skillId);
  }

  public async Task<List<ProjectSkill>> GetByProjectIdAsync(int projectId)
  {
    return await _context.ProjectSkills
      .Where(ps => ps.ProjectId == projectId)
      .ToListAsync();
  }

  public async Task<List<ProjectSkill>> GetBySkillIdAsync(int skillId)
  {
    return await _context.ProjectSkills
      .Where(ps => ps.SkillId == skillId)
      .ToListAsync();
  }

  public async Task<ProjectSkill> CreateAsync(ProjectSkill projectSkill)
  {
    _context.ProjectSkills.Add(projectSkill);
    await _context.SaveChangesAsync();
    return projectSkill;
  }

  public async Task<ProjectSkill?> UpdateAsync(ProjectSkill projectSkill)
  {
    var existing = await _context.ProjectSkills.FindAsync(projectSkill.ProjectId, projectSkill.SkillId);
    if (existing == null) return null;
    _context.Entry(existing).CurrentValues.SetValues(projectSkill);
    await _context.SaveChangesAsync();
    return existing;
  }

  public async Task<bool> DeleteAsync(int projectId, int skillId)
  {
    var projectSkill = await _context.ProjectSkills.FindAsync(projectId, skillId);
    if (projectSkill == null) return false;
    _context.ProjectSkills.Remove(projectSkill);
    await _context.SaveChangesAsync();
    return true;
  }
}
