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
}
