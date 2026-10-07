let accessToken: string | null = null;
let refreshing: Promise<string | null> | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}
export async function getAccessToken() {
  if (accessToken) {
    try {
      const payload = JSON.parse(
        window.atob(
          accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        )
      );
      if (payload.exp * 1000 > Date.now() + 30_000) return accessToken;
    } catch {
      /* Refresh invalid or expired tokens. */
    }
    accessToken = null;
  }
  refreshing ??= fetch('/api/Login/refresh', { credentials: 'include' })
    .then(async response =>
      response.ok ? ((await response.json()).token as string) : null
    )
    .then(token => {
      accessToken = token;
      return token;
    })
    .catch(() => null)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}
