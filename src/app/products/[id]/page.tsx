import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById, getSimilarProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  ArrowLeft,
  PackageCheck,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  Heart,
  AlertCircle,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  // Similar products section: reuses stored embedding vector, NO new AI call!
  const similarProducts = await getSimilarProducts(product, 4);

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link
          href={`/?category=${encodeURIComponent(product.category)}`}
          className="hover:text-indigo-600 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Left: Product Image */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-slate-800 shadow-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                {product.name}
              </h1>
            </div>

            {/* Price & Stock Display (direct from DB) */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                ${Number(product.price).toFixed(2)}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <PackageCheck className="w-3.5 h-3.5" />
                    In Stock ({product.stock} units available)
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Overview & Description
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Free 2-Day Standard Shipping</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* STEP 4: Similar Products Section */}
      {/* Reuses the stored embedding (match_products with product.embedding, no new AI call) */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vector Similarity (Cosine Distance)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Similar Products
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Discovered automatically using the stored embedding vector—zero extra AI tokens consumed.
            </p>
          </div>

          <Link
            href={`/?category=${encodeURIComponent(product.category)}`}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            More in {product.category} &rarr;
          </Link>
        </div>

        {similarProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((similar) => (
              <ProductCard key={similar.id} product={similar} showSimilarity={Boolean(similar.similarity)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-xs">No similar products found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
