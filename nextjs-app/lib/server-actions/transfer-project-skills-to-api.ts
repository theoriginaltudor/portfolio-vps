import { createClient } from '@/lib/supabase/server';
import { apiCall } from '@/lib/utils/api';

type ProjectSkillsQueryResult = {
  skills: { name: string } | null;
  articles: { slug: string } | null;
};

export async function transferProjectSkillsToApi() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles_skills')
    .select('skills(name), articles(slug)');

  if (error) {
    console.error('Error fetching project skills:', error);
    return { ok: false, error: error.message, status: 500 };
  }

  const projectSkills = data as ProjectSkillsQueryResult[] | null;

  const {
    ok,
    error: apiError,
    status,
  } = await apiCall('/api/DataTransfer/project-skills', {
    method: 'POST',
    body: (projectSkills ?? []).map(skill => ({
      skillName: skill.skills?.name,
      projectSlug: skill.articles?.slug,
    })),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    ok,
    error: apiError,
    status,
    data: { count: (projectSkills ?? []).length },
  };
}
