import { paramApiCall } from '@/lib/utils/param-api';
import { components } from '@/types/swagger-types';

export async function fetchProjectData(slug: string): Promise<{
  project: components['schemas']['ExtendedProjectGetDto'] | null;
  projectError: unknown;
}> {
  const response = await paramApiCall('/api/ExtendedProject/{slug}', {
    method: 'GET',
    params: { slug },
    headers: {
      Accept: 'application/json',
    },
  });
  let project: components['schemas']['ExtendedProjectGetDto'] | null = null;
  let projectError: unknown = null;

  if (response.ok && response.data) {
    project = response.data;
  } else if (!response.ok) {
    projectError = response.error;
  } else {
    projectError = 'Unknown error';
  }
  return { project, projectError };
}
