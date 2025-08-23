import { ipTokenCache } from "./ip-token-cache";
import { getClientIP } from "./get-client-ip";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export interface TokenCheckResult {
  blocked: boolean;
  redirectUrl?: string;
}

export function checkAndUpdateTokenLimit(
  headers: ReadonlyHeaders
): TokenCheckResult {
  const ip = getClientIP(headers);
  if (!ip) {
    return {
      blocked: true,
      redirectUrl: `/contact?pageMessage=${encodeURIComponent(
        "Unable to determine your IP address."
      )}`,
    };
  }
  const now = Date.now();
  const entry = ipTokenCache[ip] || { tokens: 0, blockedUntil: 0, lastUpdated: now };

  // Reset tokens if more than 24h since last update
  if (entry.lastUpdated && now - entry.lastUpdated > 24 * 60 * 60 * 1000) {
    entry.tokens = 0;
    entry.lastUpdated = now;
    ipTokenCache[ip] = entry;
  }

  // Check if blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return {
      blocked: true,
      redirectUrl: `/contact?message=${encodeURIComponent(
        "You have reached your limit for the day. Come back in 24h and we can chat again."
      )}`,
    };
  }
  return { blocked: false };
}
