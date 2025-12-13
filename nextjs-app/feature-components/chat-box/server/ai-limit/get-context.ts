import { google } from '@ai-sdk/google';
import { embed } from 'ai';
import { searchProject } from '@/lib/utils/api';
import { components } from '@/types/swagger-types';

const embeddingModel = google.textEmbeddingModel('text-embedding-005');

// Use the types from your swagger schema
type ProjectSearchResult = components['schemas']['ProjectSearchResult'];

export interface SearchProjectsResult {
  projects: ProjectSearchResult[];
  tokens: number;
}

export interface SkillsMap {
  [projectSlug: string]: string[];
}

export const searchProjects = async (
  message: string
): Promise<SearchProjectsResult | { projects: []; tokens: number }> => {
  try {
    const searchTerm = await embed({
      model: embeddingModel,
      value: message,
    });
    const tokens = searchTerm.usage?.tokens || 0;

    // Use your API call utility for the search endpoint
    const result = await searchProject({
      queryEmbedding: searchTerm.embedding,
      matchThreshold: 0.4,
      matchCount: 3,
    });

    if (!result.ok) {
      console.error('Error fetching data from API:', result.error);
      return { projects: [], tokens };
    }

    const data = result.data || [];

    if (!data || data.length === 0) {
      return { projects: [], tokens };
    }

    return {
      projects: data,
      tokens,
    };
  } catch (error) {
    console.error('Error in searchProjects:', error);
    return { projects: [], tokens: 0 };
  }
};

export const getSkills = (projects: ProjectSearchResult[]): SkillsMap => {
  const skillsMap: SkillsMap = {};

  projects.forEach(project => {
    const slug = project.slug;

    if (slug) {
      if (project.skills && project.skills.length > 0) {
        skillsMap[slug] = project.skills
          .map(skill => skill.name)
          .filter(Boolean) as string[];
      } else {
        skillsMap[slug] = [];
      }
    }
  });

  return skillsMap;
};

export const buildContext = (
  projects: ProjectSearchResult[],
  skillsMap: SkillsMap
): string => {
  return projects.reduce((acc, project, idx) => {
    const skillsArr = project.slug ? skillsMap[project.slug] || [] : [];
    const skills = skillsArr.join(', ');
    const projectContext =
      `Slug: project/${project.slug || ''}\n` +
      `Title: ${project.title || ''}\n` +
      (skills ? `Skills: ${skills}\n` : '') +
      `Description: ${project.description || ''}\n` +
      `Project body: ${project.longDescription || project.description || ''}`;
    return acc + (idx > 0 ? '\n-----break------\n' : '') + projectContext;
  }, '');
};

export const getSimilarArticles = async (
  message: string
): Promise<{ context: string; tokens: number }> => {
  try {
    const searchResult = await searchProjects(message);
    if (!searchResult.projects.length) {
      return { context: '', tokens: searchResult.tokens };
    }

    const skillsMap = getSkills(searchResult.projects);
    const context = buildContext(searchResult.projects, skillsMap);

    return {
      context,
      tokens: searchResult.tokens,
    };
  } catch (error) {
    console.error('Error in getSimilarArticles:', error);
    throw error;
  }
};
