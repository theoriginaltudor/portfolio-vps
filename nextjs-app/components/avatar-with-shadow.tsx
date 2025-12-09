'use client';
import {ViewTransition} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/client';
import { useSubmittingStore } from '@/feature-components/chat-box/submitting-store';
import { getImageUrl } from '@/lib/utils/get-url';

interface AvatarWithShadowProps {
  size?: 'big' | 'small';
}

export const AvatarWithShadow: React.FC<AvatarWithShadowProps> = ({
  size = 'big',
}) => {
  const { loading } = useSubmittingStore();
  const avatarUrl = getImageUrl('/tc1_1.webp');

  const sizeClass = size === 'big' ? 'w-64 h-64' : 'w-16 h-16';

  return (
    <ViewTransition name='avatar-group'>
      <div className={cn('relative', sizeClass)}>
        {size === 'big' && (
          <span className='absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gray-800/70 px-3 py-1 text-xs font-bold tracking-widest text-white shadow-md select-none md:text-sm'>
            WORK IN PROGRESS
          </span>
        )}
        <Avatar className='h-full w-full'>
          <AvatarImage src={avatarUrl} alt='Avatar' />
          <AvatarFallback className='text-7xl'>TC</AvatarFallback>
        </Avatar>
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-[-1] rounded-full shadow-[0_0_0_8px_rgba(255,255,255,0.2)] before:absolute before:inset-[-8px] before:z-[-2] before:rounded-full before:bg-[conic-gradient(from_0deg_at_50%_50%,#ff0080_0%,#7928ca_25%,#0070f3_50%,#00ffb8_75%,#ff0080_100%)] before:opacity-60 before:blur-[12px] before:content-['']",
            loading && 'animate-pulse'
          )}
        />
      </div>
    </ViewTransition>
  );
};
