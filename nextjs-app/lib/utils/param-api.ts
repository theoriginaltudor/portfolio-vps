import { paths } from "@/types/swagger-types";
import { getApiUrl } from "./get-url";

// Endpoints that contain path parameters (identified by having "/{" in the path)
// Excludes Login endpoints which should use authApiCall
export type ApiEndpoint = Extract<
  keyof paths & string,
  `${string}/{${string}}`
> extends infer T
  ? T extends `${string}/Login${string}`
    ? never
    : T
  : never;

type MethodNames = "get" | "post" | "put" | "delete";

// Resolve the shape of a specific HTTP method if it exists on the endpoint
type AnyMethod<
  TEndpoint extends ApiEndpoint,
  M extends MethodNames,
> = M extends keyof paths[TEndpoint] ? NonNullable<paths[TEndpoint][M]> : never;

// Extract union of possible path params objects for the endpoint across supported methods
type PathParams<TEndpoint extends ApiEndpoint> = {
  [M in MethodNames]: AnyMethod<TEndpoint, M> extends {
    parameters: { path: infer P };
  }
    ? P
    : never;
}[MethodNames];

// Extract response data for a specific method
type ResponseData<TEndpoint extends ApiEndpoint, TMethod extends MethodNames> =
  AnyMethod<TEndpoint, TMethod> extends {
    responses: {
      200: {
        content: {
          "application/json": infer T;
        };
      };
    };
  }
    ? T
    : AnyMethod<TEndpoint, TMethod> extends {
          responses: {
            200: {
              content: {
                "text/json": infer T;
              };
            };
          };
        }
      ? T
      : AnyMethod<TEndpoint, TMethod> extends {
            responses: {
              200: {
                content: {
                  "text/plain": infer T;
                };
              };
            };
          }
        ? T
        : never;

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

// Function overloads for each method to get proper type inference
export function paramApiCall<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options: {
    method: "GET";
    params: PathParams<TEndpoint>;
    query?: { fields?: string };
  } & Omit<RequestInit, "method" | "body">
): Promise<
  | { ok: true; data: ResponseData<TEndpoint, "get"> }
  | { ok: true; data?: undefined }
  | { ok: false; error: string; status: number }
>;

export function paramApiCall<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options: {
    method: "POST";
    params: PathParams<TEndpoint>;
    body?: unknown;
  } & Omit<RequestInit, "method" | "body">
): Promise<
  | { ok: true; data: ResponseData<TEndpoint, "post"> }
  | { ok: true; data?: undefined }
  | { ok: false; error: string; status: number }
>;

export function paramApiCall<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options: {
    method: "PUT";
    params: PathParams<TEndpoint>;
    body?: unknown;
  } & Omit<RequestInit, "method" | "body">
): Promise<
  | { ok: true; data: ResponseData<TEndpoint, "put"> }
  | { ok: true; data?: undefined }
  | { ok: false; error: string; status: number }
>;

export function paramApiCall<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options: {
    method: "DELETE";
    params: PathParams<TEndpoint>;
  } & Omit<RequestInit, "method" | "body">
): Promise<
  | { ok: true; data: ResponseData<TEndpoint, "delete"> }
  | { ok: true; data?: undefined }
  | { ok: false; error: string; status: number }
>;

// Default overload when method is not specified (defaults to GET)
export function paramApiCall<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options: {
    params: PathParams<TEndpoint>;
    body?: unknown;
    query?: { fields?: string };
  } & Omit<RequestInit, "method" | "body">
): Promise<
  | { ok: true; data: ResponseData<TEndpoint, "get"> }
  | { ok: true; data?: undefined }
  | { ok: false; error: string; status: number }
>;

// Implementation
export async function paramApiCall<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    params: PathParams<TEndpoint>;
    body?: unknown;
    query?: { fields?: string };
  } & Omit<RequestInit, "method" | "body">
): Promise<
  | { ok: true; data: unknown }
  | { ok: true; data?: undefined }
  | { ok: false; error: string; status: number }
> {
  const {
    params,
    body,
    headers,
    method = "GET",
    query,
    ...restOptions
  } = options;

  const { path, missing } = fillPathParams(endpoint, params);
  if (missing.length > 0) {
    return {
      ok: false as const,
      error: `Missing path parameter(s): ${missing.join(", ")} (Endpoint: ${endpoint})`,
      status: 0,
    };
  }

  const searchParams = new URLSearchParams();
  if (method === "GET" && query?.fields) {
    searchParams.set("fields", query.fields);
  }
  const queryString = searchParams.toString();
  const url = getApiUrl(
    (path as string) +
      (method === "GET" && queryString
        ? (String(path).includes("?") ? "&" : "?") + queryString
        : "")
  );

  try {
    const requestOptions: RequestInit = {
      method,
      headers: {
        Accept: "application/json",
        ...headers,
      },
      credentials: 'include', // Include cookies automatically
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
      const data = (await response.json()) as unknown;
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
        data: text as unknown,
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
}
