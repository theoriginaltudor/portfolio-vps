const getApiUrl = (endpoint: string) => {
  // If running on the server (Node), use the internal API URL if available for direct Docker network access
  if (typeof window === "undefined") {
    const baseServerUrl = process.env.SERVER_API_URL || "http://localhost:5000";
    return `${baseServerUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
  }

  return `${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
};

const getImageUrl = (path: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:80/images";
  return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
};

export { getApiUrl, getImageUrl };
