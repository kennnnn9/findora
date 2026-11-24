import { getEmbedding } from "./gemini";
import { getSupabaseAdmin, isSupabaseConfigured, Product } from "./supabase";
import { searchCache } from "./search-cache";
import { fallbackProducts } from "./mock-data";

export interface SearchOptions {
  query: string;
  maxPrice?: number;
  limit?: number;
}

/**
 * Performs semantic search over products:
 * 1. Checks in-memory search cache
 * 2. Generates query vector via Gemini embedding (gemini-embedding-001)
 * 3. Calls Supabase `match_products` RPC with cosine distance
 * 4. Caches & returns results
 */
export async function searchProducts({
  query,
  maxPrice,
  limit = 12,
}: SearchOptions): Promise<Product[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  // 1. Check in-memory cache
  const cached = searchCache.get(cleanQuery, maxPrice, limit);
  if (cached) {
    return cached;
  }

  // 2. Fallback if Supabase is not configured yet
  if (!isSupabaseConfigured()) {
    console.warn(
      "[Search] Supabase not configured. Using in-memory fallback search."
    );
    const lower = cleanQuery.toLowerCase();
    const words = lower.split(/\s+/).filter(Boolean);

    const matches = fallbackProducts
      .filter((p) => {
        if (p.stock <= 0) return false;
        if (maxPrice !== undefined && p.price > maxPrice) return false;
        const text = `${p.name} ${p.category} ${p.description}`.toLowerCase();
        return words.some((w) => text.includes(w));
      })
      .slice(0, limit);

    searchCache.set(cleanQuery, matches, maxPrice, limit);
    return matches;
  }

  // 3. Generate embedding vector using Gemini
  const supabase = getSupabaseAdmin();
  let queryEmbedding: number[];

  try {
    queryEmbedding = await getEmbedding(cleanQuery);
  } catch (err) {
    console.error("[Search] Failed to generate embedding vector:", err);
    // Fallback to text match in database if Gemini is unavailable
    const queryBuilder = supabase
      .from("products")
      .select("id, name, description, category, price, stock, image_url")
      .gt("stock", 0)
      .or(
        `name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,category.ilike.%${cleanQuery}%`
      )
      .limit(limit);

    if (maxPrice !== undefined) {
      queryBuilder.lte("price", maxPrice);
    }

    const { data: textMatches } = await queryBuilder;
    const fallbackResults = (textMatches as Product[]) || [];
    searchCache.set(cleanQuery, fallbackResults, maxPrice, limit);
    return fallbackResults;
  }

  // 4. Call match_products RPC
  const { data, error } = await supabase.rpc("match_products", {
    query_embedding: queryEmbedding,
    match_count: limit,
    max_price: maxPrice ?? null,
  });

  if (error) {
    console.error("[Search] match_products RPC failed:", error.message);
    throw new Error(`Database vector search failed: ${error.message}`);
  }

  const results = (data as Product[]) || [];
  searchCache.set(cleanQuery, results, maxPrice, limit);
  return results;
}

/**
 * Fetches all products or filters by category
 */
export async function getProducts(options?: {
  category?: string;
  limit?: number;
}): Promise<Product[]> {
  const limit = options?.limit ?? 50;

  if (!isSupabaseConfigured()) {
    let list = fallbackProducts;
    if (options?.category && options.category !== "All") {
      list = list.filter((p) => p.category === options.category);
    }
    return list.slice(0, limit);
  }

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("products")
    .select("id, name, description, category, price, stock, image_url")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.category && options.category !== "All") {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[Products] Error fetching products:", error.message);
    return fallbackProducts.slice(0, limit);
  }

  return (data as Product[]) || [];
}

/**
 * Fetches single product by ID (including embedding for similar product search)
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const item = fallbackProducts.find((p) => p.id === id);
    return item || null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, category, price, stock, image_url, embedding")
    .eq("id", id)
    .single();

  if (error || !data) {
    return fallbackProducts.find((p) => p.id === id) || null;
  }

  return data as Product;
}

/**
 * STEP 4: Similar products section
 * Reuses the stored embedding (match_products with that product's vector, no new AI call).
 */
export async function getSimilarProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return fallbackProducts
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  }

  const supabase = getSupabaseAdmin();

  // If the product has a stored embedding, reuse it directly (zero AI calls!)
  if (product.embedding && Array.isArray(product.embedding)) {
    const { data, error } = await supabase.rpc("match_products", {
      query_embedding: product.embedding,
      match_count: limit + 1, // +1 to exclude the product itself
      max_price: null,
    });

    if (!error && data) {
      return (data as Product[])
        .filter((p) => p.id !== product.id)
        .slice(0, limit);
    }
  }

  // Graceful fallback if product hasn't been embedded yet: same category products
  const { data: fallbackCategory } = await supabase
    .from("products")
    .select("id, name, description, category, price, stock, image_url")
    .eq("category", product.category)
    .neq("id", product.id)
    .gt("stock", 0)
    .limit(limit);

  return (fallbackCategory as Product[]) || [];
}
