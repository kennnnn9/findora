import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { searchProducts, getProducts, getProductById, getSimilarProducts } from "../src/lib/products";
import { searchCache } from "../src/lib/search-cache";
import { rateLimiter, MAX_MESSAGE_LENGTH } from "../src/lib/rate-limiter";

async function runTests() {
  console.log("==========================================");
  console.log("   FINDORA AUTOMATED VERIFICATION SUITE   ");
  console.log("==========================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
    }
  }

  // TEST 1: Catalog retrieval
  const allProducts = await getProducts({ limit: 100 });
  assert(allProducts.length === 60, `Catalog loaded 60 realistic sample products (got ${allProducts.length})`);

  // TEST 2: Category filtering
  const techProducts = await getProducts({ category: "Electronics", limit: 100 });
  assert(techProducts.length === 12, `Electronics category has exactly 12 products (got ${techProducts.length})`);

  // TEST 3: Product Detail Lookup
  const sample = allProducts[0];
  const found = await getProductById(sample.id);
  assert(found !== null && found.name === sample.name, `Product lookup by ID works for '${sample.name}'`);

  // TEST 4: Similar Products Logic (zero new AI calls)
  const similar = await getSimilarProducts(sample, 4);
  assert(
    similar.length > 0 && similar.every((p) => p.id !== sample.id),
    `Similar products returns recommendations excluding the item itself (count: ${similar.length})`
  );

  // TEST 5: Semantic Search & Price Filter
  const searchResultsUnder100 = await searchProducts({
    query: "headphones",
    maxPrice: 150,
    limit: 5,
  });
  assert(
    searchResultsUnder100.every((p) => p.price <= 150),
    `Search with maxPrice <= 150 filters properly (got ${searchResultsUnder100.length} items)`
  );

  // TEST 6: In-Memory Search Cache
  searchCache.clear();
  await searchProducts({ query: "pour over kettle", limit: 3 });
  const cached = searchCache.get("pour over kettle", undefined, 3);
  assert(cached !== null && cached.length > 0, "Search query is stored and retrieved from in-memory cache");

  // TEST 7: Rate Limiter (10 requests per minute per IP)
  const testIp = "192.168.1.100";
  for (let i = 0; i < 10; i++) {
    rateLimiter.check(testIp);
  }
  const eleventhReq = rateLimiter.check(testIp);
  assert(!eleventhReq.allowed, `Rate limiter blocks 11th request in 1 minute (retryAfter: ${eleventhReq.retryAfterSeconds}s)`);

  // TEST 8: Message Length Cap Constant
  assert(MAX_MESSAGE_LENGTH === 500, `Message length cap is configured to 500 characters`);

  console.log("\n==========================================");
  console.log(`RESULTS: ${passed}/${total} tests passed successfully.`);
  console.log("==========================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
