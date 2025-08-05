using Microsoft.EntityFrameworkCore;
using PortfolioBack.Models;

namespace PortfolioBack.Data;

public class PortfolioDbContext : DbContext
{
  public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options)
  {
  }

  public DbSet<Project> Projects { get; set; }
  public DbSet<Skill> Skills { get; set; }
  public DbSet<ProjectSkill> ProjectSkills { get; set; }
  public DbSet<ProjectAsset> ProjectAssets { get; set; }

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    base.OnConfiguring(optionsBuilder);
    optionsBuilder.UseNpgsql(o => o.UseVector());
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    // Enable pgvector extension
    modelBuilder.HasPostgresExtension("vector");

    // Configure Project entity
    modelBuilder.Entity<Project>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.Slug).IsRequired().HasMaxLength(200);
      entity.HasIndex(e => e.Slug).IsUnique();
      entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
      entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
      entity.Property(e => e.LongDescription).HasColumnType("text");
      entity.Property(e => e.Embedding).HasColumnType("vector(768)");
      entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
    });

    // Configure Skill entity
    modelBuilder.Entity<Skill>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
      entity.HasIndex(e => e.Name).IsUnique();
      entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
    });

    // Configure ProjectSkill entity (junction table)
    modelBuilder.Entity<ProjectSkill>(entity =>
    {
      // Composite primary key
      entity.HasKey(e => new { e.ProjectId, e.SkillId });

      // Configure relationships
      entity.HasOne(e => e.Project)
            .WithMany()
            .HasForeignKey(e => e.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

      entity.HasOne(e => e.Skill)
            .WithMany()
            .HasForeignKey(e => e.SkillId)
            .OnDelete(DeleteBehavior.Cascade);

      entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

      // Map to table name matching the database
      entity.ToTable("ProjectSkills");
    });

    // Configure ProjectAsset entity
    modelBuilder.Entity<ProjectAsset>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.Path).IsRequired().HasMaxLength(500);

      // Configure relationship with Project
      entity.HasOne(e => e.Project)
            .WithMany()
            .HasForeignKey(e => e.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

      entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
    });
  }
}
