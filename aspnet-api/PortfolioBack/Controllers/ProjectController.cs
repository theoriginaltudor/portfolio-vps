using Microsoft.AspNetCore.Mvc;
using PortfolioBack.Models;
using PortfolioBack.Services;

[ApiController]
[Route("api/[controller]")]
public class ProjectController : ControllerBase
{
  private readonly ProjectService _service;
  public ProjectController(ProjectService service)
  {
    _service = service;
  }

  [HttpGet]
  public async Task<ActionResult<List<Project>>> GetAll()
  {
    var projects = await _service.GetAllAsync();
    return Ok(projects);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Project>> GetById(int id)
  {
    var project = await _service.GetByIdAsync(id);
    if (project == null) return NotFound();
    return Ok(project);
  }

  [HttpPost]
  public async Task<ActionResult<Project>> Create(Project project)
  {
    var created = await _service.CreateAsync(project);
    return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Update(int id, Project project)
  {
    if (id != project.Id) return BadRequest();
    var updated = await _service.UpdateAsync(project);
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
