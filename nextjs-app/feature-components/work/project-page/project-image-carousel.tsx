import React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { SlideWithPair } from './slide-with-pair';
import { PlusCircleIcon } from 'lucide-react';

interface ProjectImageCarouselProps {
  images: string[];
  edit?: boolean;
}

export const ProjectImageCarousel: React.FC<ProjectImageCarouselProps> = ({
  images,
  edit,
}) => {
  if (!images || images.length === 0) return null;

  const desktopImages = images.filter(img => img.includes('_desktop'));
  const mobileImages = images.filter(img => img.includes('_mobile'));
  const hasDesktopMobile = desktopImages.length > 0 || mobileImages.length > 0;

  return (
    <div className='my-12 w-10/12 max-w-[100rem]'>
      <Carousel className='w-full' opts={{ loop: true }}>
        <CarouselContent>
          {!hasDesktopMobile
            ? images.map((img, idx) => (
                <CarouselItem key={idx} className='basis-full'>
                  <Image
                    src={img}
                    alt={`Project image ${idx + 1}`}
                    className='w-full rounded-lg shadow-md'
                    width={800}
                    height={500}
                    style={{ width: '100%', height: 'auto' }}
                    priority={idx === 0}
                  />
                </CarouselItem>
              ))
            : desktopImages.map((desktopImg, idx) => (
                <CarouselItem key={idx} className='basis-full'>
                  <SlideWithPair
                    images={[desktopImg, mobileImages[idx]]}
                    index={idx}
                  />
                </CarouselItem>
              ))}
          {edit && (
            <CarouselItem className='basis-full'>
              <div className='flex h-full w-full items-center justify-center'>
                <button className='flex h-96 w-96 cursor-pointer items-center justify-center rounded-3xl bg-gray-600 transition-colors hover:bg-gray-700'>
                  <PlusCircleIcon className='h-20 w-20' />
                </button>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className='hidden md:flex' />
        <CarouselNext className='hidden md:flex' />
      </Carousel>
    </div>
  );
};
