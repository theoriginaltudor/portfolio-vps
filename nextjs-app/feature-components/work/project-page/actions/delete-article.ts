'use server';

import { redirect } from 'next/navigation';
import { paramApiCall } from '@/lib/utils/param-api';

export async function deleteProject(data: FormData) {
  const projectId = data.get('projectId')?.toString();

  if (!projectId) {
    throw new Error('Missing project ID');
  }

  const { ok, error } = await paramApiCall(`/api/Project/{id}`, {
    method: 'DELETE',
    params: { id: projectId },
  });

  if (!ok) {
    throw new Error('Failed to delete Project', { cause: error });
  }

  redirect('/projects');
}
