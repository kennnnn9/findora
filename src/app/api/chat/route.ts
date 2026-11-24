import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Content } from "@google/genai";
import { rateLimiter, MAX_MESSAGE_LENGTH } from "@/lib/rate-limiter";
import { searchProducts } from "@/lib/products";
import { DEFAULT_CHAT_MODEL, FALLBACK_CHAT_MODEL, getGeminiClient } from "@/lib/gemini";
import { Product } from "@/lib/supabase";

const SYSTEM_INSTRUCTION = `You are a helpful, friendly shopping assistant for the Findora e-commerce store.
Guidelines:
1. Only recommend products returned by the search_products tool.
2. Never invent products, specifications, or prices.
3. If no products match the user's criteria, explicitly say so and suggest a broader search or alternative category.
4. When recommending products, highlight why each item fits the customer's request. Keep your answers concise, informative, and engaging.
5. Never request or process sensitive personal data such as credit card numbers or passwords.`;

export async function POST(req: NextRequest) {
  // 1. IP Rate Limiting (10 requests/minute)
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  const rateCheck = rateLimiter.check(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: `Rate limit reached. Please wait ${rateCheck.retryAfterSeconds} seconds before sending another message.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await req.json();
    const { message, history } = body;

    // 2. Message length validation
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Message is too long. Please limit to ${MAX_MESSAGE_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    // 3. Check Gemini API configuration
    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch {
      return NextResponse.json({
        reply:
          "Gemini API key is not configured in .env.local yet. Please configure GEMINI_API_KEY to enable AI chat.",
        products: [],
      });
    }

    // 4. Prepare conversation contents
    // Convert previous user/model messages into Gemini content format
    const contents: Array<Content> = [];

    if (Array.isArray(history)) {
      // Keep only last 6 messages to stay concise and conserve token limits
      const recentHistory = history.slice(-6);
      for (const item of recentHistory) {
        if (item.role === "user" || item.role === "model") {
          contents.push({
            role: item.role,
            parts: [{ text: String(item.text).slice(0, MAX_MESSAGE_LENGTH) }],
          });
        }
      }
    }

    // Append latest user message
    contents.push({
      role: "user",
      parts: [{ text: message.trim() }],
    });

    // 5. Tool definition for search_products
    const tools = [
      {
        functionDeclarations: [
          {
            name: "search_products",
            description:
              "Searches the store catalog for products matching the user's intent or query keywords, with optional maximum price filter.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                query: {
                  type: Type.STRING,
                  description:
                    "Search query or keywords, e.g. 'waterproof backpack' or 'pour over kettle'",
                },
                max_price: {
                  type: Type.NUMBER,
                  description: "Optional maximum price filter in USD",
                },
              },
              required: ["query"],
            },
          },
        ],
      },
    ];

    // 6. First call to Gemini (with automatic model fallback)
    let activeChatModel = DEFAULT_CHAT_MODEL;
    let response;
    try {
      response = await ai.models.generateContent({
        model: activeChatModel,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools,
          temperature: 0.3,
        },
      });
    } catch (modelErr: any) {
      const errStr = String(modelErr?.message || modelErr);
      if (
        (errStr.includes("503") ||
          errStr.includes("404") ||
          errStr.includes("high demand") ||
          errStr.includes("not found")) &&
        activeChatModel !== FALLBACK_CHAT_MODEL
      ) {
        console.warn(
          `[Chat] Model ${activeChatModel} unavailable, falling back to ${FALLBACK_CHAT_MODEL}...`
        );
        activeChatModel = FALLBACK_CHAT_MODEL;
        response = await ai.models.generateContent({
          model: activeChatModel,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools,
            temperature: 0.3,
          },
        });
      } else {
        throw modelErr;
      }
    }

    const returnedProducts: Product[] = [];
    const functionCalls = response.functionCalls;

    // 7. If model invoked search_products tool
    if (functionCalls && functionCalls.length > 0) {
      // Preserve the model's exact candidate content with thought signature
      if (response.candidates?.[0]?.content) {
        contents.push(response.candidates[0].content);
      }

      const toolResponseParts = [];

      for (const fc of functionCalls) {
        if (fc.name === "search_products") {
          const args = (fc.args as { query?: string; max_price?: number }) || {};
          const query = args.query || message;
          const maxPrice = args.max_price;

          // Run semantic search
          const found = await searchProducts({
            query,
            maxPrice: typeof maxPrice === "number" ? maxPrice : undefined,
            limit: 6,
          });

          // Add to returned products list for UI cards
          for (const item of found) {
            if (!returnedProducts.some((p) => p.id === item.id)) {
              returnedProducts.push(item);
            }
          }

          // Feed tool execution results back to Gemini
          const sanitizedProducts = found.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            price: p.price,
            stock: p.stock,
          }));

          toolResponseParts.push({
            functionResponse: {
              name: "search_products",
              response: {
                products: sanitizedProducts,
                count: sanitizedProducts.length,
              },
            },
          });
        }
      }

      if (toolResponseParts.length > 0) {
        contents.push({
          role: "user",
          parts: toolResponseParts,
        });
      }

      // Second call to Gemini: synthesize final user-facing recommendation
      // We omit tools here so Gemini directly generates conversational text without recursive tool calls
      response = await ai.models.generateContent({
        model: activeChatModel,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });
    }

    let replyText = "";
    try {
      replyText = response.text || "";
    } catch {
      replyText = "";
    }

    if (!replyText.trim()) {
      const candidateParts = response.candidates?.[0]?.content?.parts || [];
      const textParts = candidateParts
        .filter((p) => typeof p.text === "string")
        .map((p) => p.text)
        .join("\n");
      replyText = textParts;
    }

    if (!replyText.trim()) {
      replyText =
        returnedProducts.length > 0
          ? "Here are the top products I found matching your request:"
          : "I couldn't find any products matching your search. Could you try broader terms?";
    }

    return NextResponse.json({
      reply: replyText.trim(),
      products: returnedProducts,
    });
  } catch (err: unknown) {
    console.error("[POST /api/chat Error]:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Chat service unavailable";

    const isQuotaExceeded =
      errorMessage.includes("429") ||
      errorMessage.includes("RESOURCE_EXHAUSTED") ||
      errorMessage.includes("quota");

    if (isQuotaExceeded) {
      return NextResponse.json(
        {
          error:
            "Gemini AI free-tier quota has been temporarily reached. Please wait a minute and try again.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          "An error occurred while connecting to the assistant. Please try again.",
      },
      { status: 500 }
    );
  }
}
