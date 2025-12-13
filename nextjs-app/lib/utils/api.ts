import { getApiUrl } from './get-url';
import { getAccessToken } from './get-token';

type Options = Omit<RequestInit, 'body'> & {
  body?: FormData | Object | string | null;
};

export const apiCall = async (endpoint: string, options?: Options) => {
  const { body, headers, method, ...restOptions } = options || {};

  const isGet = !method || method === 'GET';
  const query =
    isGet && options && typeof options === 'object' && 'query' in options
      ? (options as { query?: { fields?: string } }).query
      : undefined;
  const searchParams = new URLSearchParams();
  if (isGet && query?.fields) searchParams.set('fields', query.fields);
  const queryString = searchParams.toString();
  const endpointWithQs =
    isGet && queryString
      ? (endpoint as string) +
        (String(endpoint).includes('?') ? '&' : '?') +
        queryString
      : (endpoint as string);
  const url = getApiUrl(endpointWithQs);
  try {
    const token = await getAccessToken();

    const requestOptions: RequestInit = {
      method,
      credentials: 'include', // Include cookies automatically
      headers: {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      ...restOptions,
    };

    // Only attach a body for non-GET requests
    if (method && method !== 'GET') {
      if (body instanceof FormData) {
        requestOptions.body = body;
      } else if (body && typeof body === 'object') {
        requestOptions.body = JSON.stringify(body);
        requestOptions.headers = {
          ...requestOptions.headers,
          'Content-Type': 'application/json',
        };
      } else if (typeof body === 'string') {
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
      response.headers.get('content-type')?.toLowerCase() || '';
    if (response.status === 204) {
      return { ok: true as const };
    }

    if (contentType.includes('application/json')) {
      const data = (await response.json()) as unknown;
      return { ok: true as const, data };
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return { ok: true as const };
    }
    if (contentType.startsWith('text/')) {
      return {
        ok: true as const,
        data: text as unknown,
      };
    }
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: `${error instanceof Error ? error.message : 'Unknown error'} (URL: ${url})`,
      status: 0,
    };
  }
};

export const getProjects = (projectSlug?: string) =>
  apiCall('/api/Project' + (projectSlug ? `/${projectSlug}` : ''));
export const getProjectAssets = () => apiCall('/api/ProjectAsset');
export const getProjectSkills = (projectId?: number) =>
  apiCall('/api/ProjectSkill' + (projectId ? `/project/${projectId}` : ''));
export const getSkills = (skillId?: number) =>
  apiCall('/api/Skill' + (skillId ? `/${skillId}` : ''));
interface SearchBody {
  queryEmbedding: number[];
  matchThreshold: number;
  matchCount: number;
}
export const searchProject = (body: SearchBody) =>
  apiCall('/api/ProjectSearch/search', {
    method: 'POST',
    body: body,
  });
export const deleteProjectCall = (projectId: string) =>
  apiCall(`/api/Project/${projectId}`, {
    method: 'DELETE',
  });
export const getExtendedProjects = (slug: string) =>
  apiCall(`/api/ExtendedProject/${slug}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

export const updateProject = (
  projectId: number,
  body: { embedding: number[] }
) =>
  apiCall(`/api/Project/${projectId}`, {
    method: 'PUT',
    body,
  });
