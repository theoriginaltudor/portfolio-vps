'use server';
import { createClient } from "@/lib/supabase/server";
import { Tables, TablesInsert } from "@/types/database.types";
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
    const supabase = await createClient();
    const insertData: Tables<"articles_skills"> = {
      article_id: articleId,
      skill_id: skillId,
    };
    const { error } = await supabase.from("articles_skills").insert(insertData);
    if (error) {
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
    const supabase = await createClient();
    const { data: skill, error: skillError } = await supabase
      .from("skills")
      .insert({ name: skillName })
      .select("id")
      .single();
    if (skillError || !skill) {
      console.error("Error adding new skill:", skillError);
      return { success: false };
    }
    const insertData: TablesInsert<"articles_skills"> = {
      article_id: articleId,
      skill_id: skill.id,
    };
    const { error: articleSkillError } = await supabase
      .from("articles_skills")
      .insert(insertData);
    if (articleSkillError) {
      console.error("Error linking skill to article:", articleSkillError);
      return { success: false, id: skill.id };
    }
    revalidatePath(path);
    return { success: true, skillId: skill.id };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};