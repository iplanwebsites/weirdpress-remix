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
 * Cache policies for different content types
 */
export const CachePolicies = {
  // Static content pages - cache for 5 minutes, serve stale for 1 hour
  static: (): string => getCacheControl({
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 3600, // 1 hour
  }),

  // Dynamic content (posts, projects) - cache for 2 minutes, serve stale for 15 minutes  
  content: (): string => getCacheControl({
    maxAge: 120, // 2 minutes
    staleWhileRevalidate: 900, // 15 minutes
  }),

  // API responses - cache for 1 minute, serve stale for 5 minutes
  api: (): string => getCacheControl({
    maxAge: 60, // 1 minute
    staleWhileRevalidate: 300, // 5 minutes
  }),

  // Search results - cache for 30 seconds, serve stale for 5 minutes
  search: (): string => getCacheControl({
    maxAge: 30, // 30 seconds
    staleWhileRevalidate: 300, // 5 minutes
  }),

  // Media/assets - cache for 1 hour, serve stale for 1 day
  media: (): string => getCacheControl({
    maxAge: 3600, // 1 hour
    staleWhileRevalidate: 86400, // 1 day
  }),

  // No cache for dynamic/personalized content
  noCache: (): string => getCacheControl({
    maxAge: 0,
    noCache: true,
  }),
};

/**
 * Helper to create headers object with cache control
 */
export function createCacheHeaders(cacheControl: string): Record<string, string> {
  return {
    "Cache-Control": cacheControl,
  };
}