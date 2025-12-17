import React from 'react';
import { AvatarWithShadow } from '@/components/avatar-with-shadow';

interface AvatarWithMessageProps {
  message?: string;
}

export const AvatarWithMessage: React.FC<AvatarWithMessageProps> = ({
  message,
}) => (
  <div className='flex flex-col items-center justify-center gap-4'>
    <AvatarWithShadow />
    {message && (
      <div className='mt-4 px-4 py-2 rounded-lg w-full min-w-16 max-w-64 text-sm bg-white text-black dark:bg-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700'>
        {message}
      </div>
    )}
  </div>
);
