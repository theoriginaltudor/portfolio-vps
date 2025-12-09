import type { Metadata } from 'next';
import { ArticlesCarousel } from '@/feature-components/work/articles-carousel';
import { apiCall } from '@/lib/utils/api';

export default async function ProjectsPage() {
  const { data: articles, error } = await apiCall('/api/Project');
  return (
    <main className='mx-auto flex flex-1 flex-col items-center px-2 py-6 md:px-4 md:py-12'>
      <h1 className='mb-2 text-3xl font-bold'>Relevant work</h1>
      <p className='text-muted-foreground mb-8 max-w-2xl text-center'>
        An overview of project I worked on, showcasing my skills.
      </p>
      {error && <p className='text-red-500'>Error loading articles: {error}</p>}

      {articles && <ArticlesCarousel articles={articles} />}
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A curated selection of software projects showcasing full‑stack engineering, API design, performance, and AI integration.',
  openGraph: {
    title: 'Projects – Tudor Caseru',
    description:
      'Explore real-world applications, platform builds, and product features delivered by Tudor Caseru.',
    url: 'https://tudor-dev.com/projects',
  },
};
