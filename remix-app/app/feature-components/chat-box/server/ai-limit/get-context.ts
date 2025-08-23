import { google } from "@ai-sdk/google";
import { embed } from "ai";
import { createClient } from "@/lib/supabase/server";
import { Database, Tables } from "@/types/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

const embeddingModel = google.textEmbeddingModel("text-embedding-004");

export interface SearchArticlesResult {
  articles: Omit<Tables<"articles">, "embedding">[];
  tokens: number;
}

export const searchArticles = async (
  supabase: SupabaseClient<Database>,
  message: string
): Promise<SearchArticlesResult | { articles: []; tokens: number }> => {
  const searchTerm = await embed({
    model: embeddingModel,
    value: message,
  });
  const tokens = searchTerm.usage?.tokens || 0;
  const { data, error } = await supabase.rpc(
    "search_articles",
    {
      query_embedding: JSON.stringify(searchTerm.embedding),
      match_threshold: 0.4,
      match_count: 3,
    }
  ) as {
    data: Database["public"]["Functions"]["search_articles"]["Returns"] | null;
    error: Error | null;
  };
  if (error || !data || data.length === 0) {
    if (error) console.error("Error fetching data from Supabase:", error);
    return { articles: [], tokens };
  }
  return {
    articles: data.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      description: a.description,
      long_description: a.long_description,
    })),
    tokens,
  };
};

export interface SkillsMap {
  [articleId: number]: string[];
}

export const getSkills = async (
  supabase: SupabaseClient<Database>,
  articleIds: number[]
): Promise<SkillsMap> => {
  const skillsMap: SkillsMap = {};
  if (articleIds.length === 0) return skillsMap;
  const { data: skillsData, error: skillsError } = await supabase
    .from("articles_skills")
    .select("article_id, skills(name)")
    .in("article_id", articleIds);
  if (!skillsError && skillsData) {
    for (const row of skillsData as { article_id: number; skills: { name: string } }[]) {
      if (!row.skills || !row.skills.name) continue;
      if (!skillsMap[row.article_id]) {
        skillsMap[row.article_id] = [];
      }
      skillsMap[row.article_id].push(row.skills.name);
    }
  }
  return skillsMap;
};

export const buildContext = (
  articles: Omit<Tables<"articles">, "embedding">[],
  skillsMap: SkillsMap
): string => {
  return articles.reduce((acc, article, idx) => {
    const skillsArr = skillsMap[article.id] || [];
    const skills = skillsArr.join(", ");
    const articleContext =
      `Slug: project/${article.slug}\n` +
      `Title: ${article.title}\n` +
      (skills ? `Skills: ${skills}\n` : "") +
      `Description: ${article.description}\n` +
      `Article body: ${article.long_description}`;
    return acc + (idx > 0 ? "\n-----break------\n" : "") + articleContext;
  }, "");
};

export const getSimilarArticles = async (
  message: string
): Promise<{ context: string; tokens: number }> => {
  try {
    const supabase = await createClient();
    const searchResult = await searchArticles(supabase, message);
    if (!searchResult.articles.length) {
      return { context: "", tokens: searchResult.tokens };
    }
    const articleIds = searchResult.articles.map((a) => a.id);
    const skillsMap = await getSkills(supabase, articleIds);
    const context = buildContext(searchResult.articles, skillsMap);
    return {
      context,
      tokens: searchResult.tokens,
    };
  } catch (error) {
    console.error("Error in getSimilarArticles:", error);
    throw error;
  }
};
