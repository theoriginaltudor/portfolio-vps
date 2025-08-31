'use server';
import { apiCall } from "@/lib/utils/api";
import { components } from "@/types/swagger-types";
import { revalidatePath } from "next/cache";

export const addExistingSkill = async (formData: FormData, path: string) => {
  try {
    const articleId = Number(formData.get("articleId"));
    const skillId = Number(formData.get("skillId"));
    if (isNaN(articleId)) {
      throw new Error("Invalid articleId");
    }
    if (isNaN(skillId)) {
      throw new Error("Invalid skillId");
    }
    
    const projectSkill: components["schemas"]["ProjectSkill"] = {
      projectId: articleId,
      skillId: skillId,
    };
    
    const { ok, error } = await apiCall("/api/ProjectSkill", {
      method: "POST",
      body: projectSkill,
    });
    
    if (!ok) {
      console.error("Error adding skill:", error);
      return { success: false };
    }
    
    revalidatePath(path);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};


export const addNewSkill = async (formData: FormData, path: string) => {
  try {
    const skillName = formData.get("skillName") as string;
    const articleId = Number(formData.get("articleId"));
    if (!skillName) {
      throw new Error("Skill name is required");
    }
    if (isNaN(articleId)) {
      throw new Error("Invalid articleId");
    }
    
    // First, create the new skill
    const newSkill: components["schemas"]["Skill"] = {
      name: skillName,
    };
    
    const { ok: skillOk, error: skillError, data: skillData } = await apiCall("/api/Skill", {
      method: "POST",
      body: newSkill,
    });
    
    if (!skillOk || !skillData) {
      console.error("Error adding new skill:", skillError);
      return { success: false };
    }
    
    // Cast to single Skill object since POST returns a single skill, not an array
    const skill = skillData as unknown as components["schemas"]["Skill"];
    
    // Then, link the skill to the project
    const projectSkill: components["schemas"]["ProjectSkill"] = {
      projectId: articleId,
      skillId: skill.id,
    };
    
    const { ok: linkOk, error: linkError } = await apiCall("/api/ProjectSkill", {
      method: "POST",
      body: projectSkill,
    });
    
    if (!linkOk) {
      console.error("Error linking skill to article:", linkError);
      return { success: false, id: skill.id };
    }
    
    revalidatePath(path);
    return { success: true, skillId: skill.id };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};