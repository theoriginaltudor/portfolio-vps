import { embed } from 'ai';
import { google } from '@ai-sdk/google';
import { apiCall } from '@/lib/utils/api';
import { paramApiCall } from '@/lib/utils/param-api';

const model = google.textEmbeddingModel('text-embedding-005');

async function getProjects() {
  const { ok, data, error } = await apiCall('/api/Project', {
    method: 'GET',
  });

  if (!ok || !data) {
    console.error('Error fetching projects:', error);
    throw new Error(`Error fetching projects: ${error}`);
  }

  return data;
}

async function getProjectSkills(projectId: number) {
  const result = await paramApiCall('/api/ProjectSkill/project/{projectId}', {
    method: 'GET',
    params: { projectId },
  });

  if (!result.ok) {
    console.error('Error fetching project skills:', result.error);
    return [];
  }

  if (!result.data) {
    return [];
  }

  // Get skill details for each project skill
  const skills: string[] = [];

  for (const ps of result.data) {
    if (ps.skillId) {
      const skillResult = await paramApiCall('/api/Skill/{id}', {
        method: 'GET',
        params: { id: ps.skillId },
      });
      if (skillResult.ok && skillResult.data) {
        if (skillResult.data.name) {
          skills.push(skillResult.data.name);
        }
      }
    }
  }

  return skills;
}

async function updateProjectEmbedding(projectId: number, embedding: number[]) {
  const result = await paramApiCall('/api/Project/{id}', {
    method: 'PUT',
    params: { id: projectId },
    body: { embedding },
  });

  if (!result.ok) {
    throw new Error(
      `Failed to update embedding for project ${projectId}: ${result.error}`
    );
  }
}

async function generateEmbeddings() {
  const projects = await getProjects();

  let updated = 0;
  const failed: { id: number; error: unknown }[] = [];

  for (const project of projects) {
    try {
      if (!project.id) {
        console.warn(`Skipping project with no ID: ${project.slug}`);
        continue;
      }

      const skills = await getProjectSkills(project.id);
      const skillsText = skills.join(', ');
      const contentToEmbed = `Title: ${project.title}\nSkills: ${skillsText}\nDescription: ${project.description}\nContent: ${project.longDescription}`;

      const result = await embed({ model, value: contentToEmbed });
      const embedding = result.embedding;

      await updateProjectEmbedding(project.id, embedding);
      updated++;
    } catch (err) {
      console.error(
        `An error occurred while processing project ${project.id}:`,
        err
      );
      failed.push({ id: project.id || -1, error: err });
    }
  }

  return {
    success: failed.length === 0,
    message:
      failed.length === 0
        ? 'All embeddings generated successfully.'
        : 'Some embeddings failed.',
    updated,
    failed,
  };
}

export async function GET() {
  try {
    const result = await generateEmbeddings();
    const status = result.success ? 200 : 500;
    return new Response(JSON.stringify(result), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/embedding:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return new Response(
      JSON.stringify({ success: false, message: errorMessage, error }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
