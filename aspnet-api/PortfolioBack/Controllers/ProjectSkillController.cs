using Microsoft.AspNetCore.Mvc;
using PortfolioBack.Models;
using PortfolioBack.Services;
using PortfolioBack.Extensions;
using PortfolioBack.DTOs;

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

  /// <summary>
  /// Returns project-skill relationships; optionally shape fields using the <c>fields</c> query parameter (comma-separated).
  /// </summary>
  /// <param name="fields">Comma-separated list of property names to include (e.g., <c>ProjectId,SkillId</c>).</param>
  [HttpGet]
  public async Task<ActionResult<IEnumerable<ProjectSkillGetDto>>> GetAll([FromQuery(Name = "fields")] string? fields)
  {
    var projectSkills = await _service.GetAllAsync();
    var requested = string.IsNullOrWhiteSpace(fields)
      ? Array.Empty<string>()
      : fields.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var valid = DataShapingExtensions.ValidFieldsFor<ProjectSkill>(requested);
    if (requested.Length == 0 || valid.Count == 0)
    {
      return Ok(projectSkills.ToDto(Array.Empty<string>()));
    }
    return Ok(projectSkills.ToDto(valid));
  }

  /// <summary>
  /// Returns a project-skill relationship by composite id; optionally shape fields using the <c>fields</c> query parameter (comma-separated).
  /// </summary>
  /// <param name="projectId">Project identifier.</param>
  /// <param name="skillId">Skill identifier.</param>
  /// <param name="fields">Comma-separated list of property names to include (e.g., <c>ProjectId,SkillId</c>).</param>
  [HttpGet("{projectId}/{skillId}")]
  public async Task<ActionResult<ProjectSkillGetDto>> GetById(int projectId, int skillId, [FromQuery(Name = "fields")] string? fields)
  {
    var projectSkill = await _service.GetByIdAsync(projectId, skillId);
    if (projectSkill == null) return NotFound();
    var requested = string.IsNullOrWhiteSpace(fields)
      ? Array.Empty<string>()
      : fields.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var valid = DataShapingExtensions.ValidFieldsFor<ProjectSkill>(requested);
    if (requested.Length == 0 || valid.Count == 0)
    {
      return Ok(projectSkill.ToDto(Array.Empty<string>()));
    }
    return Ok(projectSkill.ToDto(valid));
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
