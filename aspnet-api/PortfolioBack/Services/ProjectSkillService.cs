using Microsoft.EntityFrameworkCore;
using PortfolioBack.Data;
using PortfolioBack.Models;
using PortfolioBack.DTOs;

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

  public async Task<ProjectSkill?> CreateAsync(ProjectSkillGetDto projectSkill)
  {
    var existingProject = await _context.Projects.FindAsync(projectSkill.ProjectId);
    var existingSkill = await _context.Skills.FindAsync(projectSkill.SkillId);
    if (existingProject == null || existingSkill == null) return null;

    var entity = new ProjectSkill
    {
      ProjectId = existingProject.Id,
      Project = existingProject,
      SkillId = existingSkill.Id,
      Skill = existingSkill,
    };
    _context.ProjectSkills.Add(entity);
    await _context.SaveChangesAsync();
    return entity;
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
