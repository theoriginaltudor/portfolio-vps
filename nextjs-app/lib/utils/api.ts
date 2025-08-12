import { paths } from "@/types/swagger-types";
import { getApiUrl } from "./get-url";

export type ApiEndpoint = keyof paths;

type ApiResponseData<TEndpoint extends ApiEndpoint> = paths[TEndpoint] extends {
  post: {
    responses: { 200: { content: { "application/json": infer T } } };
  };
}
  ? T
  : paths[TEndpoint] extends {
      get: {
        responses: { 200: { content: { "application/json": infer T } } };
      };
    }
  ? T
  : unknown;

type ApiRequestOptions<TEndpoint extends ApiEndpoint> =
  paths[TEndpoint] extends {
    post: {
      requestBody?: {
        content: {
          "application/json": infer TBody;
        };
      };
    };
  }
    ? Omit<RequestInit, "method" | "body"> & {
        method?: "POST";
        body?: TBody;
      }
    : paths[TEndpoint] extends {
        post: {
          requestBody?: {
            content: {
              "multipart/form-data": infer TBody;
            };
          };
        };
      }
    ? Omit<RequestInit, "method" | "body"> & {
        method?: "POST";
        body?: TBody | FormData;
      }
    : paths[TEndpoint] extends {
        get: unknown;
      }
    ? Omit<RequestInit, "method"> & {
        method?: "GET";
      }
    : RequestInit;

export const apiCall = async <TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options?: ApiRequestOptions<TEndpoint>
) => {
  const url = getApiUrl(endpoint);
  try {
    const { body, headers, ...restOptions } = options || {};

    const requestOptions: RequestInit = {
      headers: {
        Accept: "application/json",
        ...headers,
      },
      ...restOptions,
    };

    // Handle body serialization for different content types
    if (body instanceof FormData) {
      // For FormData, let the browser set the Content-Type header (including boundary)
      requestOptions.body = body;
    } else if (body && typeof body === "object") {
      // For JSON objects, serialize and set Content-Type
      requestOptions.body = JSON.stringify(body);
      requestOptions.headers = {
        ...requestOptions.headers,
        "Content-Type": "application/json",
      };
    } else if (body && typeof body === "string") {
      requestOptions.body = body;
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      return {
        ok: false,
        error: `HTTP ${response.status}: ${response.statusText} (URL: ${url})`,
        status: response.status,
      };
    }

    const data = (await response.json()) as ApiResponseData<TEndpoint>;
    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: `${
        error instanceof Error ? error.message : "Unknown error"
      } (URL: ${url})`,
      status: 0,
    };
  }
};
