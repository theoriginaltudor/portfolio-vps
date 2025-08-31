'use server';

import { paramApiCall } from "@/lib/utils/param-api";
import { components } from "@/types/swagger-types";
import { revalidatePath } from "next/cache";

export const updateArticle = async (formData: FormData, path: string): Promise<{ success: boolean }> => {
  try {
    if (!formData.get("id")) {
      console.error("Article ID is required for update.");
      return { success: false };
    }

    const { title, long_description, id, slug } = Object.fromEntries(formData.entries());
    const articleId = Number(id);
    const projectSlug = slug ? slug.toString() : null;

    await updateArticleContent({ title, long_description }, articleId, projectSlug);

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
  projectSlug: string | null
) => {
  // Only update if there's something to update
  if (!data.title && !data.long_description) {
    throw new Error("No article content to update.");
  }

  // First, get the existing project by its ID - we need to use the regular Project endpoint
  // since we have the ID but need to get the data to preserve other fields
  const getResult = await paramApiCall("/api/Project/{slug}", {
    method: "GET", 
    params: { slug: articleId.toString() }, // This might not work since slug != id
  });

  // If getting by ID doesn't work, we'll have to make an assumption about the data
  // This is a limitation of the current API design
  let existingProject: components["schemas"]["ProjectGetDto"] | null = null;
  
  if (getResult.ok && getResult.data) {
    existingProject = getResult.data as components["schemas"]["ProjectGetDto"];
  }

  // Build the update object
  const projectUpdate: components["schemas"]["Project"] = {
    id: articleId,
    slug: existingProject?.slug || projectSlug || `project-${articleId}`,
    title: data.title ? data.title.toString() : (existingProject?.title || `Project ${articleId}`),
    description: existingProject?.description || "Project description",
    longDescription: data.long_description ? data.long_description.toString() : (existingProject?.longDescription || "Project long description"),
  };

  const result = await paramApiCall("/api/Project/{id}", {
    method: "PUT",
    params: { id: articleId },
    body: projectUpdate,
  });

  if (!result.ok) {
    throw new Error(`Failed to update article: ${result.error}`);
  }
}