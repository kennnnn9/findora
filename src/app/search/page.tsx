import Link from "next/link";
import { Product } from "@/lib/supabase";
import { searchProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";
import { Sparkles, Filter, AlertCircle, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    max_price?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const maxPriceParam = resolvedParams.max_price;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  let products: Product[] = [];
  let errorMsg: string | null = null;

  if (query.trim()) {
    try {
      products = await searchProducts({
        query: query.trim(),
        maxPrice: Number.isFinite(maxPrice) && maxPrice! > 0 ? maxPrice : undefined,
        limit: 24,
      });
    } catch (err: unknown) {
      console.error("Search page query error:", err);
      errorMsg = err instanceof Error ? err.message : "Search query failed";
    }
  }

  const PRICE_FILTERS = [
    { label: "All Prices", value: "" },
    { label: "Under $50", value: "50" },
    { label: "Under $100", value: "100" },
    { label: "Under $150", value: "150" },
    { label: "Under $200", value: "200" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to Home & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Header and Search Bar refinement */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Semantic Search Results</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {query ? (
                <>
                  Results for &ldquo;<span className="text-indigo-600">{query}</span>&rdquo;
                </>
              ) : (
                "Search Products"
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {products.length} {products.length === 1 ? "product" : "products"} found matching your description
            </p>
          </div>

          <div className="w-full md:w-96">
            <Suspense fallback={<div className="h-10 bg-slate-100 rounded-full animate-pulse" />}>
              <SearchBar placeholder="Refine your search..." />
            </Suspense>
          </div>
        </div>

        {/* Price filters */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Price:</span>
          </div>

          {PRICE_FILTERS.map((f) => {
            const isSelected = (maxPriceParam || "") === f.value;
            const newParams = new URLSearchParams();
            if (query) newParams.set("q", query);
            if (f.value) newParams.set("max_price", f.value);

            return (
              <Link
                key={f.value}
                href={`/search?${newParams.toString()}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Results Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showSimilarity={true} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            We couldn&apos;t find products matching &ldquo;{query}&rdquo;. Try using broader terms,
            checking for typos, or removing price filters.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 text-sm">Enter a search query in the search bar above.</p>
        </div>
      )}
    </div>
  );
}
