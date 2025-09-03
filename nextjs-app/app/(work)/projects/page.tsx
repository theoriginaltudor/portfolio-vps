import * as React from "react";
import type { Metadata } from "next";
import { ArticlesCarousel } from "@/feature-components/work/articles-carousel";
import { apiCall } from "@/lib/utils/api";

export default async function ProjectsPage() {
  const { data: articles, error } = await apiCall("/api/Project");
  return (
    <main className="flex-1 mx-auto py-6 px-2 md:py-12 md:px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Relevant work</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-2xl">
        An overview of project I worked on, showcasing my skills.
      </p>
      {error && <p className="text-red-500">Error loading articles: {error}</p>}

      {articles && <ArticlesCarousel articles={articles} />}
    </main>
  );
}

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A curated selection of software projects showcasing full‑stack engineering, API design, performance, and AI integration.",
  openGraph: {
    title: "Projects – Tudor Caseru",
    description:
      "Explore real-world applications, platform builds, and product features delivered by Tudor Caseru.",
  url: "https://tudor-dev.com/projects"
  }
};
