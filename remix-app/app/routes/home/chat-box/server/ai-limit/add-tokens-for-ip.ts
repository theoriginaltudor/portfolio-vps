import { ipTokenCache } from "./ip-token-cache";
import { getClientIP } from "./get-client-ip";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { DAILY_TOKEN_LIMIT } from "./constants";

export function addTokensForIP(
  headers: ReadonlyHeaders,
  tokens: number
): { blocked: boolean; redirectUrl?: string } {
  const ip = getClientIP(headers);
  if (!ip) {
    return {
      blocked: true,
      redirectUrl:
        "/contact?pageMessage=" + encodeURIComponent("IP address not found."),
    };
  }
  const now = Date.now();
  const entry = ipTokenCache[ip] || { tokens: 0, blockedUntil: 0, lastUpdated: now };

  // Reset tokens if more than 24h since last update
  if (entry.lastUpdated && now - entry.lastUpdated > 24 * 60 * 60 * 1000) {
    entry.tokens = 0;
    entry.lastUpdated = now;
  }

  entry.tokens = (entry.tokens || 0) + tokens;
  entry.lastUpdated = now;
  if (entry.tokens > DAILY_TOKEN_LIMIT) {
    entry.blockedUntil = now + 24 * 60 * 60 * 1000;
    ipTokenCache[ip] = entry;
    return {
      blocked: true,
      redirectUrl: `/contact?message=${encodeURIComponent(
        "Too many questions. Blocked for 24h."
      )}`,
    };
  }
  ipTokenCache[ip] = entry;
  return { blocked: false };
}
