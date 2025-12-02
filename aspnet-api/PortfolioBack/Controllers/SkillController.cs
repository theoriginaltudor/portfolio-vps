using Microsoft.AspNetCore.Mvc;
using PortfolioBack.Models;
using PortfolioBack.Services;
using PortfolioBack.Extensions;
using PortfolioBack.DTOs;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class SkillController : ControllerBase
{
  private readonly SkillService _service;
  public SkillController(SkillService service)
  {
    _service = service;
  }

  /// <summary>
  /// Returns skills; optionally shape fields using the <c>fields</c> query parameter (comma-separated).
  /// </summary>
  /// <param name="fields">Comma-separated list of property names to include (e.g., <c>Id,Name</c>).</param>
  [HttpGet]
  [AllowAnonymous]
  public async Task<ActionResult<IEnumerable<SkillGetDto>>> GetAll([FromQuery(Name = "fields")] string? fields)
  {
    var requested = string.IsNullOrWhiteSpace(fields)
      ? Array.Empty<string>()
      : fields.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var valid = DataShapingExtensions.ValidFieldsFor<Skill>(requested);

    if (requested.Length > 0 && valid.Count == 0)
    {
      return BadRequest("Invalid fields specified.");
    }

    var skills = await _service.GetAllAsync();
    if (requested.Length == 0)
    {
      return Ok(skills.ToDto(Array.Empty<string>()));
    }
    return Ok(skills.ToDto(valid));

  }

  /// <summary>
  /// Returns a skill by id; optionally shape fields using the <c>fields</c> query parameter (comma-separated).
  /// </summary>
  /// <param name="id">Skill identifier.</param>
  /// <param name="fields">Comma-separated list of property names to include (e.g., <c>Id,Name</c>).</param>
  [HttpGet("{id}")]
  [AllowAnonymous]
  public async Task<ActionResult<SkillGetDto>> GetById(int id, [FromQuery(Name = "fields")] string? fields)
  {
    var requested = string.IsNullOrWhiteSpace(fields)
      ? Array.Empty<string>()
      : fields.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var valid = DataShapingExtensions.ValidFieldsFor<Skill>(requested);

    if (requested.Length > 0 && valid.Count == 0)
    {
      return BadRequest("Invalid fields specified.");
    }

    var skill = await _service.GetByIdAsync(id);
    if (skill == null) return NotFound();

    if (requested.Length == 0)
    {
      return Ok(skill.ToDto(Array.Empty<string>()));
    }
    return Ok(skill.ToDto(valid));
  }

  [HttpPost]
  [Authorize]
  public async Task<ActionResult<Skill>> Create(Skill skill)
  {
    var created = await _service.CreateAsync(skill);
    return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
  }

  [HttpPut("{id}")]
  [Authorize]
  public async Task<IActionResult> Update(int id, Skill skill)
  {
    if (id != skill.Id) return BadRequest();
    var updated = await _service.UpdateAsync(skill);
    if (updated == null) return NotFound();
    return NoContent();
  }

  [HttpDelete("{id}")]
  [Authorize]
  public async Task<IActionResult> Delete(int id)
  {
    var deleted = await _service.DeleteAsync(id);
    if (!deleted) return NotFound();
    return NoContent();
  }
}
