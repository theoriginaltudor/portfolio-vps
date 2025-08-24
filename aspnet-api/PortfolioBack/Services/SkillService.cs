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
  public async Task<Skill?> GetByIdAsync(int id)
  {
    return await _context.Skills.FirstOrDefaultAsync(s => s.Id == id);
  }

  public async Task<Skill> CreateAsync(Skill skill)
  {
    _context.Skills.Add(skill);
    await _context.SaveChangesAsync();
    return skill;
  }

  public async Task<Skill?> UpdateAsync(Skill skill)
  {
    var existing = await _context.Skills.FindAsync(skill.Id);
    if (existing == null) return null;
    _context.Entry(existing).CurrentValues.SetValues(skill);
    await _context.SaveChangesAsync();
    return existing;
  }

  public async Task<bool> DeleteAsync(int id)
  {
    var skill = await _context.Skills.FindAsync(id);
    if (skill == null) return false;
    _context.Skills.Remove(skill);
    await _context.SaveChangesAsync();
    return true;
  }
}
