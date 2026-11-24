import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import { isSupabaseConfigured, isGeminiConfigured } from "@/lib/supabase";
import { ProductCard } from "@/components/product-card";
import { CategoryFilter } from "@/components/category-filter";
import { SearchBar } from "@/components/search-bar";
import { Sparkles, ArrowRight, Zap, CheckCircle2, ShieldCheck, Database } from "lucide-react";

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const selectedCategory = resolvedParams.category || "All";
  const products = await getProducts({ category: selectedCategory, limit: 60 });

  const supabaseReady = isSupabaseConfigured();
  const geminiReady = isGeminiConfigured();

  const QUICK_PROMPTS = [
    { label: "Quiet headphones for coding", query: "noise canceling headphones for work" },
    { label: "Pour-over coffee essentials", query: "gooseneck kettle and cold brew coffee" },
    { label: "Lightweight hiking gear", query: "ultralight backpacking tent sleeping bag" },
    { label: "Warm cashmere sweater", query: "Mongolian cashmere sweater" },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200/60 pt-12 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Semantic Vector Search + Gemini Function Calling</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
            Find exactly what you want,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              the way you describe it.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Search with human language, explore semantic similarity powered by pgvector,
            and chat with our AI shopping assistant.
          </p>

          {/* Centralized Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <Suspense fallback={<div className="h-12 bg-slate-100 rounded-full animate-pulse" />}>
              <SearchBar
                placeholder="Describe what you need (e.g. 'compact kitchen appliances under $100')..."
                className="shadow-lg"
              />
            </Suspense>
          </div>

          {/* Quick Prompts */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Try searching:</span>
            {QUICK_PROMPTS.map((p, idx) => (
              <Link
                key={idx}
                href={`/search?q=${encodeURIComponent(p.query)}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-2xs"
              >
                <span>{p.label}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="categories">
        {/* Environment Status Notice (Helps developer if DB/API keys not yet set) */}
        {(!supabaseReady || !geminiReady) && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Starter Demo Mode:</strong>{" "}
                {!supabaseReady && !geminiReady
                  ? "Supabase & Gemini credentials not set in .env.local. Showing sample catalog with instant fallback search."
                  : !supabaseReady
                  ? "Supabase not connected. Showing demo catalog."
                  : "Gemini API key not configured in .env.local."}
              </span>
            </div>
            <span className="text-[11px] font-mono bg-amber-100 px-2 py-1 rounded text-amber-800">
              Check README.md for setup steps
            </span>
          </div>
        )}

        {/* Category Filter & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {selectedCategory === "All" ? "Featured Products" : selectedCategory}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {products.length} product{products.length === 1 ? "" : "s"} with verified database stock
            </p>
          </div>

          <Suspense fallback={<div className="h-8 w-64 bg-slate-100 rounded-full animate-pulse" />}>
            <CategoryFilter />
          </Suspense>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Feature Highlights Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Semantic AI Search</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Find products by meaning, feeling, and intent—not just exact keywords—using 768-dimensional embeddings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Strict Security Rules</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                API keys remain 100% server-side. Prices and stock originate from database records, never generated from model text.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Gemini Function Calling</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Our chatbot calls <code className="text-violet-700 bg-violet-100/60 px-1 py-0.5 rounded text-[11px]">search_products</code> tool to inspect catalog inventory and recommend actual items.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
