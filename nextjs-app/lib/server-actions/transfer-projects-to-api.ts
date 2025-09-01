import { createClient } from "@/lib/supabase/server";
import { apiCall } from "@/lib/utils/api";
import type { Tables } from "@/types/database.types";

export async function transferProjectsToApi() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("*");

  if (error) {
    console.error("Error fetching articles:", error);
    return { ok: false, error: error.message, status: 500 };
  }

  const articles = data as Tables<"articles">[] | null;

  const {
    ok,
    error: apiError,
    status,
  } = await apiCall("/api/DataTransfer/projects", {
    method: "POST",
    body: (articles ?? []).map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      longDescription: article.long_description,
      embedding: article.embedding
        ? (JSON.parse(article.embedding) as number[])
        : undefined,
      createdAt: new Date().toISOString(),
    })),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return { ok, error: apiError, status, data: { count: (articles ?? []).length } };
}
