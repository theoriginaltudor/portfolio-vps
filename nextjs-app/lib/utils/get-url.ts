const getApiUrl = (endpoint: string) => {
  // If running on the server (Node), use the internal API URL if available for direct Docker network access
  if (typeof window === "undefined") {
    const baseServerUrl =
      process.env.SERVER_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000/api";
    return `${baseServerUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
  }

  // In the browser, use same-origin /api to avoid CORS
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  return `${baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
};

const getImageUrl = (path: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:80/images";
  return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
};

export { getApiUrl, getImageUrl };
