/**
 * Cache utility functions for consistent cache policies across routes
 */

export interface CacheOptions {
  maxAge: number;
  staleWhileRevalidate?: number;
  mustRevalidate?: boolean;
  noCache?: boolean;
}

/**
 * Generate cache-control header value
 */
export function getCacheControl({
  maxAge,
  staleWhileRevalidate,
  mustRevalidate = true,
  noCache = false,
}: CacheOptions): string {
  if (noCache) {
    return "no-cache, no-store, must-revalidate";
  }

  const parts = ["public", `max-age=${maxAge}`];
  
  if (staleWhileRevalidate) {
    parts.push(`stale-while-revalidate=${staleWhileRevalidate}`);
  }
  
  if (mustRevalidate) {
    parts.push("must-revalidate");
  }

  return parts.join(", ");
}

/**
 * Simple cache policy for fast loading with background refresh
 */
export function getDefaultCachePolicy(): string {
  return getCacheControl({
    maxAge: 60, // 1 minute fresh
    staleWhileRevalidate: 3600, // 1 hour stale - always loads fast, refreshes in background
  });
}

/**
 * Helper to create headers object with cache control
 */
export function createCacheHeaders(cacheControl: string): Record<string, string> {
  return {
    "Cache-Control": cacheControl,
  };
}