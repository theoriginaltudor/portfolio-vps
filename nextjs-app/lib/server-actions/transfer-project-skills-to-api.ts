import { createClient } from "@/lib/supabase/server";
import { apiCall } from "@/lib/utils/api";

export async function transferProjectSkillsToApi() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles_skills")
    .select("skills(name), articles(slug)");

  if (error) {
    console.error("Error fetching project skills:", error);
    return { ok: false, error: error.message, status: 500 };
  }

  const {
    ok,
    error: apiError,
    status,
  } = await apiCall("/api/DataTransfer/project-skills", {
    method: "POST",
    body: data.map((skill) => ({
      skillName: skill.skills?.name,
      projectSlug: skill.articles?.slug,
    })),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return { ok, error: apiError, status };
}
