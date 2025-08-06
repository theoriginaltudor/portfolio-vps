using Microsoft.EntityFrameworkCore;
using PortfolioBack.Data;
using PortfolioBack.Models;

namespace PortfolioBack.Services;

public class SkillService
{
  private readonly PortfolioDbContext _context;
  public SkillService(PortfolioDbContext context)
  {
    _context = context;
  }

  public async Task<List<Skill>> GetAllAsync()
  {
    return await _context.Skills.ToListAsync();
  }
}
