import Link from "next/link";
import { Sparkles, ShieldCheck, Database, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-lg">Findora</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation AI-powered e-commerce starter with semantic vector search and Google Gemini assistance.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/?category=Electronics" className="hover:text-white transition-colors">
                  Electronics & Gadgets
                </Link>
              </li>
              <li>
                <Link href="/?category=Home+%26+Kitchen" className="hover:text-white transition-colors">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link href="/?category=Fashion+%26+Apparel" className="hover:text-white transition-colors">
                  Fashion & Apparel
                </Link>
              </li>
              <li>
                <Link href="/?category=Health+%26+Wellness" className="hover:text-white transition-colors">
                  Health & Wellness
                </Link>
              </li>
              <li>
                <Link href="/?category=Sports+%26+Outdoors" className="hover:text-white transition-colors">
                  Sports & Outdoors
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Architecture & Stack
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Supabase + pgvector (768d)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Google Gemini API (@google/genai)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Server-only API Keys & DB Verified</span>
              </li>
            </ul>
          </div>

          {/* Security & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Security Guarantee
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prices and stock always originate from Postgres database records, never generated from model text. Customer privacy is strictly preserved.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              © {new Date().getFullYear()} Findora Inc. Starter template.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
