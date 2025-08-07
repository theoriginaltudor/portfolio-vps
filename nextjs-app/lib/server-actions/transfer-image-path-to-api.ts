import { createClient } from "@/lib/supabase/server";
import { apiCall } from "@/lib/utils/api";

export async function transferImagesToApi() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("images")
    .select("path, articles(slug)");

  if (error) {
    console.error("Error fetching images:", error);
    return { ok: false, error: error.message, status: 500 };
  }

  const {
    ok,
    error: apiError,
    status,
  } = await apiCall("/api/DataTransfer/project-assets", {
    method: "POST",
    body: data.map((image) => ({
      projectSlug: image.articles?.slug,
      path: image.path,
    })),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return { ok, error: apiError, status };
}
