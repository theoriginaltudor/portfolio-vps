import type { Tables } from "@/types/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

interface JoinedSkill {
  skills: Tables<"skills">;
}

export interface JoinedProject extends Tables<"articles"> {
  images: Pick<Tables<"images">, "path">[];
  articles_skills: JoinedSkill[];
}


export async function fetchProjectData(
  supabase: SupabaseClient,
  slug: string
): Promise<{
  project: JoinedProject | null;
  projectError: unknown;
}> {
  const { data: project, error: projectError } = await supabase
    .from("articles")
    .select(
      `id, slug, title, description, long_description, images(path), articles_skills(skills(id, name))`
    )
    .eq("slug", slug)
    .single<JoinedProject>();
  return { project, projectError };
}
