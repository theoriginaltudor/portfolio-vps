using Microsoft.AspNetCore.Mvc;
using PortfolioBack.Models;
using PortfolioBack.Services;

[ApiController]
[Route("api/[controller]")]
public class SkillController : ControllerBase
{
  private readonly SkillService _service;
  public SkillController(SkillService service)
  {
    _service = service;
  }

  [HttpGet]
  public async Task<ActionResult<List<Skill>>> GetAll()
  {
    var skills = await _service.GetAllAsync();
    return Ok(skills);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Skill>> GetById(int id)
  {
    var skill = await _service.GetByIdAsync(id);
    if (skill == null) return NotFound();
    return Ok(skill);
  }

  [HttpPost]
  public async Task<ActionResult<Skill>> Create(Skill skill)
  {
    var created = await _service.CreateAsync(skill);
    return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Update(int id, Skill skill)
  {
    if (id != skill.Id) return BadRequest();
    var updated = await _service.UpdateAsync(skill);
    if (updated == null) return NotFound();
    return NoContent();
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var deleted = await _service.DeleteAsync(id);
    if (!deleted) return NotFound();
    return NoContent();
  }
}
