using PortfolioBack.DTOs;
using PortfolioBack.Models;
using Pgvector;

namespace PortfolioBack.Extensions;

public static class DtoMappingExtensions
{
  public static ExtendedProjectGetDto ToExtendedDto(this Project model, IEnumerable<string> fields)
  {
    var set = new HashSet<string>(fields.Select(f => f.Trim()), StringComparer.OrdinalIgnoreCase);
    var dto = new ExtendedProjectGetDto();
    if (set.Count == 0)
    {
      dto.Id = model.Id;
      dto.Slug = model.Slug;
      dto.Title = model.Title;
      dto.Description = model.Description;
      dto.LongDescription = model.LongDescription;
      dto.Embedding = model.Embedding?.ToArray();
      dto.CreatedAt = model.CreatedAt;
      dto.UpdatedAt = model.UpdatedAt;
    }
    else
    {
      if (set.Contains(nameof(Project.Id))) dto.Id = model.Id;
      if (set.Contains(nameof(Project.Slug))) dto.Slug = model.Slug;
      if (set.Contains(nameof(Project.Title))) dto.Title = model.Title;
      if (set.Contains(nameof(Project.Description))) dto.Description = model.Description;
      if (set.Contains(nameof(Project.LongDescription))) dto.LongDescription = model.LongDescription;
      if (set.Contains(nameof(Project.Embedding))) dto.Embedding = model.Embedding?.ToArray();
      if (set.Contains(nameof(Project.CreatedAt))) dto.CreatedAt = model.CreatedAt;
      if (set.Contains(nameof(Project.UpdatedAt))) dto.UpdatedAt = model.UpdatedAt;
    }

    // Always include related collections (they can be empty)
    dto.ProjectAssets = (model.ProjectAssets ?? new List<ProjectAsset>()).ToDto(Array.Empty<string>());
    // Map Skills through ProjectSkills
    var skills = (model.ProjectSkills ?? new List<ProjectSkill>())
      .Where(ps => ps.Skill != null)
      .Select(ps => ps.Skill);
    dto.Skills = skills.ToDto(Array.Empty<string>());
    return dto;
  }

  public static ProjectGetDto ToDto(this Project model, IEnumerable<string> fields)
  {
    var set = new HashSet<string>(fields.Select(f => f.Trim()), StringComparer.OrdinalIgnoreCase);
    var dto = new ProjectGetDto();
    if (set.Count == 0)
    {
      // No fields specified: full projection
      dto.Id = model.Id;
      dto.Slug = model.Slug;
      dto.Title = model.Title;
      dto.Description = model.Description;
      dto.LongDescription = model.LongDescription;
      dto.Embedding = model.Embedding?.ToArray();
      dto.CreatedAt = model.CreatedAt;
      dto.UpdatedAt = model.UpdatedAt;
      return dto;
    }
    if (set.Contains(nameof(Project.Id))) dto.Id = model.Id;
    if (set.Contains(nameof(Project.Slug))) dto.Slug = model.Slug;
    if (set.Contains(nameof(Project.Title))) dto.Title = model.Title;
    if (set.Contains(nameof(Project.Description))) dto.Description = model.Description;
    if (set.Contains(nameof(Project.LongDescription))) dto.LongDescription = model.LongDescription;
    if (set.Contains(nameof(Project.Embedding))) dto.Embedding = model.Embedding?.ToArray();
    if (set.Contains(nameof(Project.CreatedAt))) dto.CreatedAt = model.CreatedAt;
    if (set.Contains(nameof(Project.UpdatedAt))) dto.UpdatedAt = model.UpdatedAt;
    return dto;
  }

  public static IEnumerable<ProjectGetDto> ToDto(this IEnumerable<Project> models, IEnumerable<string> fields)
    => models.Select(m => m.ToDto(fields));

  public static SkillGetDto ToDto(this Skill model, IEnumerable<string> fields)
  {
    var set = new HashSet<string>(fields.Select(f => f.Trim()), StringComparer.OrdinalIgnoreCase);
    var dto = new SkillGetDto();
    if (set.Count == 0)
    {
      dto.Id = model.Id;
      dto.Name = model.Name;
      dto.CreatedAt = model.CreatedAt;
      dto.UpdatedAt = model.UpdatedAt;
      return dto;
    }
    if (set.Contains(nameof(Skill.Id))) dto.Id = model.Id;
    if (set.Contains(nameof(Skill.Name))) dto.Name = model.Name;
    if (set.Contains(nameof(Skill.CreatedAt))) dto.CreatedAt = model.CreatedAt;
    if (set.Contains(nameof(Skill.UpdatedAt))) dto.UpdatedAt = model.UpdatedAt;
    return dto;
  }

  public static IEnumerable<SkillGetDto> ToDto(this IEnumerable<Skill> models, IEnumerable<string> fields)
    => models.Select(m => m.ToDto(fields));

  public static ProjectAssetGetDto ToDto(this ProjectAsset model, IEnumerable<string> fields)
  {
    var set = new HashSet<string>(fields.Select(f => f.Trim()), StringComparer.OrdinalIgnoreCase);
    var dto = new ProjectAssetGetDto();
    if (set.Count == 0)
    {
      dto.Id = model.Id;
      dto.Path = model.Path;
      dto.ProjectId = model.ProjectId;
      dto.CreatedAt = model.CreatedAt;
      dto.UpdatedAt = model.UpdatedAt;
      return dto;
    }
    if (set.Contains(nameof(ProjectAsset.Id))) dto.Id = model.Id;
    if (set.Contains(nameof(ProjectAsset.Path))) dto.Path = model.Path;
    if (set.Contains(nameof(ProjectAsset.ProjectId))) dto.ProjectId = model.ProjectId;
    if (set.Contains(nameof(ProjectAsset.CreatedAt))) dto.CreatedAt = model.CreatedAt;
    if (set.Contains(nameof(ProjectAsset.UpdatedAt))) dto.UpdatedAt = model.UpdatedAt;
    return dto;
  }

  public static IEnumerable<ProjectAssetGetDto> ToDto(this IEnumerable<ProjectAsset> models, IEnumerable<string> fields)
    => models.Select(m => m.ToDto(fields));

  public static ProjectSkillGetDto ToDto(this ProjectSkill model, IEnumerable<string> fields)
  {
    var set = new HashSet<string>(fields.Select(f => f.Trim()), StringComparer.OrdinalIgnoreCase);
    var dto = new ProjectSkillGetDto();
    if (set.Count == 0)
    {
      dto.ProjectId = model.ProjectId;
      dto.SkillId = model.SkillId;
      dto.CreatedAt = model.CreatedAt;
      return dto;
    }
    if (set.Contains(nameof(ProjectSkill.ProjectId))) dto.ProjectId = model.ProjectId;
    if (set.Contains(nameof(ProjectSkill.SkillId))) dto.SkillId = model.SkillId;
    if (set.Contains(nameof(ProjectSkill.CreatedAt))) dto.CreatedAt = model.CreatedAt;
    return dto;
  }

  public static IEnumerable<ProjectSkillGetDto> ToDto(this IEnumerable<ProjectSkill> models, IEnumerable<string> fields)
    => models.Select(m => m.ToDto(fields));
}
