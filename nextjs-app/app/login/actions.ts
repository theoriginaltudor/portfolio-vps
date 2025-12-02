'use server';

import { authApiCall } from '@/lib/utils/auth-api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { components } from '@/types/swagger-types';

type AuthUserDto = components['schemas']['AuthUserDto'];

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
async function completeAuthFlow(
  data: AuthUserDto,
  response?: Response,
  redirectTo = '/'
) {
  if (response) {
    await handleAuthCookie(response);
    if (data.accessToken) {
      const cookieStore = await cookies();
      cookieStore.set('accessToken', data.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        domain:
          process.env.NODE_ENV === 'production' ? '.tudor-dev.com' : undefined,
        maxAge: 60 * 60, // 1 hour
      });
    }
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

  const { error, response, data } = await authApiCall('/api/Login/login', {
    method: 'POST',
    body: { username, password },
  });

  if (error) {
    redirect('/error');
  }

  await completeAuthFlow(data, response, redirectTo ?? '/');
}

export async function logoutUser(pathname: string) {
  const { error } = await authApiCall('/api/Login/logout', {
    method: 'POST',
  });

  if (error) {
    redirect('/error');
  }

  const cookieStore = await cookies();
  cookieStore.delete('auth');
  cookieStore.delete('accessToken');
  redirect(pathname);
}
