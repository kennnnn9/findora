import { Product } from "./supabase";
import { sampleProducts } from "../../scripts/products-data";

// Fallback products used when Supabase is not yet configured
export const fallbackProducts: Product[] = sampleProducts.map((p, idx) => ({
  id: `mock-${idx + 1}`,
  name: p.name,
  category: p.category,
  description: p.description,
  price: p.price,
  stock: p.stock,
  image_url: p.image_url,
  created_at: new Date(Date.now() - idx * 3600000).toISOString(),
}));
