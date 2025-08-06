using Microsoft.AspNetCore.Mvc;
using PortfolioBack.Models;
using PortfolioBack.Services;

[ApiController]
[Route("api/[controller]")]
public class SkillController : ControllerBase
{
  private readonly SkillService _service;
  public SkillController(SkillService service)
  {
    _service = service;
  }

  [HttpGet]
  public async Task<ActionResult<List<Skill>>> GetAll()
  {
    var skills = await _service.GetAllAsync();
    return Ok(skills);
  }
}
