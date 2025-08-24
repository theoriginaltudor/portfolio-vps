using Microsoft.AspNetCore.Mvc;
using PortfolioBack.Models;
using PortfolioBack.Services;

namespace PortfolioBack.Controllers;



[ApiController]
[Route("api/[controller]")]
public class ProjectSkillController : ControllerBase
{
  private readonly ProjectSkillService _service;
  public ProjectSkillController(ProjectSkillService service)
  {
    _service = service;
  }

  [HttpGet]
  public async Task<ActionResult<List<ProjectSkill>>> GetAll()
  {
    var projectSkills = await _service.GetAllAsync();
    return Ok(projectSkills);
  }

  [HttpGet("{projectId}/{skillId}")]
  public async Task<ActionResult<ProjectSkill>> GetById(int projectId, int skillId)
  {
    var projectSkill = await _service.GetByIdAsync(projectId, skillId);
    if (projectSkill == null) return NotFound();
    return Ok(projectSkill);
  }

  [HttpPost]
  public async Task<ActionResult<ProjectSkill>> Create(ProjectSkill projectSkill)
  {
    var created = await _service.CreateAsync(projectSkill);
    return CreatedAtAction(nameof(GetById), new { projectId = created.ProjectId, skillId = created.SkillId }, created);
  }

  [HttpPut("{projectId}/{skillId}")]
  public async Task<IActionResult> Update(int projectId, int skillId, ProjectSkill projectSkill)
  {
    if (projectId != projectSkill.ProjectId || skillId != projectSkill.SkillId) return BadRequest();
    var updated = await _service.UpdateAsync(projectSkill);
    if (updated == null) return NotFound();
    return NoContent();
  }

  [HttpDelete("{projectId}/{skillId}")]
  public async Task<IActionResult> Delete(int projectId, int skillId)
  {
    var deleted = await _service.DeleteAsync(projectId, skillId);
    if (!deleted) return NotFound();
    return NoContent();
  }
}
