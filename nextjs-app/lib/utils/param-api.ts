import { paths } from "@/types/swagger-types";
import { getApiUrl } from "./get-url";

// Endpoints that contain path parameters (identified by having "/{" in the path)
export type ApiEndpoint = Extract<keyof paths & string, `${string}/{${string}`>;

type MethodNames = "get" | "post" | "put" | "delete";

type AnyMethod<TEndpoint extends ApiEndpoint, M extends MethodNames> =
  paths[TEndpoint] extends Record<M, unknown> ? paths[TEndpoint][M] : never;

// Extract union of possible path params objects for the endpoint across supported methods
type PathParams<TEndpoint extends ApiEndpoint> = {
  [M in MethodNames]: AnyMethod<TEndpoint, M> extends {
    parameters: { path: infer P };
  }
    ? P
    : never;
}[MethodNames];

// Extract possible request body types (JSON or multipart) across POST/PUT
type JsonBody<TEndpoint extends ApiEndpoint> =
  | (AnyMethod<TEndpoint, "post"> extends {
      requestBody?: { content: { "application/json": infer T } };
    }
      ? T
      : never)
  | (AnyMethod<TEndpoint, "put"> extends {
      requestBody?: { content: { "application/json": infer T } };
    }
      ? T
      : never);

type MultipartBody<TEndpoint extends ApiEndpoint> =
  | (AnyMethod<TEndpoint, "post"> extends {
      requestBody?: { content: { "multipart/form-data": infer T } };
    }
      ? T
      : never)
  | (AnyMethod<TEndpoint, "put"> extends {
      requestBody?: { content: { "multipart/form-data": infer T } };
    }
      ? T
      : never);

// Extract union of possible response JSON types across methods (for 200s with content)
type ResponseContentForMethod<
  TEndpoint extends ApiEndpoint,
  M extends MethodNames,
> =
  AnyMethod<TEndpoint, M> extends {
    responses: { 200: { content: { "application/json": infer T } } };
  }
    ? T
    : AnyMethod<TEndpoint, M> extends {
          responses: { 200: { content: { "text/plain": infer T } } };
        }
      ? T
      : never;

type ApiResponseData<TEndpoint extends ApiEndpoint> =
  | ResponseContentForMethod<TEndpoint, "get">
  | ResponseContentForMethod<TEndpoint, "post">
  | ResponseContentForMethod<TEndpoint, "put">
  | ResponseContentForMethod<TEndpoint, "delete">;

export type ApiRequestOptions<TEndpoint extends ApiEndpoint> = Omit<
  RequestInit,
  "method" | "body"
> & {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params: PathParams<TEndpoint>;
  body?: JsonBody<TEndpoint> | MultipartBody<TEndpoint> | string | FormData;
};

function fillPathParams<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  params: PathParams<TEndpoint>
) {
  const missing: string[] = [];
  const filled = (endpoint as string).replace(
    /\{([^}]+)\}/g,
    (_match, key: string) => {
      const value = (params as Record<string, unknown>)[key];
      if (value === undefined || value === null) {
        missing.push(key);
        return `{${key}}`;
      }
      return encodeURIComponent(String(value));
    }
  );
  return { path: filled, missing };
}

export const paramApiCall = async <TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options: ApiRequestOptions<TEndpoint>
) => {
  const {
    params,
    body,
    headers,
    method = "GET",
    ...restOptions
  } = options || ({} as ApiRequestOptions<TEndpoint>);

  const { path, missing } = fillPathParams(endpoint, params);
  if (missing.length > 0) {
    return {
      ok: false as const,
      error: `Missing path parameter(s): ${missing.join(", ")} (Endpoint: ${endpoint})`,
      status: 0,
    };
  }

  const url = getApiUrl(path as string);

  try {
    const requestOptions: RequestInit = {
      method,
      headers: {
        Accept: "application/json",
        ...headers,
      },
      ...restOptions,
    };

    if (body instanceof FormData) {
      requestOptions.body = body;
      // Let the browser set Content-Type for FormData
    } else if (body && typeof body === "object" && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
      requestOptions.headers = {
        ...(requestOptions.headers || {}),
        "Content-Type": "application/json",
      };
    } else if (typeof body === "string" && method !== "GET") {
      requestOptions.body = body;
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      return {
        ok: false as const,
        error: `HTTP ${response.status}: ${response.statusText} (URL: ${url})`,
        status: response.status,
      };
    }

    // Handle responses with or without content
    const contentType =
      response.headers.get("content-type")?.toLowerCase() || "";
    const statusNoContent = response.status === 204;

    if (statusNoContent) {
      return { ok: true as const };
    }

    if (contentType.includes("application/json")) {
      const data = (await response.json()) as ApiResponseData<TEndpoint>;
      return { ok: true as const, data };
    }

    // Some APIs might return 200 with empty body or text
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return { ok: true as const };
    }

    // If text/plain but typed content exists, return raw text
    if (contentType.startsWith("text/")) {
      return {
        ok: true as const,
        data: text as unknown as ApiResponseData<TEndpoint>,
      };
    }

    // Fallback: no parseable content
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: `${error instanceof Error ? error.message : "Unknown error"} (URL: ${getApiUrl(path as string)})`,
      status: 0,
    };
  }
};
