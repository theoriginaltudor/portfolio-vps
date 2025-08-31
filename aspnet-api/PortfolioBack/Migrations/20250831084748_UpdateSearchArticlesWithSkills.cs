using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioBack.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSearchArticlesWithSkills : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the existing search_articles function first
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS search_articles(vector, double precision, integer);");
            
            // Create the updated search_articles function to include skills as JSON
            migrationBuilder.Sql(@"
                CREATE OR REPLACE FUNCTION search_articles(
                    query_embedding vector(768),
                    match_threshold double precision DEFAULT 0.5,
                    match_count integer DEFAULT 10
                )
                RETURNS TABLE(
                    slug varchar(200),
                    title varchar(200),
                    description varchar(500),
                    long_description text,
                    similarity double precision,
                    skills jsonb
                ) AS $$
                BEGIN
                    RETURN QUERY
                    SELECT 
                        p.""Slug"" as slug,
                        p.""Title"" as title,
                        p.""Description"" as description,
                        p.""LongDescription"" as long_description,
                        (1 - (p.""Embedding"" <=> query_embedding)) as similarity,
                        COALESCE(
                            (
                                SELECT jsonb_agg(
                                    jsonb_build_object(
                                        'id', s.""Id"",
                                        'name', s.""Name"",
                                        'createdAt', s.""CreatedAt"",
                                        'updatedAt', s.""UpdatedAt""
                                    )
                                )
                                FROM ""ProjectSkills"" ps
                                JOIN ""Skills"" s ON ps.""SkillId"" = s.""Id""
                                WHERE ps.""ProjectId"" = p.""Id""
                            ),
                            '[]'::jsonb
                        ) as skills
                    FROM ""Projects"" p
                    WHERE p.""Embedding"" IS NOT NULL
                        AND (1 - (p.""Embedding"" <=> query_embedding)) > match_threshold
                    ORDER BY p.""Embedding"" <=> query_embedding
                    LIMIT match_count;
                END;
                $$ LANGUAGE plpgsql;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert to the original search_articles function without skills
            migrationBuilder.Sql(@"
                CREATE OR REPLACE FUNCTION search_articles(
                    query_embedding vector(768),
                    match_threshold double precision DEFAULT 0.5,
                    match_count integer DEFAULT 10
                )
                RETURNS TABLE(
                    slug varchar(200),
                    title varchar(200),
                    description varchar(500),
                    long_description text,
                    similarity double precision
                ) AS $$
                BEGIN
                    RETURN QUERY
                    SELECT 
                        p.""Slug"" as slug,
                        p.""Title"" as title,
                        p.""Description"" as description,
                        p.""LongDescription"" as long_description,
                        (1 - (p.""Embedding"" <=> query_embedding)) as similarity
                    FROM ""Projects"" p
                    WHERE p.""Embedding"" IS NOT NULL
                        AND (1 - (p.""Embedding"" <=> query_embedding)) > match_threshold
                    ORDER BY p.""Embedding"" <=> query_embedding
                    LIMIT match_count;
                END;
                $$ LANGUAGE plpgsql;
            ");
        }
    }
}
