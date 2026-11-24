import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/products";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, maxPrice, max_price, limit } = body;

    const parsedPrice =
      maxPrice !== undefined
        ? Number(maxPrice)
        : max_price !== undefined
        ? Number(max_price)
        : undefined;

    const parsedLimit = limit ? Math.min(Number(limit), 50) : 12;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "Query string is required" },
        { status: 400 }
      );
    }

    const results = await searchProducts({
      query: query.trim(),
      maxPrice: Number.isFinite(parsedPrice) && parsedPrice! > 0 ? parsedPrice : undefined,
      limit: parsedLimit,
    });

    return NextResponse.json({
      query: query.trim(),
      count: results.length,
      products: results,
    });
  } catch (err: unknown) {
    console.error("[POST /api/search Error]:", err);
    const message =
      err instanceof Error ? err.message : "Failed to execute semantic search";

    return NextResponse.json(
      {
        error: message,
        products: [],
      },
      { status: 500 }
    );
  }
}
