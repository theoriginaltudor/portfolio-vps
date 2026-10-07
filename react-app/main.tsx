import { StrictMode, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import RootLayout from '@/app/layout';
import Home from '@/app/page';
const ContactPage = lazy(() => import('@/app/contact/page'));
const LoginPage = lazy(() => import('@/app/login/page'));
const ErrorPage = lazy(() => import('@/app/error/page'));
const ProjectsPage = lazy(() => import('@/app/(work)/projects/page'));
const ProjectPage = lazy(() => import('@/app/(work)/project/[slug]/page'));
import './app/globals.css';
function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const title =
      pathname === '/'
        ? 'Home'
        : pathname === '/projects'
          ? 'Projects'
          : pathname === '/contact'
            ? 'Contact'
            : pathname === '/login'
              ? 'Login'
              : pathname.startsWith('/project/')
                ? decodeURIComponent(pathname.split('/').pop() || 'Project')
                : 'Page not found';
    document.title = `${title} | Tudor Caseru`;
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', `https://www.tudor-dev.com${pathname}`);
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute(
        'content',
        ['/login', '/error'].includes(pathname)
          ? 'noindex, nofollow'
          : 'index, follow'
      );
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PageMetadata />
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path='contact' element={<ContactPage />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='error' element={<ErrorPage />} />
            <Route path='projects' element={<ProjectsPage />} />
            <Route path='project/:slug' element={<ProjectPage />} />
            <Route
              path='*'
              element={<p className='p-8 text-center'>Page not found.</p>}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
