using Microsoft.AspNetCore.Mvc;
using PortfolioBack.Models;
using PortfolioBack.Services;
using PortfolioBack.Extensions;
using PortfolioBack.DTOs;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class ProjectController : ControllerBase
{
  private readonly ProjectService _service;
  public ProjectController(ProjectService service)
  {
    _service = service;
  }

  /// <summary>
  /// Returns projects; optionally shape fields using the <c>fields</c> query parameter (comma-separated).
  /// </summary>
  /// <param name="fields">Comma-separated list of property names to include (e.g., <c>Id,Title</c>).</param>
  [HttpGet]
  [AllowAnonymous]
  public async Task<ActionResult<IEnumerable<ProjectGetDto>>> GetAll([FromQuery(Name = "fields")] string? fields)
  {
    var requested = string.IsNullOrWhiteSpace(fields)
      ? Array.Empty<string>()
      : fields.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var valid = DataShapingExtensions.ValidFieldsFor<Project>(requested);

    if (requested.Length > 0 && valid.Count == 0)
    {
      return BadRequest("Invalid fields specified.");
    }

    var projects = await _service.GetAllAsync();
    if (requested.Length == 0)
    {
      return Ok(projects.ToDto(Array.Empty<string>()));
    }
    return Ok(projects.ToDto(valid));
  }

  /// <summary>
  /// Returns a project by slug; optionally shape fields using the <c>fields</c> query parameter (comma-separated).
  /// </summary>
  /// <param name="slug">Project slug.</param>
  /// <param name="fields">Comma-separated list of property names to include (e.g., <c>Id,Title</c>).</param>
  [HttpGet("{slug}")]
  [AllowAnonymous]
  public async Task<ActionResult<ProjectGetDto>> GetBySlug(string slug, [FromQuery(Name = "fields")] string? fields)
  {
    var requested = string.IsNullOrWhiteSpace(fields)
      ? Array.Empty<string>()
      : fields.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var valid = DataShapingExtensions.ValidFieldsFor<Project>(requested);

    if (requested.Length > 0 && valid.Count == 0)
    {
      return BadRequest("Invalid fields specified.");
    }

    var project = await _service.GetBySlugAsync(slug);
    if (project == null) return NotFound();

    if (requested.Length == 0)
    {
      return Ok(project.ToDto(Array.Empty<string>()));
    }
    return Ok(project.ToDto(valid));
  }

  [HttpPost]
  [Authorize]
  public async Task<ActionResult<Project>> Create(Project project)
  {
    var created = await _service.CreateAsync(project);
    return CreatedAtAction(nameof(GetBySlug), new { slug = created.Slug }, created);
  }

  [HttpPut("{id}")]
  [Authorize]
  public async Task<IActionResult> Update(int id, ProjectGetDto project)
  {
    if (id != project.Id) return BadRequest();
    var updated = await _service.UpdateAsync(project);
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
