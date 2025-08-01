'use server';

import { createClient } from "@/lib/supabase/server";
import { TablesUpdate } from "@/types/database.types";
import { revalidatePath } from "next/cache";

export const updateArticle = async (formData: FormData, path: string): Promise<{ success: boolean }> => {
  try {
    if (!formData.get("id")) {
      console.error("Article ID is required for update.");
      return { success: false };
    }

    const { title, long_description, id } = Object.fromEntries(formData.entries());
    const articleId = Number(id);
    const supabase = await createClient();

    await updateArticleContent({ title, long_description }, articleId, supabase);

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error("Error in updateArticle:", error);
    return { success: false };
  }
}

const updateArticleContent = async (
  data: { title: FormDataEntryValue | null; long_description: FormDataEntryValue | null },
  articleId: number,
  supabase: Awaited<ReturnType<typeof createClient>>
) => {
  // Build update object with only defined values
  const updateData: TablesUpdate<"articles"> = {};
  if (data.title) updateData.title = data.title.toString();
  if (data.long_description) updateData.long_description = data.long_description.toString();

  // Only update if there's something to update
  if (Object.keys(updateData).length === 0) {
    throw new Error("No article content to update.");
  }

  const { error } = await supabase
    .from("articles")
    .update(updateData)
    .eq("id", articleId);

  if (error) {
    throw new Error(`Failed to update article: ${error.message}`);
  }
}