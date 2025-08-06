import { createClient } from "@/lib/supabase/server";
import { apiCall } from "@/lib/utils/api";
import { cn } from "@/lib/utils/client";

export default async function DataTransferPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles_skills")
    .select("skills(name), articles(slug)");

  if (error) {
    console.error("Error fetching images:", error);
    return <div>Error fetching images</div>;
  }

  const { ok } = await apiCall("/api/DataTransfer/project-skills", {
    method: "POST",
    body: data.map((skill) => ({
      skillName: skill.skills?.name,
      projectSlug: skill.articles?.slug,
    })),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <main>
      <h1>API Response</h1>
      <pre className={cn("text-red-600", { "text-green-600": ok })}>
        {ok ? "Success" : "Error"}
      </pre>
    </main>
  );
}
