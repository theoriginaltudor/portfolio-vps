import { createClient } from "@/lib/supabase/server";
import { createTransferFunction } from "@/lib/utils/api-enhanced";

/**
 * Enhanced transfer function for project assets using the new API utilities
 * This was missing from the original implementation and demonstrates
 * how to use the enhanced API patterns
 */
export const transferProjectAssetsToApiEnhanced = createTransferFunction(
  "/api/DataTransfer/project-assets",
  async () => {
    const supabase = await createClient();
    return await supabase
      .from("images")
      .select("path, articles(slug)");
  },
  (image) => ({
    projectSlug: image.articles?.slug || null,
    path: image.path || null,
    createdAt: new Date().toISOString(),
  }),
  "project assets"
);

/**
 * Enhanced version that adds validation and better error handling
 */
export async function transferProjectAssetsWithValidation() {
  const supabase = await createClient();
  
  // Fetch images with articles
  const { data: images, error: fetchError } = await supabase
    .from("images")
    .select("path, articles(slug)")
    .not("articles", "is", null); // Only images with associated articles

  if (fetchError) {
    console.error("Error fetching project assets:", fetchError);
    return { 
      ok: false, 
      error: fetchError.message, 
      status: 500,
      data: { count: 0, failed: 1 }
    };
  }

  // Validate and transform data
  const validAssets = (images ?? [])
    .filter(image => image.path && image.articles?.slug)
    .map(image => ({
      projectSlug: image.articles!.slug,
      path: image.path,
      createdAt: new Date().toISOString(),
    }));

  if (validAssets.length === 0) {
    return {
      ok: false,
      error: "No valid project assets found",
      status: 400,
      data: { count: 0, failed: 0 }
    };
  }

  // Use enhanced API utilities
  const { transferApi } = await import("@/lib/utils/api-enhanced");
  const result = await transferApi.projectAssets(validAssets);

  // Add additional metadata
  const totalImages = images?.length ?? 0;
  const skipped = totalImages - validAssets.length;

  if (result.ok) {
    return {
      ...result,
      data: {
        count: validAssets.length,
        skipped,
        total: totalImages
      }
    };
  }

  return result;
}

/**
 * Utility function to get project asset statistics
 */
export async function getProjectAssetStats() {
  const supabase = await createClient();
  
  const [
    { count: totalImages },
    { count: imagesWithArticles },
    { count: imagesWithoutArticles }
  ] = await Promise.all([
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }).not("article_id", "is", null),
    supabase.from("images").select("*", { count: "exact", head: true }).is("article_id", null)
  ]);

  return {
    total: totalImages ?? 0,
    withProjects: imagesWithArticles ?? 0,
    orphaned: imagesWithoutArticles ?? 0,
    readyForTransfer: imagesWithArticles ?? 0
  };
}