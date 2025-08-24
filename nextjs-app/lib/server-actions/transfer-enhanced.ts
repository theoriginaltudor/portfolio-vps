import { createClient } from "@/lib/supabase/server";
import { createTransferFunction, transferApi } from "@/lib/utils/api-enhanced";

/**
 * Enhanced transfer function for skills using the new API utilities
 */
export const transferSkillsToApiEnhanced = createTransferFunction(
  "/api/DataTransfer/skills",
  async () => {
    const supabase = await createClient();
    return await supabase.from("skills").select("name");
  },
  (skill) => ({
    name: skill.name,
    createdAt: new Date().toISOString(),
  }),
  "skills"
);

/**
 * Enhanced transfer function for project skills
 */
export const transferProjectSkillsToApiEnhanced = createTransferFunction(
  "/api/DataTransfer/project-skills",
  async () => {
    const supabase = await createClient();
    return await supabase
      .from("articles_skills")
      .select("skills(name), articles(slug)");
  },
  (projectSkill) => ({
    skillName: projectSkill.skills?.name,
    projectSlug: projectSkill.articles?.slug,
    createdAt: new Date().toISOString(),
  }),
  "project skills"
);

/**
 * Enhanced transfer function for project assets (images)
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
    projectSlug: image.articles?.slug,
    path: image.path,
    createdAt: new Date().toISOString(),
  }),
  "project assets"
);

/**
 * Enhanced blob transfer function with better error handling
 */
export async function transferBlobToApiEnhanced() {
  const supabase = await createClient();
  const { data: images, error: imagesError } = await supabase
    .from("images")
    .select("path");

  // Add example image for testing
  images?.push({ path: "/tc1_1.webp" });

  if (imagesError) {
    console.error("Error fetching images:", imagesError);
    return { ok: false, error: imagesError.message, status: 500 };
  }

  const blobList: FormData = new FormData();
  let downloaded = 0;
  let failed = 0;

  await Promise.all(
    (images ?? []).map(async (image: { path: string }) => {
      try {
        const { data, error } = await supabase.storage
          .from("portfolio-images")
          .download(image.path);

        if (error) {
          console.error("Error downloading image:", error);
          failed += 1;
          return;
        }

        const file = new File([data], image.path);
        blobList.append("files", file, image.path);
        downloaded += 1;
      } catch (err) {
        console.error("Unexpected error downloading image:", err);
        failed += 1;
      }
    })
  );

  const result = await transferApi.images(blobList);
  
  // Enhance the response with download stats
  if (result.ok) {
    return {
      ...result,
      data: { count: downloaded, failed },
    };
  }
  
  return result;
}

// Export individual API wrappers for direct use
export const skillsApi = {
  transfer: transferSkillsToApiEnhanced,
  get: () => transferApi.skills,
};

export const projectSkillsApi = {
  transfer: transferProjectSkillsToApiEnhanced,
};

export const projectAssetsApi = {
  transfer: transferProjectAssetsToApiEnhanced,
  transferBlobs: transferBlobToApiEnhanced,
};