const getApiUrl = (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
};

const getImageUrl = (path: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:80/images";
  return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
};

export { getApiUrl, getImageUrl };
