import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to the portfolio of Tudor Caseru – Explore projects, chat with an AI assistant, and discover engineering experience.',
  openGraph: {
    title: 'Tudor Caseru – Portfolio Home',
    description:
      'Explore highlighted work, skills, and an AI chat assistant for project questions.',
    url: 'https://www.tudor-dev.com',
    images: [
      {
        url: '/api/og?title=Home',
        width: 1200,
        height: 630,
        alt: 'Tudor Caseru – Portfolio',
      },
    ],
  },
};
import { AvatarWithShadow } from '@/components/avatar-with-shadow';
import { ChatBox } from '@/feature-components/chat-box';

export default function Home() {
  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      <div className='flex flex-col items-center gap-8'>
        <AvatarWithShadow />
        <ChatBox />
      </div>
    </main>
  );
}
