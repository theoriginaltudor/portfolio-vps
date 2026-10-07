import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useRequest } from '@/lib/use-request';
import { fetchProjectData } from '@/feature-components/work/project-page/hooks/fetch-data';
import { ProjectImageHeader } from '@/feature-components/work/project-page/project-image-header';
import { ProjectImageCarousel } from '@/feature-components/work/project-page/project-image-carousel';
import { buildImageUrls } from '@/feature-components/work/project-page/hooks/build-urls';
import { Skills } from '@/feature-components/work/project-page/skills';
import { ArticleBody } from '@/feature-components/work/project-page/article-body';

export default function ProjectPage() {
  const { slug = '' } = useParams();
  const load = useCallback(() => fetchProjectData(slug), [slug]);
  const { data, error, loading } = useRequest(load);
  if (loading)
    return (
      <p role='status' className='p-8 text-center'>
        Loading project...
      </p>
    );
  if (error || data?.projectError || !data?.project)
    return (
      <p role='alert' className='p-8 text-center'>
        Project not found or unavailable.
      </p>
    );
  const project = data.project;
  // Defensive checks for joined data
  const images = project.projectAssets?.map(asset => asset.path) || [];
  const skills = (project.skills ?? [])
    .map(s => {
      if (!s || !s.name) return undefined;
      return {
        id: s.id ?? undefined,
        name: s.name,
        createdAt: s.createdAt ?? undefined,
        updatedAt: s.updatedAt ?? undefined,
      };
    })
    .filter((s): s is NonNullable<typeof s> => !!s);

  const imageUrls = buildImageUrls(
    images.filter((img): img is string => typeof img === 'string')
  );

  if (!imageUrls.length) {
    console.warn('No images found for project:', project.id);
  }
  if (!skills.length) {
    console.warn('No skills found for project:', project.id);
  }

  return (
    <main className='flex w-full flex-1 flex-col items-center'>
      <ProjectImageHeader
        title={project.title ?? 'Untitled Project'}
        id={project.id ?? 0}
        image={imageUrls[0]}
      />

      {skills.length > 0 && <Skills skills={skills} />}

      <ArticleBody className='mt-8 w-full max-w-2xl px-4 text-base'>
        {project.longDescription ?? 'No description provided.'}
      </ArticleBody>

      {imageUrls.length > 0 && <ProjectImageCarousel images={imageUrls} />}
    </main>
  );
}
