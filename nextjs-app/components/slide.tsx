import { ViewTransition } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils/get-url';

interface SlideProps {
  id: number;
  imagePath?: string;
  title: string;
  description: string;
}

export const Slide: React.FC<SlideProps> = async ({
  id,
  title,
  imagePath,
  description,
}: SlideProps) => {
  let publicUrl: string | undefined = undefined;
  if (imagePath) {
    publicUrl = getImageUrl(imagePath);
  }

  return (
    <div className='relative h-[70dvh] w-full md:w-96'>
      <div className='bg-card relative mb-4 flex h-full w-full max-w-5xl shrink-0 items-start justify-start overflow-hidden rounded-xl'>
        {publicUrl && (
          <Image
            src={publicUrl}
            alt={title}
            fill
            className='absolute inset-0 z-0 h-full w-full object-cover'
            priority
          />
        )}
        <div className='absolute inset-0 z-10 flex items-start bg-linear-to-r from-white to-transparent dark:from-black'>
          <div className='w-1/2 p-6'>
            <ViewTransition name={`slide-title-description-${id}`}>
              <h2 className='mb-1 text-xl font-semibold text-black dark:text-white'>
                {title}
              </h2>
              <p className='text-left text-sm text-black dark:text-white'>
                {description}
              </p>
            </ViewTransition>
          </div>
        </div>
      </div>
    </div>
  );
};
