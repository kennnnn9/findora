"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/supabase";
import { Sparkles, PackageCheck, AlertCircle, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  showSimilarity?: boolean;
}

export function ProductCard({ product, showSimilarity = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300"
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-700 shadow-xs">
            {product.category}
          </span>
        </div>

        {/* Similarity Score Badge (if from semantic search) */}
        {showSimilarity && product.similarity !== undefined && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              {Math.round(product.similarity * 100)}% match
            </span>
          </div>
        )}

        {/* Stock status overlay badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600 text-white">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/90 text-white">
              <AlertCircle className="w-3 h-3" />
              Only {product.stock} left
            </span>
          </div>
        ) : null}
      </div>

      {/* Info details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-xs ${
                justAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-slate-900"
              }`}
              title="Add to Cart"
              aria-label="Quick add to cart"
            >
              {justAdded ? (
                <Check className="w-4 h-4 animate-in zoom-in-50 duration-150" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
