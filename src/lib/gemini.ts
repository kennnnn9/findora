import { GoogleGenAI } from "@google/genai";

let genAiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured in environment variables (.env.local)."
    );
  }

  if (!genAiInstance) {
    genAiInstance = new GoogleGenAI({ apiKey });
  }

  return genAiInstance;
}

export const DEFAULT_CHAT_MODEL =
  process.env.GEMINI_CHAT_MODEL || "gemini-3.6-flash";
export const FALLBACK_CHAT_MODEL = "gemini-3.6-flash";

export const EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
export const EMBEDDING_FALLBACK_MODEL = "text-embedding-004";
export const EMBEDDING_DIMENSION = 768;

/**
 * Generates an embedding vector with retry and exponential backoff for rate limits.
 */
export async function getEmbedding(
  text: string,
  maxRetries = 4,
  baseDelayMs = 1200
): Promise<number[]> {
  const ai = getGeminiClient();

  let attempt = 0;
  let lastError: unknown;

  // Primary model to try first
  let currentModel = EMBEDDING_MODEL;

  while (attempt <= maxRetries) {
    try {
      const response = await ai.models.embedContent({
        model: currentModel,
        contents: text,
        config: {
          outputDimensionality: EMBEDDING_DIMENSION,
        },
      });

      const values =
        response.embeddings?.[0]?.values ||
        (response as any).embedding?.values;
      if (!values || !Array.isArray(values) || values.length === 0) {
        throw new Error("No embedding values returned from Gemini API");
      }

      return values;
    } catch (err: unknown) {
      lastError = err;
      const errorMessage =
        err instanceof Error ? err.message : JSON.stringify(err);

      // If gemini-embedding-001 is unavailable, retry once with text-embedding-004
      if (
        (errorMessage.includes("not found") ||
          errorMessage.includes("404") ||
          errorMessage.includes("is not supported")) &&
        currentModel === EMBEDDING_MODEL
      ) {
        console.warn(
          `[Gemini] Model ${EMBEDDING_MODEL} not available, switching to ${EMBEDDING_FALLBACK_MODEL}...`
        );
        currentModel = EMBEDDING_FALLBACK_MODEL;
        continue;
      }

      // Check if it's a rate limit / quota error (429 or RESOURCE_EXHAUSTED)
      const isRateLimited =
        errorMessage.includes("429") ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("rate limit");

      if (isRateLimited && attempt < maxRetries) {
        const jitter = Math.random() * 500;
        const delay = baseDelayMs * Math.pow(2, attempt) + jitter;
        console.warn(
          `[Gemini] Rate limited. Retrying in ${Math.round(
            delay
          )}ms (Attempt ${attempt + 1}/${maxRetries})...`
        );
        await new Promise((res) => setTimeout(res, delay));
        attempt++;
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}
