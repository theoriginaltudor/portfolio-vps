const getApiUrl = (endpoint: string) => {
  // If running on the server (Node), use the internal API URL if available for direct Docker network access
  if (typeof window === "undefined") {
    const baseServerUrl = process.env.SERVER_API_URL || "http://localhost:8000";
    return `${baseServerUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
  }

  return `${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
};

const getImageUrl = (path: string) => {
  // Use environment variable if set, otherwise detect protocol based on current context
  if (process.env.NEXT_PUBLIC_IMAGE_URL) {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
  }
  
  // For development, default to localhost
  if (typeof window === "undefined") {
    // Server-side: use localhost for development
    const baseUrl = "http://localhost:80/images";
    return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
  }
  
  // Client-side: use current protocol and host
  const protocol = window.location.protocol;
  const host = window.location.host;
  const baseUrl = `${protocol}//${host}/images`;
  return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
};

export { getApiUrl, getImageUrl };
