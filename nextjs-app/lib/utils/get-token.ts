export async function getAccessToken() {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    try {
      const cookieStore = await cookies();
      return cookieStore.get('accessToken')?.value || null;
    } catch {
      return null;
    }
  } else {
    // Client-side: parse document.cookie
    const name = 'accessToken=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
}

export async function getAuthCookie() {
  if (typeof window !== 'undefined') return null; // Client doesn't need it
  const { cookies } = await import('next/headers');
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth') || null;
  } catch {
    return null;
  }
}