'use server';

import { authApiCall } from '@/lib/utils/auth-api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Extract Set-Cookie headers safely (support multiple cookies & Next.js fetch impl)
function getSetCookieStrings(response: Response): string[] {
  // Next.js (web std) provides getSetCookie(); narrow type dynamically.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const potential = response.headers as any;
  if (typeof potential.getSetCookie === 'function') {
    return potential.getSetCookie();
  }
  const sc = response.headers.get('set-cookie');
  return sc ? [sc] : [];
}

// Helper function to handle auth cookie forwarding (login/register)
async function handleAuthCookie(response: Response) {
  const cookieStore = await cookies();
  const setCookies = getSetCookieStrings(response);
  if (!setCookies.length) return;

  // Look for the auth cookie (name=auth)
  const authSetCookie = setCookies.find(c => /^auth=/i.test(c));
  if (!authSetCookie) return;

  const valueMatch = authSetCookie.match(/auth=([^;]+)/i);
  if (!valueMatch) return;
  const cookieValue = valueMatch[1];

  // Persist (mirrors backend settings). NOTE: server action will emit a Set-Cookie to browser.
  cookieStore.set('auth', cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    domain:
      process.env.NODE_ENV === 'production' ? '.tudor-dev.com' : undefined,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Helper function for common auth flow after successful login/register
async function completeAuthFlow(response?: Response, redirectTo = '/') {
  if (response) {
    await handleAuthCookie(response);
  }
  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

export async function loginUser(formData: FormData) {
  const redirectTo = formData.get('redirectTo') as string | null;
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;

  if (!username || !password) {
    redirect('/error?reason=missing-fields');
  }

  const { error, response } = await authApiCall('/api/Login/login', {
    method: 'POST',
    body: { username, password },
  });

  if (error) {
    redirect('/error');
  }

  await completeAuthFlow(response, redirectTo ?? '/');
}

export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string | null;
  const password = formData.get('password') as string | null;

  if (!username || !password) {
    redirect('/error?reason=missing-fields');
  }

  const { error, response } = await authApiCall('/api/Login/signup', {
    method: 'POST',
    body: { username, password },
  });

  if (error) {
    redirect('/error');
  }

  await completeAuthFlow(response);
}

export async function logoutUser(pathname: string) {
  const { error, response } = await authApiCall('/api/Login/logout', {
    method: 'POST',
  });

  if (error) {
    redirect('/error');
  }

  const cookieStore = await cookies();

  // Forward the backend's expired auth cookie ( SignOutAsync issues one )
  if (response) {
    const setCookies = getSetCookieStrings(response);
    const expiredAuth = setCookies.find(c => /^auth=/i.test(c));
    if (expiredAuth) {
      // Attempt to capture attributes we care about (domain & path) for correct deletion
      const domainMatch = expiredAuth.match(/domain=([^;]+)/i);
      const pathMatch = expiredAuth.match(/path=([^;]+)/i);
      // value after auth=
      const valueMatch = expiredAuth.match(/auth=([^;]*)/i);
      cookieStore.set('auth', valueMatch ? valueMatch[1] : '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: pathMatch ? pathMatch[1] : '/',
        domain: domainMatch
          ? domainMatch[1]
          : process.env.NODE_ENV === 'production'
            ? '.tudor-dev.com'
            : undefined,
        maxAge: 0, // expire immediately
      });
    } else {
      // Fallback: explicitly expire with matching settings
      cookieStore.set('auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        domain:
          process.env.NODE_ENV === 'production' ? '.tudor-dev.com' : undefined,
        maxAge: 0,
      });
    }
  } else {
    // No response (shouldn't happen); still try to expire
    cookieStore.set('auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      domain:
        process.env.NODE_ENV === 'production' ? '.tudor-dev.com' : undefined,
      maxAge: 0,
    });
  }

  redirect(pathname);
}
