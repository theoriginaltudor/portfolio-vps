using Microsoft.AspNetCore.Mvc;
using Pgvector;
using PortfolioBack.DTOs;
using PortfolioBack.Services;
using PortfolioBack.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace PortfolioBack.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class ProjectSearchController : ControllerBase
{
  private readonly IProjectSearchService _searchService;

  public ProjectSearchController(IProjectSearchService searchService)
  {
    _searchService = searchService;
  }

  /// <summary>
  /// Searches for projects using cosine similarity on embeddings
  /// </summary>
  /// <param name="request">Search request containing the query embedding and search parameters</param>
  /// <returns>List of matching projects with similarity scores</returns>
  [HttpPost("search")]
  public async Task<ActionResult<List<ProjectSearchResult>>> SearchProjects([FromBody] SearchRequest request)
  {
    try
    {
      // Validate the embedding dimension (should be 768 for Gemini embeddings)
      if (request.QueryEmbedding.Length != 768)
      {
        return BadRequest($"Expected embedding dimension of 768, but received {request.QueryEmbedding.Length}");
      }

      // Convert the float array to Vector using extension method
      var queryEmbedding = request.QueryEmbedding.ToVector();

      var results = await _searchService.SearchProjectsAsync(
          queryEmbedding,
          request.MatchThreshold,
          request.MatchCount);

      return Ok(results);
    }
    catch (Exception ex)
    {
      return BadRequest($"Error performing search: {ex.Message}");
    }
  }
}

public class SearchRequest
{
  /// <summary>
  /// Query embedding as a float array (should be 768 dimensions for Gemini embeddings)
  /// </summary>
  public float[] QueryEmbedding { get; set; } = Array.Empty<float>();

  /// <summary>
  /// Minimum similarity threshold (0.0 to 1.0, default: 0.5)
  /// </summary>
  public double MatchThreshold { get; set; } = 0.5;

  /// <summary>
  /// Maximum number of results to return (default: 10)
  /// </summary>
  public int MatchCount { get; set; } = 10;
}
