import { Suspense } from 'react';
import { AvatarWithShadow } from '@/components/avatar-with-shadow';
import { LayoutMessage } from '@/feature-components/work/project-page/layout-message';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className='fixed right-4 bottom-24 z-50 md:right-8 md:bottom-8'>
        <Suspense>
          <LayoutMessage />
        </Suspense>
        <AvatarWithShadow size='small' />
      </div>
    </>
  );
}
