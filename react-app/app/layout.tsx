import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { NavigationMenu } from '@/components/navigation-menu';
import { MobileNav } from '@/components/mobile-nav';
import { useAuth } from '@/lib/auth';
export default function RootLayout() {
  const { user } = useAuth();
  return (
    <ThemeProvider>
      <div className='flex min-h-screen flex-col'>
        <div className='flex w-full justify-end p-4'>
          <NavigationMenu
            className='hidden md:flex'
            {...(user ? { user } : {})}
          />
          <MobileNav {...(user ? { user } : {})} />
        </div>
        <div className='flex flex-1 flex-col'>
          <Suspense
            fallback={
              <p role='status' className='p-8 text-center'>
                Loading...
              </p>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </div>
    </ThemeProvider>
  );
}
