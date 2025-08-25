import { paths } from "@/types/swagger-types";
import { getApiUrl } from "./get-url";

export type ApiEndpoint = {
  [K in keyof paths]: K extends `${string}/{${string}` ? never : K;
}[keyof paths];

// Prefer GET response type when both GET and POST exist and method is omitted
type ApiResponseData<TEndpoint extends ApiEndpoint> = paths[TEndpoint] extends {
  get: {
    responses: { 200: { content: { "application/json": infer T } } };
  };
}
  ? T
  : paths[TEndpoint] extends {
        post: {
          responses: { 200: { content: { "application/json": infer T } } };
        };
      }
    ? T
    : unknown;

// Request options: default to GET when method is omitted; require method: "POST" when posting
type GetOptions<TEndpoint extends ApiEndpoint> = paths[TEndpoint] extends {
  get: unknown;
}
  ? Omit<RequestInit, "method" | "body"> & { method?: "GET" }
  : never;

type PostJsonOptions<TEndpoint extends ApiEndpoint> = paths[TEndpoint] extends {
  post: { requestBody?: { content: { "application/json": infer TBody } } };
}
  ? Omit<RequestInit, "method" | "body"> & { method: "POST"; body?: TBody }
  : never;

type PostMultipartOptions<TEndpoint extends ApiEndpoint> =
  paths[TEndpoint] extends {
    post: { requestBody?: { content: { "multipart/form-data": infer TBody } } };
  }
    ? Omit<RequestInit, "method" | "body"> & {
        method: "POST";
        body?: TBody | FormData;
      }
    : never;

type ApiRequestOptions<TEndpoint extends ApiEndpoint> =
  | GetOptions<TEndpoint>
  | PostJsonOptions<TEndpoint>
  | PostMultipartOptions<TEndpoint>;

export const apiCall = async <TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options?: ApiRequestOptions<TEndpoint>
) => {
  const url = getApiUrl(endpoint);
  try {
    const { body, headers, method, ...restOptions } = (options || {}) as
      | (GetOptions<TEndpoint> & { body?: unknown })
      | (PostJsonOptions<TEndpoint> & { body?: unknown })
      | (PostMultipartOptions<TEndpoint> & { body?: unknown });

    const requestOptions: RequestInit = {
      method,
      headers: {
        Accept: "application/json",
        ...headers,
      },
      ...restOptions,
    };

    // Only attach a body for non-GET requests
    if (method && method !== "GET") {
      if (body instanceof FormData) {
        requestOptions.body = body;
      } else if (body && typeof body === "object") {
        requestOptions.body = JSON.stringify(body);
        requestOptions.headers = {
          ...requestOptions.headers,
          "Content-Type": "application/json",
        };
      } else if (typeof body === "string") {
        requestOptions.body = body;
      }
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      return {
        ok: false as const,
        error: `HTTP ${response.status}: ${response.statusText} (URL: ${url})`,
        status: response.status,
      };
    }

    // Gracefully handle no-content responses or non-JSON payloads
    const contentType =
      response.headers.get("content-type")?.toLowerCase() || "";
    if (response.status === 204) {
      return { ok: true as const };
    }

    if (contentType.includes("application/json")) {
      const data = (await response.json()) as ApiResponseData<TEndpoint>;
      return { ok: true as const, data };
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return { ok: true as const };
    }
    if (contentType.startsWith("text/")) {
      return {
        ok: true as const,
        data: text as unknown as ApiResponseData<TEndpoint>,
      };
    }
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: `${error instanceof Error ? error.message : "Unknown error"} (URL: ${url})`,
      status: 0,
    };
  }
};
