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
}
