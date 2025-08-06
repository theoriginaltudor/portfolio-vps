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
}
