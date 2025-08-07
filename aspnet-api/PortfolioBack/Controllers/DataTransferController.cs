using Microsoft.AspNetCore.Mvc;
using PortfolioBack.Services;

namespace PortfolioBack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DataTransferController : ControllerBase
{
  private readonly DataTransferService _dataTransferService;
  private readonly ILogger<DataTransferController> _logger;

  public DataTransferController(
      DataTransferService dataTransferService,
      ILogger<DataTransferController> logger)
  {
    _dataTransferService = dataTransferService;
    _logger = logger;
  }

  /// <summary>
  /// Transfers images to the server's images directory.
  /// Expects a multipart/form-data request with files.
  /// </summary>
  [HttpPost("images")]
  [RequestSizeLimit(52428800)] // 50MB limit, adjust as needed
  public async Task<IActionResult> TransferImages([FromForm] List<IFormFile> files)
  {
    try
    {
      if (files == null || !files.Any())
      {
        return BadRequest("No files uploaded.");
      }

      _logger.LogInformation("Starting transfer of {Count} images", files.Count);

      var result = await _dataTransferService.TransferImagesAsync(files);

      if (result.Success)
      {
        return Ok(result);
      }

      return BadRequest(result);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Unexpected error during images transfer");
      return StatusCode(500, new { message = "Internal server error during transfer", error = ex.Message });
    }
  }

  [HttpPost("projects")]
  public async Task<IActionResult> TransferProjects([FromBody] List<ProjectDto> projects)
  {
    try
    {
      if (!projects.Any())
      {
        return BadRequest("No projects provided for transfer");
      }

      _logger.LogInformation("Starting transfer of {Count} projects", projects.Count);

      var result = await _dataTransferService.TransferProjectsAsync(projects);

      if (result.Success)
      {
        return Ok(result);
      }

      return BadRequest(result);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Unexpected error during project transfer");
      return StatusCode(500, new { message = "Internal server error during transfer", error = ex.Message });
    }
  }

  [HttpPost("skills")]
  public async Task<IActionResult> TransferSkills([FromBody] List<SkillDto> skills)
  {
    try
    {
      if (!skills.Any())
      {
        return BadRequest("No skills provided for transfer");
      }

      _logger.LogInformation("Starting transfer of {Count} skills", skills.Count);

      var result = await _dataTransferService.TransferSkillsAsync(skills);

      if (result.Success)
      {
        return Ok(result);
      }

      return BadRequest(result);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Unexpected error during skills transfer");
      return StatusCode(500, new { message = "Internal server error during transfer", error = ex.Message });
    }
  }

  [HttpPost("project-skills")]
  public async Task<IActionResult> TransferProjectSkills([FromBody] List<ProjectSkillDto> projectSkills)
  {
    try
    {
      if (!projectSkills.Any())
      {
        return BadRequest("No project-skill relationships provided for transfer");
      }

      _logger.LogInformation("Starting transfer of {Count} project-skill relationships", projectSkills.Count);

      var result = await _dataTransferService.TransferProjectSkillsAsync(projectSkills);

      if (result.Success)
      {
        return Ok(result);
      }

      return BadRequest(result);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Unexpected error during project-skills transfer");
      return StatusCode(500, new { message = "Internal server error during transfer", error = ex.Message });
    }
  }

  [HttpPost("project-assets")]
  public async Task<IActionResult> TransferProjectAssets([FromBody] List<ProjectAssetDto> projectAssets)
  {
    try
    {
      if (!projectAssets.Any())
      {
        return BadRequest("No project assets provided for transfer");
      }

      _logger.LogInformation("Starting transfer of {Count} project assets", projectAssets.Count);

      var result = await _dataTransferService.TransferProjectAssetsAsync(projectAssets);

      if (result.Success)
      {
        return Ok(result);
      }

      return BadRequest(result);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Unexpected error during project assets transfer");
      return StatusCode(500, new { message = "Internal server error during transfer", error = ex.Message });
    }
  }
}
