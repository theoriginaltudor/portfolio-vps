import { createClient } from "@/lib/supabase/server";
import { apiCall } from "@/lib/utils/api";
import type { Tables } from "@/types/database.types";

export async function transferSkillsToApi() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("skills").select("name");

  if (error) {
    console.error("Error fetching skills:", error);
    return { ok: false, error: error.message, status: 500 };
  }

  const skills = data as Pick<Tables<"skills">, "name">[] | null;

  const {
    ok,
    error: apiError,
    status,
  } = await apiCall("/api/DataTransfer/skills", {
    method: "POST",
    body: (skills ?? []).map((skill) => ({
      name: skill.name,
    })),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return { ok, error: apiError, status, data: { count: (skills ?? []).length } };
}
