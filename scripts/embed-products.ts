import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local first, fallback to .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
const EMBEDDING_FALLBACK_MODEL = "text-embedding-004";
const EMBEDDING_DIMENSION = 768;

// Rate limiting & batch configuration for free tier
const BATCH_SIZE = 4;
const DELAY_BETWEEN_CALLS_MS = 600;
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 1500;

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

async function getEmbeddingWithRetry(
  ai: GoogleGenAI,
  text: string,
  modelName: string = EMBEDDING_MODEL
): Promise<{ vector: number[]; activeModel: string }> {
  let attempt = 0;
  let currentModel = modelName;

  while (attempt <= MAX_RETRIES) {
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
        throw new Error("No embedding values in API response");
      }

      return { vector: values, activeModel: currentModel };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);

      // Model fallback if gemini-embedding-001 is unavailable
      if (
        (errorMsg.includes("not found") ||
          errorMsg.includes("404") ||
          errorMsg.includes("is not supported")) &&
        currentModel === EMBEDDING_MODEL
      ) {
        console.warn(
          `  ⚠️ Model '${EMBEDDING_MODEL}' unavailable. Falling back to '${EMBEDDING_FALLBACK_MODEL}'...`
        );
        currentModel = EMBEDDING_FALLBACK_MODEL;
        continue;
      }

      const isQuotaError =
        errorMsg.includes("429") ||
        errorMsg.includes("RESOURCE_EXHAUSTED") ||
        errorMsg.includes("quota") ||
        errorMsg.includes("rate limit");

      if (isQuotaError && attempt < MAX_RETRIES) {
        const jitter = Math.random() * 800;
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt) + jitter;
        console.warn(
          `  ⏳ Rate limit encountered. Backing off for ${Math.round(
            delay
          )}ms (retry ${attempt + 1}/${MAX_RETRIES})...`
        );
        await sleep(delay);
        attempt++;
        continue;
      }

      throw err;
    }
  }

  throw new Error("Exceeded max retries for embedding generation");
}

async function main() {
  console.log("=========================================");
  console.log("  Findora: Product Embeddings Generator  ");
  console.log("=========================================\n");

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("PASTE_YOUR") &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your_supabase")
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project") || supabaseKey.includes("PASTE_YOUR")) {
    console.error("❌ SUPABASE_URL and a Supabase key must be set in .env.local.");
    process.exit(1);
  }

  if (!geminiApiKey || geminiApiKey.includes("your_gemini_api_key")) {
    console.error("❌ GEMINI_API_KEY must be set in .env.local.");
    console.error("   Get an API key from https://aistudio.google.com/");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const ai = new GoogleGenAI({ apiKey: geminiApiKey });

  console.log("🔍 Checking products in Supabase...");

  // Query products where embedding IS NULL
  const { data: pendingProducts, error: fetchError } = await supabase
    .from("products")
    .select("id, name, category, description")
    .is("embedding", null);

  if (fetchError) {
    console.error("❌ Failed to query products:", fetchError.message);
    process.exit(1);
  }

  if (!pendingProducts || pendingProducts.length === 0) {
    console.log("✨ All products already have embeddings! Nothing to do.");
    return;
  }

  console.log(
    `📦 Found ${pendingProducts.length} product(s) without embeddings.`
  );
  console.log(
    `⚙️  Processing in batches of ${BATCH_SIZE} with free-tier rate limit backoff...\n`
  );

  let successCount = 0;
  let activeModel = EMBEDDING_MODEL;

  for (let i = 0; i < pendingProducts.length; i += BATCH_SIZE) {
    const batch = pendingProducts.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(pendingProducts.length / BATCH_SIZE);

    console.log(
      `--- Processing Batch ${batchNum}/${totalBatches} (${batch.length} items) ---`
    );

    for (const product of batch) {
      const inputText = `${product.name}. ${product.category}. ${product.description}`;

      try {
        const result = await getEmbeddingWithRetry(ai, inputText, activeModel);
        activeModel = result.activeModel;

        const { error: updateError } = await supabase
          .from("products")
          .update({ embedding: result.vector })
          .eq("id", product.id);

        if (updateError) {
          console.error(`  ❌ Failed to update [${product.name}]:`, updateError.message);
        } else {
          successCount++;
          console.log(`  ✓ Embedded [${product.name}] (dims: ${result.vector.length})`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  ❌ Error embedding [${product.name}]:`, msg);
      }

      await sleep(DELAY_BETWEEN_CALLS_MS);
    }

    if (i + BATCH_SIZE < pendingProducts.length) {
      await sleep(1000);
    }
  }

  console.log("\n=========================================");
  console.log(
    `🎉 Finished embedding! Successfully updated ${successCount}/${pendingProducts.length} products.`
  );
  console.log("=========================================");
}

main().catch((err) => {
  console.error("Fatal error in embedding script:", err);
  process.exit(1);
});
