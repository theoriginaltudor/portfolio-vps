const withSlash = (value: string) => value.startsWith('/') ? value : `/${value}`;
export const getApiUrl = (endpoint: string) => withSlash(endpoint);
export const getImageUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  const base = (import.meta.env.VITE_IMAGE_URL || '/images').replace(/\/$/, '');
  return `${base}${withSlash(path)}`;
};
