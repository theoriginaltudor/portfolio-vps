import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { Database } from "@/types/database.types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const model = google.textEmbeddingModel("text-embedding-004");
interface ArticleSkillWithSkill {
  skills: Database["public"]["Tables"]["skills"]["Row"];
}

type ArticleWithSkills = Database["public"]["Tables"]["articles"]["Row"] & {
  articles_skills: ArticleSkillWithSkill[];
};

async function getArticles(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      description,
      long_description,
      articles_skills (
        skills ( name )
      )
    `)
    .is('embedding', null);

  if (error) {
    console.error("Error fetching articles:", error);
    throw new Error(`Error fetching articles: ${error.message}`);
  }

  return data as unknown as ArticleWithSkills[];
}

async function generateEmbeddings() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are not set.");
  }
  const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const articles = await getArticles(supabase);

  let updated = 0;
  const failed: { id: number; error: unknown }[] = [];

  for (const article of articles) {
    try {
      const skills = article.articles_skills.map((s) => s.skills.name).join(', ');
      const contentToEmbed = `Title: ${article.title}\nSkills: ${skills}\nDescription: ${article.description}\nContent: ${article.long_description}`;
      const result = await embed({ model, value: contentToEmbed });
      const embedding = result.embedding;
      const { error: updateError } = await supabase
        .from('articles')
        .update({ embedding })
        .eq('id', article.id);
      if (updateError) {
        console.error(`Failed to update embedding for article ${article.id}:`, updateError);
        failed.push({ id: article.id, error: updateError });
      } else {
        updated++;
      }
    } catch (err) {
      console.error(`An error occurred while processing article ${article.id}:`, err);
      failed.push({ id: article.id, error: err });
    }
  }

  return {
    success: failed.length === 0,
    message: failed.length === 0 ? 'All embeddings generated successfully.' : 'Some embeddings failed.',
    updated,
    failed,
  };
}

export async function GET() {
  try {
    const result = await generateEmbeddings();
    const status = result.success ? 200 : 500;
    return new Response(JSON.stringify(result), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in GET /api/embedding:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return new Response(JSON.stringify({ success: false, message: errorMessage, error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
