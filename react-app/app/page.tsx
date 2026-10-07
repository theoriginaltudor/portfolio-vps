import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { AvatarWithShadow } from '@/components/avatar-with-shadow';
export default function Home() {
  return (
    <main className='mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16 md:px-12'>
      <div className='flex flex-col items-center gap-12 md:flex-row md:gap-16'>
        <div className='shrink-0'>
          <AvatarWithShadow />
        </div>
        <div className='max-w-xl text-center md:text-left'>
          <p className='text-muted-foreground mb-3 text-sm font-medium tracking-wide'>
            Full-stack developer · Hedehusene, Denmark
          </p>
          <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
            Hi, I’m Tudor Caseru.
          </h1>
          <p className='text-muted-foreground mt-6 text-lg leading-relaxed'>
            I build web applications and APIs with React, TypeScript, and
            ASP.NET Core. My portfolio brings together the projects I’ve worked
            on and the skills behind them.
          </p>
          <p className='text-muted-foreground mt-4 text-lg leading-relaxed'>
            Explore my work, or get in touch to talk about a project or
            collaboration.
          </p>
        </div>
      </div>
      <nav
        aria-label='Explore my portfolio'
        className='mt-14 grid gap-4 md:grid-cols-2'
      >
        <Link
          to='/projects'
          className='bg-card text-card-foreground hover:bg-accent group flex items-center justify-between rounded-xl border p-6 transition-colors'
        >
          <div>
            <h2 className='text-xl font-semibold'>Projects</h2>
            <p className='text-muted-foreground mt-2'>
              Explore my work and how it was built.
            </p>
          </div>
          <ArrowRight
            aria-hidden='true'
            className='ml-4 shrink-0 transition-transform group-hover:translate-x-1'
          />
        </Link>
        <Link
          to='/contact'
          className='bg-card text-card-foreground hover:bg-accent flex items-center justify-between rounded-xl border p-6 transition-colors'
        >
          <div>
            <h2 className='text-xl font-semibold'>Contact</h2>
            <p className='text-muted-foreground mt-2'>
              Find my contact details and social profiles.
            </p>
          </div>
          <Mail aria-hidden='true' className='ml-4 shrink-0' />
        </Link>
      </nav>
    </main>
  );
}
