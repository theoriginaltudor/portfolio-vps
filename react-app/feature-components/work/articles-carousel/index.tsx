import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Link } from 'react-router-dom';
import { components } from '@/types/swagger-types';
import { Slide } from '@/components/slide';
import { getArticlesImage } from './get-articles-images';

interface ArticlesCarouselProps {
  articles: components['schemas']['ExtendedProjectGetDto'][];
}

export const ArticlesCarousel = ({ articles }: ArticlesCarouselProps) => {
  const [assets, setAssets] = useState<Awaited<ReturnType<typeof getArticlesImage>>>([]);
  useEffect(() => {
    let active = true;
    getArticlesImage().then(data => { if (active) setAssets(data); });
    return () => { active = false; };
  }, []);
  const imagePaths = articles.map(project => ({
    path: project.projectAssets?.[0]?.path ?? assets.find(asset => asset.projectId === project.id)?.path,
    projectId: project.id,
  }));

  return (
    <Carousel
      className='w-full md:w-3xl xl:w-7xl'
      opts={{ loop: true, align: 'start' }}
    >
      <CarouselContent>
        {articles.map(article => {
          const image = imagePaths.find(img => img.projectId === article.id);
          return (
            <CarouselItem
              key={article.id}
              className='md:basis-1/2 xl:basis-1/3'
            >
              <Link to={`/project/${article.slug}`}>
                <Slide
                  id={article.id ?? 0}
                  title={article.title ?? 'Untitled Project'}
                  description={article.description ?? 'No description'}
                  imagePath={image?.path}
                />
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className='hidden md:flex' />
      <CarouselNext className='hidden md:flex' />
    </Carousel>
  );
};
