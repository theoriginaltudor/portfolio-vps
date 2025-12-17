'use client';
import { ViewTransition } from 'react';
import Image from 'next/image';
// Removed edit-mode update functionality; component is display-only now.

interface ProjectImageHeaderProps {
  title: string;
  id: number;
  image: string;
}

export const ProjectImageHeader: React.FC<ProjectImageHeaderProps> = ({
  title: projectTitle,
  id,
  image,
}) => {
  return (
    <div className='relative h-[70dvh] min-h-[120px] w-full'>
      <Image
        src={image}
        alt={projectTitle}
        fill
        className='absolute inset-0 z-0 h-full w-full object-cover object-center'
        priority
        sizes='100vw'
      />
      <div
        className='pointer-events-none absolute inset-0 z-5'
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)',
        }}
        data-dark='true'
      />
      <div
        className='pointer-events-none absolute inset-0 z-5 dark:hidden'
        style={{
          background:
            'linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)',
        }}
        data-dark='false'
      />
      <div className='absolute inset-x-0 bottom-0 z-10 flex items-end justify-center px-4 pb-8'>
        <ViewTransition name={`slide-title-description-${id}`}>
          <h1 className='rounded-lg px-6 py-4 text-center text-5xl font-bold text-white drop-shadow-lg dark:text-white'>
            {projectTitle}
          </h1>
        </ViewTransition>
      </div>
    </div>
  );
};
