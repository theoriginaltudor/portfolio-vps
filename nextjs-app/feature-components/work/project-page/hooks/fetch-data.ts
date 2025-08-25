import { paramApiCall } from "@/lib/utils/param-api";
import { components } from "@/types/swagger-types";

export async function fetchProjectData(slug: string): Promise<{
  project: components["schemas"]["Project"] | null;
  projectError: unknown;
}> {
  const response = await paramApiCall("/api/Project/{slug}", {
    method: "GET",
    params: { slug },
    headers: {
      Accept: "application/json",
    },
  });
  let project: components["schemas"]["Project"] | null = null;
  let projectError: unknown = null;

  if (response.ok && response.data) {
    project = response.data as components["schemas"]["Project"];
  } else if (!response.ok) {
    projectError = response.error;
  } else {
    projectError = "Unknown error";
  }
  return { project, projectError };
}
