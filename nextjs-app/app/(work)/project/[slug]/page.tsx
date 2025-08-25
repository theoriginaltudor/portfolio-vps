import React from "react";

import { notFound } from "next/navigation";
import { ProjectImageHeader } from "@/feature-components/work/project-page/project-image-header";
import { ProjectImageCarousel } from "@/feature-components/work/project-page/project-image-carousel";
import { fetchProjectData } from "@/feature-components/work/project-page/hooks/fetch-data";
import { buildImageUrls } from "@/feature-components/work/project-page/hooks/build-urls";
import { Skills } from "@/feature-components/work/project-page/skills";
import { ArticleBody } from "@/feature-components/work/project-page/article-body";
import { checkAuth } from "@/lib/utils/server";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (!slug) return notFound();

  const { project, projectError } = await fetchProjectData(slug);
  if (projectError) {
    console.error("Error fetching project:", projectError);
    return notFound();
  }
  if (!project) {
    console.warn("Project not found for slug:", slug);
    return notFound();
  }

  // Defensive checks for joined data
  const images = project.projectAssets || [];
  const skills = project.projectSkills?.map((s) => s.skill) || [];

  const imageUrls = await buildImageUrls(images);

  if (!imageUrls.length) {
    console.warn("No images found for project:", project.id);
  }
  if (!skills.length) {
    console.warn("No skills found for project:", project.id);
  }

  const editMode = await checkAuth();

  return (
    <main className="flex flex-col items-center flex-1 w-full">
      <ProjectImageHeader
        title={project.title}
        id={project.id ?? 0}
        image={imageUrls[0]}
        edit={editMode}
      />

      {skills.length > 0 && (
        <Skills skills={skills} edit={editMode} articleId={project.id ?? 0} />
      )}

      <ArticleBody
        className="max-w-2xl text-base w-full px-4 mt-8"
        edit={editMode}
        projectId={project.id ?? 0}
      >
        {project.longDescription}
      </ArticleBody>

      {imageUrls.length > 0 && (
        <ProjectImageCarousel images={imageUrls} edit={editMode} />
      )}
    </main>
  );
}
