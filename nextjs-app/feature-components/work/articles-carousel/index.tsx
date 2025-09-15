import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Link from 'next/link';
import { PlusCircleIcon } from 'lucide-react';
import { components } from '@/types/swagger-types';
import { Slide } from '@/components/slide';
import { getArticlesImage } from './get-articles-images';
import { checkAuth } from '../../../lib/utils/server';

interface ArticlesCarouselProps {
  articles: components['schemas']['ExtendedProjectGetDto'][];
}

export const ArticlesCarousel = async ({ articles }: ArticlesCarouselProps) => {
  const editMode = await checkAuth();

  let imagePaths: Pick<
    components['schemas']['ProjectAsset'],
    'path' | 'projectId'
  >[] = [];
  if (
    articles.length > 0 &&
    articles[0]?.projectAssets &&
    articles[0].projectAssets.length > 0
  ) {
    imagePaths = articles.map(project => ({
      path: project.projectAssets?.[0].path ?? '',
      projectId: project.id ?? 0,
    }));
  } else {
    imagePaths = await getArticlesImage();
  }

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
              <Link href={`/project/${article.slug}`}>
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
        {editMode && (
          <CarouselItem className='md:basis-1/2 xl:basis-1/3'>
            <div className='flex h-full w-full items-center justify-center'>
              <Link
                href='/new-article'
                className='flex h-96 w-96 cursor-pointer items-center justify-center rounded-3xl bg-gray-600 transition-colors hover:bg-gray-700'
              >
                <PlusCircleIcon className='h-20 w-20 text-white' />
              </Link>
            </div>
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselPrevious className='hidden md:flex' />
      <CarouselNext className='hidden md:flex' />
    </Carousel>
  );
};
