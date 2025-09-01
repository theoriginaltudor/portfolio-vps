'use server';

import { paramApiCall } from "@/lib/utils/param-api";
import { components } from "@/types/swagger-types";
import { revalidatePath } from "next/cache";

export const updateArticle = async (formData: FormData, path: string): Promise<{ success: boolean }> => {
  try {
    const { title, longDescription, slug } = Object.fromEntries(formData.entries());
    
    if (!slug) {
      console.error("Project slug is required for update.");
      return { success: false };
    }

    const projectSlug = slug.toString();

    await updateArticleContent({ title, longDescription }, projectSlug);

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error("Error in updateArticle:", error);
    return { success: false };
  }
}

const updateArticleContent = async (
  data: { title: FormDataEntryValue | null; longDescription: FormDataEntryValue | null },
  projectSlug: string
) => {
  // Only update if there's something to update
  if (!data.title && !data.longDescription) {
    throw new Error("No article content to update.");
  }

  // Build the update object with only the fields that need to be updated
  const projectUpdate: Partial<components["schemas"]["Project"]> = {};
  
  if (data.title) {
    projectUpdate.title = data.title.toString();
  }
  
  if (data.longDescription) {
    projectUpdate.longDescription = data.longDescription.toString();
  }

  const result = await paramApiCall("/api/Project/{slug}", {
    method: "PUT",
    params: { slug: projectSlug },
    body: projectUpdate,
  });

  if (!result.ok) {
    throw new Error(`Failed to update article: ${result.error}`);
  }
}