"use client";

import Link from "next/link";
import { SearchBar } from "./search-bar";
import { Sparkles, ShoppingBag, Compass } from "lucide-react";
import { Suspense } from "react";
import { useCart } from "@/context/cart-context";

export function Navbar() {
  const { openCart, totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Findora
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-600 leading-none -mt-0.5">
                AI Storefront
              </span>
            </div>
          </Link>

          {/* Search bar in the header */}
          <div className="flex-1 max-w-xl hidden sm:block">
            <Suspense fallback={<div className="h-10 bg-slate-100 rounded-full animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/#categories"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50 duration-150">
                  {totalItems}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="pb-3 sm:hidden">
          <Suspense fallback={<div className="h-10 bg-slate-100 rounded-full animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
