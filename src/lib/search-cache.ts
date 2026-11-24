import { Product } from "./supabase";

interface CacheEntry {
  data: Product[];
  timestamp: number;
}

const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes
const MAX_CACHE_SIZE = 250;

class SearchCache {
  private cache = new Map<string, CacheEntry>();

  private normalizeKey(query: string, maxPrice?: number, matchCount?: number): string {
    const cleanQuery = query.trim().toLowerCase().replace(/\s+/g, " ");
    return `${cleanQuery}__price:${maxPrice ?? "none"}__count:${matchCount ?? 12}`;
  }

  get(query: string, maxPrice?: number, matchCount?: number): Product[] | null {
    const key = this.normalizeKey(query, maxPrice, matchCount);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() - entry.timestamp > DEFAULT_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(query: string, data: Product[], maxPrice?: number, matchCount?: number): void {
    const key = this.normalizeKey(query, maxPrice, matchCount);

    // Evict oldest entry if size exceeds limit
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global singleton instance for in-memory caching across requests
export const searchCache = new SearchCache();
