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
        .Include(ps => ps.Project)
        .Include(ps => ps.Skill)
        .ToListAsync();
  }
}
