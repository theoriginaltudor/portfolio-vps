import * as React from "react";
import { ArticlesCarousel } from "@/feature-components/work/articles-carousel";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, slug, title, description");
  return (
    <main className="flex-1 mx-auto py-6 px-2 md:py-12 md:px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Relevant work</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-2xl">
        An overview of project I worked on, showcasing my skills.
      </p>
      {error && (
        <p className="text-red-500">Error loading articles: {error.message}</p>
      )}
      {/* TODO: fix tablet view */}
      {articles && (
        <ArticlesCarousel articles={articles} supabaseClient={supabase} />
      )}
    </main>
  );
}
