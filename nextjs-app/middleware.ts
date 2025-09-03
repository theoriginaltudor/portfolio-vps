import { NextResponse, type NextRequest } from 'next/server';

// Middleware adds security headers and ensures restricted pages are noindexed
// even if a crawler ignores robots.txt.

const NOINDEX_PATHS = new Set(['/login', '/data-transfer', '/check-transfer']);
const AUTH_REQUIRED_PATHS = new Set(['/data-transfer', '/check-transfer']);


export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proceed normally for assets and api routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/images')) {
    return NextResponse.next();
  }

  // Auth check for restricted pages
  if (AUTH_REQUIRED_PATHS.has(pathname)) {
    const hasAuth = req.cookies.has('auth');
    if (!hasAuth) {
      // Redirect to login if not authenticated
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirect', pathname); // optional: pass original path
      return NextResponse.redirect(loginUrl);
    }
  }

  const res = NextResponse.next();

  if (NOINDEX_PATHS.has(pathname)) {
    // Set meta-equivalent via header for defense-in-depth (some bots read headers)
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // Generic security hardening
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '0'); // modern browsers use CSP

  return res;
}

export const config = {
  matcher: ['/((?!.*\\.).*)'], // all paths without an extension
};
