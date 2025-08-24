using Microsoft.AspNetCore.Mvc;
using PortfolioBack.Models;
using PortfolioBack.Services;

[ApiController]
[Route("api/[controller]")]
public class ProjectAssetController : ControllerBase
{
  private readonly ProjectAssetService _service;
  public ProjectAssetController(ProjectAssetService service)
  {
    _service = service;
  }

  [HttpGet]
  public async Task<ActionResult<List<ProjectAsset>>> GetAll()
  {
    var assets = await _service.GetAllAsync();
    return Ok(assets);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<ProjectAsset>> GetById(int id)
  {
    var asset = await _service.GetByIdAsync(id);
    if (asset == null) return NotFound();
    return Ok(asset);
  }

  [HttpPost]
  public async Task<ActionResult<ProjectAsset>> Create(ProjectAsset asset)
  {
    var created = await _service.CreateAsync(asset);
    return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Update(int id, ProjectAsset asset)
  {
    if (id != asset.Id) return BadRequest();
    var updated = await _service.UpdateAsync(asset);
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
