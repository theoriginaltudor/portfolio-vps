using Microsoft.AspNetCore.Mvc;
using PortfolioBack.Models;
using PortfolioBack.Services;
using PortfolioBack.Extensions;
using PortfolioBack.DTOs;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class ProjectAssetController : ControllerBase
{
  private readonly ProjectAssetService _service;
  public ProjectAssetController(ProjectAssetService service)
  {
    _service = service;
  }

  /// <summary>
  /// Returns project assets; optionally shape fields using the <c>fields</c> query parameter (comma-separated).
  /// </summary>
  /// <param name="fields">Comma-separated list of property names to include (e.g., <c>Id,Path,ProjectId</c>).</param>
  [HttpGet]
  [AllowAnonymous]
  public async Task<ActionResult<IEnumerable<ProjectAssetGetDto>>> GetAll([FromQuery(Name = "fields")] string? fields)
  {
    var assets = await _service.GetAllAsync();
    var requested = string.IsNullOrWhiteSpace(fields)
      ? Array.Empty<string>()
      : fields.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var valid = DataShapingExtensions.ValidFieldsFor<ProjectAsset>(requested);
    if (requested.Length == 0 || valid.Count == 0)
    {
      return Ok(assets.ToDto(Array.Empty<string>()));
    }
    return Ok(assets.ToDto(valid));
  }

  /// <summary>
  /// Returns a project asset by id; optionally shape fields using the <c>fields</c> query parameter (comma-separated).
  /// </summary>
  /// <param name="id">ProjectAsset identifier.</param>
  /// <param name="fields">Comma-separated list of property names to include (e.g., <c>Id,Path,ProjectId</c>).</param>
  [HttpGet("{id}")]
  [AllowAnonymous]
  public async Task<ActionResult<ProjectAssetGetDto>> GetById(int id, [FromQuery(Name = "fields")] string? fields)
  {
    var asset = await _service.GetByIdAsync(id);
    if (asset == null) return NotFound();
    var requested = string.IsNullOrWhiteSpace(fields)
      ? Array.Empty<string>()
      : fields.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var valid = DataShapingExtensions.ValidFieldsFor<ProjectAsset>(requested);
    if (requested.Length == 0 || valid.Count == 0)
    {
      return Ok(asset.ToDto(Array.Empty<string>()));
    }
    return Ok(asset.ToDto(valid));
  }

  [HttpPost]
  [Authorize]
  public async Task<ActionResult<ProjectAsset>> Create(ProjectAsset asset)
  {
    var created = await _service.CreateAsync(asset);
    return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
  }

  [HttpPost("batch")]
  [Authorize]
  public async Task<ActionResult<ProjectAsset[]>> Create(ProjectAsset[] assets)
  {
    var created = await _service.CreateAsync(assets);
    return Created(string.Empty, created);
  }

  [HttpPut("{id}")]
  [Authorize]
  public async Task<IActionResult> Update(int id, ProjectAsset asset)
  {
    if (id != asset.Id) return BadRequest();
    var updated = await _service.UpdateAsync(asset);
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
