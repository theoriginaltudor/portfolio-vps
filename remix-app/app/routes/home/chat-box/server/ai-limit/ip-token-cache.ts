interface IpTokenCacheEntry {
  tokens: number;
  blockedUntil: number;
  lastUpdated: number;
}

declare global {
  var ipTokenCache: Record<string, IpTokenCacheEntry> | undefined;
}

if (!global.ipTokenCache) {
  global.ipTokenCache = {};
}

export const ipTokenCache = global.ipTokenCache;
