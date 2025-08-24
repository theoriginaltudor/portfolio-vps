import { createClient } from "@/lib/supabase/server";
import { createTransferFunction, transferApi } from "@/lib/utils/api-enhanced";

/**
 * Enhanced transfer function using the new API utilities
 * This demonstrates the improved maintainability and type safety
 */
export const transferProjectsToApiEnhanced = createTransferFunction(
  "/api/DataTransfer/projects",
  async () => {
    const supabase = await createClient();
    return await supabase.from("articles").select("*");
  },
  (article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    longDescription: article.long_description,
    embedding: article.embedding
      ? (JSON.parse(article.embedding) as number[])
      : undefined,
    createdAt: new Date().toISOString(),
  }),
  "projects"
);

/**
 * Alternative implementation using the transferApi wrapper
 * This shows how the specialized API can be used directly
 */
export async function transferProjectsToApiDirect() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("articles").select("*");

  if (error) {
    console.error("Error fetching projects:", error);
    return { ok: false, error: error.message, status: 500 };
  }

  const transformedData = (data ?? []).map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    longDescription: article.long_description,
    embedding: article.embedding
      ? (JSON.parse(article.embedding) as number[])
      : undefined,
    createdAt: new Date().toISOString(),
  }));

  return await transferApi.projects(transformedData);
}

// Keep the original function for backward compatibility
export { transferProjectsToApi } from "./transfer-projects-to-api";