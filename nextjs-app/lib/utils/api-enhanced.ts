import type { components } from "../../types/swagger-types";
import { ApiEndpoint, apiCall } from "./api";

// Simplified type definitions for better compatibility
export type GetEndpoint = 
  | "/api/Project"
  | "/api/ProjectAsset"
  | "/api/ProjectSkill"
  | "/api/Skill";

export type PostEndpoint = 
  | "/api/DataTransfer/images"
  | "/api/DataTransfer/projects"
  | "/api/DataTransfer/skills"
  | "/api/DataTransfer/project-skills"
  | "/api/DataTransfer/project-assets";

export type DataTransferEndpoint = PostEndpoint;

// Specialized response types
export type ApiSuccessResponse<T> = {
  ok: true;
  data: T;
};

export type ApiErrorResponse = {
  ok: false;
  error: string;
  status: number;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Standard response for transfer operations
export type TransferResponse = ApiResponse<{ count: number; failed?: number }>;

// DTO types from swagger
export type ProjectDto = components["schemas"]["ProjectDto"];
export type SkillDto = components["schemas"]["SkillDto"];
export type ProjectSkillDto = components["schemas"]["ProjectSkillDto"];
export type ProjectAssetDto = components["schemas"]["ProjectAssetDto"];

// Helper function to standardize responses
export const standardizeResponse = <T>(
  result: Awaited<ReturnType<typeof apiCall>>,
  additionalData?: Record<string, unknown>
): ApiResponse<T> => {
  if (result.ok) {
    const combinedData = additionalData 
      ? { ...(result.data as Record<string, unknown> || {}), ...additionalData }
      : result.data;
    return {
      ok: true,
      data: combinedData as T,
    };
  }
  return {
    ok: false,
    error: result.error || "Unknown error",
    status: result.status || 0,
  };
};

/**
 * Specialized function for GET requests to entity endpoints
 * Better type inference and cleaner API for fetching data
 */
export const apiGet = async (
  endpoint: GetEndpoint
): Promise<ApiResponse<unknown>> => {
  const result = await apiCall(endpoint as ApiEndpoint, { method: "GET" } as RequestInit);
  return standardizeResponse(result);
};

/**
 * Specialized function for POST requests with JSON payload
 * Better type inference for request body and response
 */
export const apiPost = async (
  endpoint: PostEndpoint,
  body: unknown,
  options?: Omit<RequestInit, "method" | "body">
): Promise<ApiResponse<unknown>> => {
  const result = await apiCall(endpoint as ApiEndpoint, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  } as RequestInit);
  return standardizeResponse(result);
};

/**
 * Specialized function for file uploads with FormData
 * Handles multipart/form-data requests properly
 */
export const apiUpload = async (
  endpoint: PostEndpoint,
  formData: FormData,
  options?: Omit<RequestInit, "method" | "body">
): Promise<ApiResponse<void>> => {
  const result = await apiCall(endpoint as ApiEndpoint, {
    method: "POST",
    body: formData,
    ...options,
  } as RequestInit);
  return standardizeResponse(result);
};

/**
 * Specialized function for data transfer operations
 * Includes common patterns like counting records and error handling
 */
export const dataTransferPost = async (
  endpoint: DataTransferEndpoint,
  data: unknown[],
  options?: Omit<RequestInit, "method" | "body">
): Promise<TransferResponse> => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      ok: false,
      error: "No data provided for transfer",
      status: 400,
    };
  }

  const result = await apiCall(endpoint as ApiEndpoint, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  } as unknown as RequestInit);

  return standardizeResponse(result, { count: data.length });
};

/**
 * Factory function to create standardized transfer functions
 * Reduces code duplication in server actions
 */
export const createTransferFunction = <TData, TDto>(
  endpoint: DataTransferEndpoint,
  dataFetcher: () => Promise<{ data: TData[] | null; error: unknown }>,
  dataTransformer: (item: TData) => TDto,
  errorContext: string
) => {
  return async (): Promise<TransferResponse> => {
    const { data, error } = await dataFetcher();

    if (error) {
      console.error(`Error fetching ${errorContext}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { ok: false, error: errorMessage, status: 500 };
    }

    const transformedData = (data ?? []).map(dataTransformer);
    return await dataTransferPost(endpoint, transformedData);
  };
};

/**
 * Batch operation helper for processing multiple endpoints
 * Useful for bulk operations and health checks
 */
export const apiBatch = async (
  endpoints: readonly GetEndpoint[]
): Promise<Record<string, ApiResponse<unknown>>> => {
  const results = await Promise.all(
    endpoints.map(async (endpoint) => {
      try {
        return {
          endpoint,
          result: await apiGet(endpoint),
        };
      } catch (err) {
        return {
          endpoint,
          result: {
            ok: false,
            error: err instanceof Error ? err.message : "Unknown error",
            status: 0,
          } as ApiErrorResponse,
        };
      }
    })
  );

  return results.reduce((acc, { endpoint, result }) => {
    acc[endpoint] = result;
    return acc;
  }, {} as Record<string, ApiResponse<unknown>>);
};

/**
 * Type-safe wrapper for entity endpoints
 * Provides better TypeScript inference for common entity operations
 */
export const entityApi = {
  projects: () => apiGet("/api/Project"),
  projectAssets: () => apiGet("/api/ProjectAsset"),
  projectSkills: () => apiGet("/api/ProjectSkill"),
  skills: () => apiGet("/api/Skill"),
} as const;

/**
 * Type-safe wrapper for data transfer endpoints
 * Provides better TypeScript inference for transfer operations
 */
export const transferApi = {
  projects: (data: ProjectDto[]) =>
    dataTransferPost("/api/DataTransfer/projects", data),
  
  skills: (data: SkillDto[]) =>
    dataTransferPost("/api/DataTransfer/skills", data),
  
  projectSkills: (data: ProjectSkillDto[]) =>
    dataTransferPost("/api/DataTransfer/project-skills", data),
  
  projectAssets: (data: ProjectAssetDto[]) =>
    dataTransferPost("/api/DataTransfer/project-assets", data),
  
  images: (formData: FormData) =>
    apiUpload("/api/DataTransfer/images", formData),
} as const;