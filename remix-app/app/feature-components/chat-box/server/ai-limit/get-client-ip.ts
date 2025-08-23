// Get client IP address from Next.js API route request
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export function getClientIP(headers: ReadonlyHeaders): string | null {
  // x-forwarded-for may be a comma-separated list of IPs
  const xForwardedFor = headers.get("x-forwarded-for");
  if (typeof xForwardedFor === "string") {
    const ip = xForwardedFor.split(",")[0].trim();
    return ip;
  }
  // Fallback for direct connection (may not be available in edge runtime)
  const xRealIp = headers.get("x-real-ip");
  if (typeof xRealIp === "string") {
    return xRealIp;
  }
  return null;
}
