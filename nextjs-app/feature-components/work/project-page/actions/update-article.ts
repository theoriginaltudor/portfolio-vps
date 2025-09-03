'use server';

import { paramApiCall } from "@/lib/utils/param-api";
import { components } from "@/types/swagger-types";
import { revalidatePath } from "next/cache";

export const updateArticle = async (formData: FormData, path: string): Promise<{ success: boolean }> => {
  try {
    const { title, longDescription, id } = Object.fromEntries(formData.entries());

    if (!id) {
      console.error("Project ID is required for update.");
      return { success: false };
    }

    const projectId = Number(id);

    await updateArticleContent({ title, longDescription }, projectId);

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error("Error in updateArticle:", error);
    return { success: false };
  }
}

const updateArticleContent = async (
  data: { title: FormDataEntryValue | null; longDescription: FormDataEntryValue | null },
  projectId: number
) => {
  // Build the update object with only the fields that need to be updated
  const projectUpdate: components["schemas"]["ProjectGetDto"] = {id: projectId};

  if (data.title) {
    projectUpdate.title = data.title.toString();
  }
  
  if (data.longDescription) {
    projectUpdate.longDescription = data.longDescription.toString();
  }

  // Only update if there's something to update
  if (Object.keys(projectUpdate).length === 0) {
    throw new Error("No article content to update.");
  }

  const result = await paramApiCall("/api/Project/{id}", {
    method: "PUT",
    params: { id: projectId },
    body: projectUpdate,
  });

  if (!result.ok) {
    throw new Error(`Failed to update article: ${result.error}`);
  }
}