using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioBack.Data;
using PortfolioBack.Models;

namespace PortfolioBack.Services;

public class DataTransferService
{
  private readonly PortfolioDbContext _context;
  private readonly ILogger<DataTransferService> _logger;

  public DataTransferService(PortfolioDbContext context, ILogger<DataTransferService> logger)
  {
    _context = context;
    _logger = logger;
  }
  /// <summary>
  /// Transfers uploaded image files to the server's images directory.
  /// </summary>
  /// <param name="files">A list of uploaded files.</param>
  /// <returns>TransferResult with success, count, and errors.</returns>
  public async Task<TransferResult> TransferImagesAsync(IEnumerable<IFormFile> files)
  {
    var transferredCount = 0;
    var errors = new List<string>();
    try
    {
      _logger.LogInformation("TransferImagesAsync called with {FileCount} files", files?.Count() ?? 0);

      if (files == null)
      {
        _logger.LogWarning("Files parameter is null");
        return new TransferResult
        {
          Success = false,
          TransferredCount = 0,
          Errors = new List<string> { "No files provided" },
          Message = "No files provided"
        };
      }

      // Determine the images directory (relative to the backend root)
      var imagesDir = Path.Combine(AppContext.BaseDirectory, "images");
      _logger.LogInformation("Images directory: {ImagesDir}", imagesDir);

      if (!Directory.Exists(imagesDir))
      {
        Directory.CreateDirectory(imagesDir);
        _logger.LogInformation("Created images directory");
      }

      foreach (var file in files)
      {
        try
        {
          _logger.LogInformation("Processing file: {FileName}, Size: {Size} bytes", file.FileName, file.Length);

          // Handle file paths that might contain directory separators
          // Remove leading slash if present to ensure relative path behavior
          var fileName = file.FileName.TrimStart('/');
          var fullFilePath = Path.Combine(imagesDir, fileName);

          _logger.LogInformation("Sanitized filename: {FileName} -> Full path: {FullPath}", fileName, fullFilePath);

          // Create directory structure if the filename contains path separators
          var fileDirectory = Path.GetDirectoryName(fullFilePath);
          if (!string.IsNullOrEmpty(fileDirectory) && !Directory.Exists(fileDirectory))
          {
            Directory.CreateDirectory(fileDirectory);
            _logger.LogInformation("Created directory: {Directory}", fileDirectory);
          }

          using (var stream = new FileStream(fullFilePath, FileMode.Create))
          {
            await file.CopyToAsync(stream);
          }
          transferredCount++;
          _logger.LogInformation("Successfully saved file: {FileName} to {FilePath}", file.FileName, fullFilePath);
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, "Failed to save file: {FileName}", file.FileName);
          errors.Add($"Failed to save {file.FileName}: {ex.Message}");
        }
      }

      return new TransferResult
      {
        Success = errors.Count == 0,
        TransferredCount = transferredCount,
        Errors = errors,
        Message = $"Transferred {transferredCount} images with {errors.Count} errors"
      };
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed during images transfer");
      return new TransferResult
      {
        Success = false,
        TransferredCount = 0,
        Errors = new List<string> { ex.Message },
        Message = "Images transfer failed"
      };
    }
  }
  // Old image transfer implementation removed.

  public async Task<TransferResult> TransferProjectsAsync(IEnumerable<ProjectDto> projects)
  {
    var transferredCount = 0;
    var errors = new List<string>();

    using var transaction = await _context.Database.BeginTransactionAsync();

    try
    {
      foreach (var projectDto in projects)
      {
        try
        {
          // Check if project already exists (by slug or external ID)
          var existingProject = await _context.Projects
              .FirstOrDefaultAsync(p => p.Slug == projectDto.Slug);

          if (existingProject != null)
          {
            _logger.LogWarning("Project with slug {Slug} already exists, skipping", projectDto.Slug);
            continue;
          }

          var project = new Project
          {
            Slug = projectDto.Slug,
            Title = projectDto.Title,
            Description = projectDto.Description,
            LongDescription = projectDto.LongDescription,
            Embedding = projectDto.Embedding != null ? new Pgvector.Vector(projectDto.Embedding) : null,
            CreatedAt = projectDto.CreatedAt ?? DateTime.UtcNow
          };

          _context.Projects.Add(project);
          await _context.SaveChangesAsync();
          transferredCount++;

          _logger.LogInformation("Successfully transferred project: {Title}", project.Title);
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, "Failed to transfer project: {Title}", projectDto.Title);
          errors.Add($"Project '{projectDto.Title}': {ex.Message}");
        }
      }

      await transaction.CommitAsync();

      return new TransferResult
      {
        Success = errors.Count == 0,
        TransferredCount = transferredCount,
        Errors = errors,
        Message = $"Transferred {transferredCount} projects with {errors.Count} errors"
      };
    }
    catch (Exception ex)
    {
      await transaction.RollbackAsync();
      _logger.LogError(ex, "Transaction failed during project transfer");

      return new TransferResult
      {
        Success = false,
        TransferredCount = 0,
        Errors = new List<string> { ex.Message },
        Message = "Transfer failed and was rolled back"
      };
    }
  }

  public async Task<TransferResult> TransferSkillsAsync(IEnumerable<SkillDto> skills)
  {
    var transferredCount = 0;
    var errors = new List<string>();

    try
    {
      foreach (var skillDto in skills)
      {
        try
        {
          var existingSkill = await _context.Skills
              .FirstOrDefaultAsync(s => s.Name.ToLower() == skillDto.Name.ToLower());

          if (existingSkill != null)
          {
            continue; // Skip duplicates
          }

          var skill = new Skill
          {
            Name = skillDto.Name,
            CreatedAt = skillDto.CreatedAt ?? DateTime.UtcNow
          };

          _context.Skills.Add(skill);
          transferredCount++;
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, "Failed to transfer skill: {Name}", skillDto.Name);
          errors.Add($"Skill '{skillDto.Name}': {ex.Message}");
        }
      }

      await _context.SaveChangesAsync();

      return new TransferResult
      {
        Success = errors.Count == 0,
        TransferredCount = transferredCount,
        Errors = errors,
        Message = $"Transferred {transferredCount} skills with {errors.Count} errors"
      };
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed during skills transfer");
      return new TransferResult
      {
        Success = false,
        TransferredCount = 0,
        Errors = new List<string> { ex.Message },
        Message = "Skills transfer failed"
      };
    }
  }

  public async Task<TransferResult> TransferProjectSkillsAsync(IEnumerable<ProjectSkillDto> projectSkills)
  {
    var transferredCount = 0;
    var errors = new List<string>();

    try
    {
      foreach (var projectSkillDto in projectSkills)
      {
        try
        {
          // Find project by slug and skill by name
          var project = await _context.Projects
              .FirstOrDefaultAsync(p => p.Slug == projectSkillDto.ProjectSlug);

          var skill = await _context.Skills
              .FirstOrDefaultAsync(s => s.Name == projectSkillDto.SkillName);

          if (project == null)
          {
            errors.Add($"Project with slug '{projectSkillDto.ProjectSlug}' not found");
            continue;
          }

          if (skill == null)
          {
            errors.Add($"Skill with name '{projectSkillDto.SkillName}' not found");
            continue;
          }

          // Check if relationship already exists
          var existingRelation = await _context.ProjectSkills
              .FirstOrDefaultAsync(ps => ps.ProjectId == project.Id && ps.SkillId == skill.Id);

          if (existingRelation != null)
          {
            continue; // Skip duplicates
          }

          var projectSkill = new ProjectSkill
          {
            ProjectId = project.Id,
            SkillId = skill.Id,
            CreatedAt = projectSkillDto.CreatedAt ?? DateTime.UtcNow
          };

          _context.ProjectSkills.Add(projectSkill);
          transferredCount++;
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, "Failed to transfer project-skill relationship: {ProjectSlug} - {SkillName}",
              projectSkillDto.ProjectSlug, projectSkillDto.SkillName);
          errors.Add($"ProjectSkill '{projectSkillDto.ProjectSlug}-{projectSkillDto.SkillName}': {ex.Message}");
        }
      }

      await _context.SaveChangesAsync();

      return new TransferResult
      {
        Success = errors.Count == 0,
        TransferredCount = transferredCount,
        Errors = errors,
        Message = $"Transferred {transferredCount} project-skill relationships with {errors.Count} errors"
      };
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed during project-skills transfer");
      return new TransferResult
      {
        Success = false,
        TransferredCount = 0,
        Errors = new List<string> { ex.Message },
        Message = "Project-skills transfer failed"
      };
    }
  }

  public async Task<TransferResult> TransferProjectAssetsAsync(IEnumerable<ProjectAssetDto> projectAssets)
  {
    var transferredCount = 0;
    var errors = new List<string>();

    try
    {
      foreach (var assetDto in projectAssets)
      {
        try
        {
          // Find project by slug
          var project = await _context.Projects
              .FirstOrDefaultAsync(p => p.Slug == assetDto.ProjectSlug);

          if (project == null)
          {
            errors.Add($"Project with slug '{assetDto.ProjectSlug}' not found");
            continue;
          }

          // Check if asset already exists
          var existingAsset = await _context.ProjectAssets
              .FirstOrDefaultAsync(pa => pa.ProjectId == project.Id && pa.Path == assetDto.Path);

          if (existingAsset != null)
          {
            continue; // Skip duplicates
          }

          var projectAsset = new ProjectAsset
          {
            ProjectId = project.Id,
            Path = assetDto.Path,
            CreatedAt = assetDto.CreatedAt ?? DateTime.UtcNow
          };

          _context.ProjectAssets.Add(projectAsset);
          transferredCount++;
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, "Failed to transfer project asset: {ProjectSlug} - {Path}",
              assetDto.ProjectSlug, assetDto.Path);
          errors.Add($"ProjectAsset '{assetDto.ProjectSlug}-{assetDto.Path}': {ex.Message}");
        }
      }

      await _context.SaveChangesAsync();

      return new TransferResult
      {
        Success = errors.Count == 0,
        TransferredCount = transferredCount,
        Errors = errors,
        Message = $"Transferred {transferredCount} project assets with {errors.Count} errors"
      };
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed during project assets transfer");
      return new TransferResult
      {
        Success = false,
        TransferredCount = 0,
        Errors = new List<string> { ex.Message },
        Message = "Project assets transfer failed"
      };
    }
  }
}

// DTOs for data transfer
public class ProjectDto
{
  public string Slug { get; set; } = string.Empty;
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string LongDescription { get; set; } = string.Empty;
  public float[]? Embedding { get; set; }
  public DateTime? CreatedAt { get; set; }
}

public class SkillDto
{
  public string Name { get; set; } = string.Empty;
  public DateTime? CreatedAt { get; set; }
}

public class ProjectSkillDto
{
  public string ProjectSlug { get; set; } = string.Empty;
  public string SkillName { get; set; } = string.Empty;
  public DateTime? CreatedAt { get; set; }
}

public class ProjectAssetDto
{
  public string ProjectSlug { get; set; } = string.Empty;
  public string Path { get; set; } = string.Empty;
  public DateTime? CreatedAt { get; set; }
}

public class TransferResult
{
  public bool Success { get; set; }
  public int TransferredCount { get; set; }
  public List<string> Errors { get; set; } = new();
  public string Message { get; set; } = string.Empty;
}
