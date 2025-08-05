import { ApiEndpoint } from "./api";

const getApiUrl = (endpoint: ApiEndpoint) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5258";
  return `${baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
};

export { getApiUrl };
