'use server';

import { redirect } from 'next/navigation';
import { apiCall } from '../../lib/utils/api';
import { paramApiCall } from '../../lib/utils/param-api';

export async function createArticle(data: FormData) {
  const slug = data.get('slug')?.toString().replace('/', '');
  const title = data.get('title')?.toString();
  const description = data.get('description')?.toString();
  const longDescription = data.get('longDescription')?.toString();
  const imageFiles = data.getAll('image') as File[];

  if (
    !slug ||
    !title ||
    !description ||
    !longDescription ||
    imageFiles.length === 0
  ) {
    throw new Error('Missing required fields');
  }

  let projectId: number | undefined = undefined;
  let createdAssets = [];
  try {
    // 1. Create project
    const { error: projectError, data: article } = await apiCall(
      '/api/Project',
      {
        method: 'POST',
        body: {
          slug,
          title,
          description,
          longDescription,
        },
      }
    );
    // Defensive: extract id as number if present
    // Extract id from article response (type assertion for id property)
    const id =
      typeof (article as { id?: number | null })?.id === 'number'
        ? (article as { id?: number | null }).id
        : undefined;
    if (projectError || !id) {
      throw new Error('Failed to create article', { cause: projectError });
    }
    projectId = id;

    // 2. Create project assets in batch
    const assetPayload = imageFiles.map(file => ({
      path: `/${file.name.split('_')[0]}/${file.name}`,
      projectId,
    }));
    const { error: assetError, data: assets } = await apiCall(
      '/api/ProjectAsset/batch',
      {
        method: 'POST',
        body: assetPayload,
      }
    );
    if (assetError || !Array.isArray(assets)) {
      // Compensation: delete project if projectId is defined
      if (projectId !== undefined) {
        await deleteProject(projectId);
      }
      throw new Error('Failed to create project assets', { cause: assetError });
    }
    createdAssets = assets;

    // 3. Transfer images
    const imageFormData = new FormData();
    imageFiles.forEach(file => {
      imageFormData.append('files', file);
    });
    const { error: transferError, ok: transferOk } = await apiCall(
      '/api/DataTransfer/images',
      {
        method: 'POST',
        body: imageFormData,
      }
    );
    if (transferError || !transferOk) {
      // Compensation: delete project assets, then project
      if (Array.isArray(createdAssets)) {
        for (const asset of createdAssets) {
          if (typeof asset?.id === 'number') {
            await paramApiCall('/api/ProjectAsset/{id}', {
              method: 'DELETE',
              params: { id: asset.id ?? 0 },
            });
          }
        }
      }
      if (projectId !== undefined) {
        deleteProject(projectId);
      }
      throw new Error('Failed to transfer images', { cause: transferError });
    }

    // All succeeded
    redirect('/articles');
  } catch (err) {
    // Optionally log error here
    throw err;
  }
}

async function deleteProject(projectId: number) {
  return await paramApiCall('/api/Project/{id}', {
    method: 'DELETE',
    params: { id: projectId },
  });
}
