import { operations } from "@/types/swagger-types";
import { getApiUrl } from "./get-api";

type ApiResponse<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
      status: number;
    };

async function apiCall<TOperation extends keyof operations>(
  endpoint: string,
  options?: RequestInit
): Promise<
  ApiResponse<
    operations[TOperation]["responses"][200]["content"]["application/json"]
  >
> {
  try {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
      status: 0,
    };
  }
}

export { apiCall };
export type { ApiResponse };
