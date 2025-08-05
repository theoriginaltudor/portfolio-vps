const getApiUrl = (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5258";
  return `${baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
};

export { getApiUrl };
