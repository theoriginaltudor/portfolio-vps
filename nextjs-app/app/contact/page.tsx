import Image from 'next/image';
import type { Metadata } from 'next';
import React from 'react';
import { AvatarWithMessage } from '@/feature-components/contact/avatar-with-message';
import { ContactInfoCard } from '@/feature-components/contact/contact-info-card';
import { cn } from '@/lib/utils/client';

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const message = (await searchParams).message as string | undefined;

  return (
    <main className='flex-1 flex flex-col items-center justify-center'>
      <div
        className={cn(
          'flex flex-col md:flex-row items-center justify-center p-8 md:gap-8',
          message ? 'gap-12' : 'gap-20'
        )}
      >
        <AvatarWithMessage message={message} />
        <div className='hidden md:flex flex-col gap-20'>
          <Image
            src='/Sketch_arrow.png'
            alt='background sketch arrow'
            width={250}
            height={150}
            className='object-contain'
          />
          <Image
            src='/Sketch_arrow.png'
            alt='background sketch arrow'
            width={250}
            height={150}
            className='object-contain rotate-180 -scale-x-100'
          />
        </div>
        <ContactInfoCard />
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Tudor Caseru – inquiries about collaboration, engineering roles, or project discussions.',
  openGraph: {
    title: 'Contact – Tudor Caseru',
    description:
      'Reach out for software engineering, full‑stack development, or technical consulting.',
    url: 'https://tudor-dev.com/contact',
  },
};
