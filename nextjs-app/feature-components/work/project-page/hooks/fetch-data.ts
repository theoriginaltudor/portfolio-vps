import { components } from '@/types/swagger-types';
import { getExtendedProjects } from '../../../../lib/utils/api';

export async function fetchProjectData(slug: string): Promise<{
  project: components['schemas']['ExtendedProjectGetDto'] | null;
  projectError: unknown;
}> {
  const response = await getExtendedProjects(slug);
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
