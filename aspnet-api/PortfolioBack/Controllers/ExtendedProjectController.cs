using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioBack.DTOs;
using PortfolioBack.Extensions;
using PortfolioBack.Models;
using PortfolioBack.Services;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class ExtendedProjectController : ControllerBase
{
  private readonly ProjectService _projectService;

  public ExtendedProjectController(ProjectService projectService)
  {
    _projectService = projectService;
  }

  /// <summary>
  /// Returns an extended project by slug with related assets and skills; supports `fields` query for base project fields.
  /// </summary>
  /// <param name="slug">Project slug.</param>
  /// <param name="fields">Comma-separated list of base project property names to include (e.g., `Id,Title`).</param>
  [HttpGet("{slug}")]
  public async Task<ActionResult<ExtendedProjectGetDto>> GetBySlug(string slug, [FromQuery(Name = "fields")] string? fields)
  {
    var project = await _projectService.GetBySlugWithRelationsAsync(slug);
    if (project == null) return NotFound();

    var requested = string.IsNullOrWhiteSpace(fields)
      ? Array.Empty<string>()
      : fields.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var valid = DataShapingExtensions.ValidFieldsFor<Project>(requested);

    // If no fields provided or none valid, return full base project fields plus related collections
    if (requested.Length == 0 || valid.Count == 0)
    {
      return Ok(project.ToExtendedDto(Array.Empty<string>()));
    }

    return Ok(project.ToExtendedDto(valid));
  }
}
