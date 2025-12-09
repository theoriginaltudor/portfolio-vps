import type { Metadata } from 'next';
import { fetchProjectData } from '@/feature-components/work/project-page/hooks/fetch-data';

import { notFound } from 'next/navigation';
import { ProjectImageHeader } from '@/feature-components/work/project-page/project-image-header';
import { ProjectImageCarousel } from '@/feature-components/work/project-page/project-image-carousel';
import { buildImageUrls } from '@/feature-components/work/project-page/hooks/build-urls';
import { Skills } from '@/feature-components/work/project-page/skills';
import { ArticleBody } from '@/feature-components/work/project-page/article-body';
import { checkAuth } from '@/lib/utils/server';

import { DeleteButton } from '@/feature-components/work/project-page/delete-button';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be located.',
    };
  }
  try {
    const { project } = await fetchProjectData(slug);
    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be located.',
      };
    }
    const title = project.title || slug;
    const short =
      project.description ||
      project.longDescription?.slice(0, 140) ||
      'Project details and implementation notes.';
    return {
      title,
      description: short,
      openGraph: {
        title,
        description: short,
        url: `https://tudor-dev.com/project/${slug}`,
        type: 'article',
        images: project.projectAssets?.[0]?.path
          ? [
              {
                url: project.projectAssets[0].path.startsWith('http')
                  ? project.projectAssets[0].path
                  : `/api/og?title=${encodeURIComponent(title)}`,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: short,
      },
      alternates: {
        canonical: `/project/${slug}`,
      },
    };
  } catch {
    return {
      title: slug,
      description: 'Project details.',
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (!slug) return notFound();

  const { project, projectError } = await fetchProjectData(slug);
  if (projectError) {
    console.error('Error fetching project:', projectError);
    return notFound();
  }
  if (!project) {
    console.warn('Project not found for slug:', slug);
    return notFound();
  }

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

  const imageUrls = await buildImageUrls(
    images.filter((img): img is string => typeof img === 'string')
  );

  if (!imageUrls.length) {
    console.warn('No images found for project:', project.id);
  }
  if (!skills.length) {
    console.warn('No skills found for project:', project.id);
  }

  const editMode = await checkAuth();

  return (
    <main className='flex w-full flex-1 flex-col items-center'>
      <ProjectImageHeader
        title={project.title ?? 'Untitled Project'}
        id={project.id ?? 0}
        image={imageUrls[0]}
      />

      {skills.length > 0 && (
        <Skills skills={skills} articleId={project.id ?? 0} />
      )}

      <ArticleBody
        className='mt-8 w-full max-w-2xl px-4 text-base'
        projectId={project.id ?? 0}
      >
        {project.longDescription ?? 'No description provided.'}
      </ArticleBody>

      {imageUrls.length > 0 && <ProjectImageCarousel images={imageUrls} />}

      {editMode && project.id && <DeleteButton projectId={project.id} />}
    </main>
  );
}
