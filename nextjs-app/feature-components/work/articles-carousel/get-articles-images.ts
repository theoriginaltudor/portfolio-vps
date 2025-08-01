import { Tables } from "@/types/database.types";


import type { SupabaseClient } from "@supabase/supabase-js";

interface UseArticleImagesParams {
  articleIds: number[];
  supabaseClient: SupabaseClient;
}


export const getArticlesImage = async ({ articleIds, supabaseClient }: UseArticleImagesParams) => {
  if (!articleIds.length) return [];
  const { data, error } = await supabaseClient
    .from("images")
    .select("article_id, path")
    .in("article_id", articleIds)
    .or("path.like.%_1.webp,path.like.%_desktop.webp");
  if (error || !data) return [];
  return data as Pick<Tables<"images">, "article_id" | "path">[];
};
