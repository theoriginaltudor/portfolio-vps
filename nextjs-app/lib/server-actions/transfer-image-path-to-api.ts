import { createClient } from '@/lib/supabase/server';
import { apiCall } from '@/lib/utils/api';

type ImagePathQueryResult = {
  path: string;
  articles: { slug: string } | null;
};

export async function transferImagesToApi() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('images')
    .select('path, articles(slug)');

  if (error) {
    console.error('Error fetching images:', error);
    return { ok: false, error: error.message, status: 500 };
  }

  const images = data as ImagePathQueryResult[] | null;

  const {
    ok,
    error: apiError,
    status,
  } = await apiCall('/api/DataTransfer/project-assets', {
    method: 'POST',
    body: (images ?? []).map(image => ({
      projectSlug: image.articles?.slug,
      path: image.path,
    })),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    ok,
    error: apiError,
    status,
    data: { count: (images ?? []).length },
  };
}
