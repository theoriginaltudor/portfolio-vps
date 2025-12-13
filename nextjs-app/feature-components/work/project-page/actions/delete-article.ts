'use server';

import { redirect } from 'next/navigation';
import { deleteProjectCall } from '../../../../lib/utils/api';

export async function deleteProject(data: FormData) {
  const projectId = data.get('projectId')?.toString();

  if (!projectId) {
    throw new Error('Missing project ID');
  }

  const { ok, error } = await deleteProjectCall(projectId);

  if (!ok) {
    throw new Error('Failed to delete Project', { cause: error });
  }

  redirect('/projects');
}
