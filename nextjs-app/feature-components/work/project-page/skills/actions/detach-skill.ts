'use server';
import { createClient } from "@/lib/supabase/server";
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
    const supabase = await createClient();
    const { error } = await supabase
      .from("articles_skills")
      .delete()
      .eq("article_id", articleId)
      .eq("skill_id", skillId);
    if (error) {
      throw new Error(`Failed to remove skill from article: ${error.message}`);
    }
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error("Error in detachSkill:", error);
    return { success: false };
  }
}