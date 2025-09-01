'use server';
import { paramApiCall } from "@/lib/utils/param-api";
import { revalidatePath } from "next/cache";

export const detachSkill = async (formData: FormData, path: string): Promise<{ success: boolean }> => {
  try {
    const skillIdRaw = formData.get("skillId");
    const articleIdRaw = formData.get("articleId");
    if (!skillIdRaw || !articleIdRaw) {
      throw new Error("Both skillId and articleId are required");
    }
    const skillId = Number(skillIdRaw);
    const articleId = Number(articleIdRaw);
    if (isNaN(articleId) || isNaN(skillId)) {
      throw new Error("Invalid articleId or skillId: must be a number");
    }
    
    const result = await paramApiCall("/api/ProjectSkill/{projectId}/{skillId}", {
      method: "DELETE",
      params: { projectId: articleId, skillId: skillId },
    });
    
    if (!result.ok) {
      throw new Error(`Failed to remove skill from article: ${result.error}`);
    }
    
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error("Error in detachSkill:", error);
    return { success: false };
  }
}