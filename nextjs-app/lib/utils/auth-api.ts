import { getApiUrl } from "./get-url";
import { cookies } from "next/headers";
import { paths } from "@/types/swagger-types";

// Type to filter paths that contain "/Login"
export type AuthEndpoint = {
  [K in keyof paths]: K extends `${string}/Login${string}` ? K : never;
}[keyof paths];

// Dedicated function for auth endpoints that need to handle cookies
export const authApiCall = async (
  endpoint: AuthEndpoint,
  options?: {
    method?: "GET" | "POST";
    body?: { username: string; password: string };
    headers?: Record<string, string>;
  }
) => {
  const url = getApiUrl(endpoint);
  
  try {
    // Get auth cookie for authenticated requests
    let authCookie = null;
    try {
      const cookieStore = await cookies();
      authCookie = cookieStore.get("auth");
    } catch {
      // cookies() might not be available in all contexts
    }
    
    const requestOptions: RequestInit = {
      method: options?.method || "POST",
      credentials: 'include',
      headers: {
        Accept: "application/json",
        ...(options?.method !== "GET" && { "Content-Type": "application/json" }),
        ...(authCookie && { Cookie: `auth=${authCookie.value}` }),
        ...options?.headers,
      },
    };

    if (options?.body && options.method !== "GET") {
      requestOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      return {
        ok: false as const,
        error: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    // Return response for cookie handling
    const data = response.status !== 204 ? await response.json() : null;
    return { 
      ok: true as const, 
      data, 
      response 
    };
  } catch (error) {
    return {
      ok: false as const,
      error: `${error instanceof Error ? error.message : "Unknown error"}`,
      status: 0,
    };
  }
};
