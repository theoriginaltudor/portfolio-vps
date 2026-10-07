import { useRequest } from '@/lib/use-request';
import { ArticlesCarousel } from '@/feature-components/work/articles-carousel';
import { getProjects } from '@/lib/utils/api';

export default function ProjectsPage() {
  const { data: result, error: loadError, loading } = useRequest(getProjects);
  const articles = result?.data;
  const error = loadError || result?.error;
  return (
    <main className='mx-auto flex flex-1 flex-col items-center px-2 py-6 md:px-4 md:py-12'>
      <h1 className='mb-2 text-3xl font-bold'>Relevant work</h1>
      <p className='text-muted-foreground mb-8 max-w-2xl text-center'>
        An overview of projects I’ve worked on, showcasing my skills.
      </p>
      {loading && <p role='status'>Loading projects...</p>}
      {error && <p className='text-red-500'>Error loading articles: {error}</p>}

      {articles && articles.length > 0 && (
        <ArticlesCarousel articles={articles} />
      )}
      {articles?.length === 0 && <p>No projects published yet.</p>}
    </main>
  );
}
