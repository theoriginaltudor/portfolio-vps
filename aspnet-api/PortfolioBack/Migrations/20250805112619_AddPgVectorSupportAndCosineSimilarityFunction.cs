using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioBack.Migrations
{
    /// <inheritdoc />
    public partial class AddPgVectorSupportAndCosineSimilarityFunction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Enable pgvector extension
            migrationBuilder.Sql("CREATE EXTENSION IF NOT EXISTS vector;");

            // Change the embedding column from json to vector type (768 dimensions for Gemini embeddings)
            migrationBuilder.Sql("ALTER TABLE \"Projects\" ALTER COLUMN \"Embedding\" TYPE vector(768) USING \"Embedding\"::text::vector;");

            // Create search_articles function to match your Supabase function
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the search_articles function
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS search_articles;");

            // Revert embedding column back to json (for rollback purposes)
            migrationBuilder.Sql("ALTER TABLE \"Projects\" ALTER COLUMN \"Embedding\" TYPE json USING \"Embedding\"::text::json;");

            // Note: We don't drop the vector extension as it might be used by other functions
        }
    }
}
