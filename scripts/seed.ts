import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { sampleProducts } from "./products-data";

// Load .env.local if present, fallback to .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''");
}

function generateSeedSql(): string {
  const values = sampleProducts
    .map(
      (p) =>
        `('${escapeSqlString(p.name)}', '${escapeSqlString(
          p.category
        )}', '${escapeSqlString(p.description)}', ${p.price}, ${p.stock}, '${escapeSqlString(
          p.image_url
        )}')`
    )
    .join(",\n");

  return `-- Findora 60 Realistic Sample Products Seed
-- Generated for Supabase SQL Editor execution
INSERT INTO products (name, category, description, price, stock, image_url)
VALUES
${values}
ON CONFLICT DO NOTHING;
`;
}

async function main() {
  console.log(`📦 Loaded ${sampleProducts.length} sample products across 5 categories.`);

  // Always generate/sync the supabase/seed.sql file
  const seedSqlContent = generateSeedSql();
  const seedSqlPath = path.resolve(process.cwd(), "supabase/seed.sql");
  fs.writeFileSync(seedSqlPath, seedSqlContent, "utf-8");
  console.log(`✅ Saved standalone SQL seed file to: supabase/seed.sql`);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("PASTE_YOUR") &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your_supabase")
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project") || supabaseKey.includes("PASTE_YOUR")) {
    console.log(
      "\n⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured in .env.local.\n" +
        "   To populate the database directly via API, configure your .env.local.\n" +
        "   Alternatively, run the SQL queries in 'supabase/schema.sql' and 'supabase/seed.sql' in the Supabase SQL Editor."
    );
    return;
  }

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check if products already exist and deduplicate
  const { data: existingAll, error: countError } = await supabase
    .from("products")
    .select("name");

  if (countError) {
    console.error("❌ Error querying products table:", countError.message);
    console.log("   Make sure you have executed 'supabase/schema.sql' in your Supabase SQL editor first.");
    process.exit(1);
  }

  const existingNames = new Set(existingAll?.map((p) => p.name) || []);
  const toInsert = sampleProducts.filter((p) => !existingNames.has(p.name));

  if (toInsert.length === 0) {
    console.log(`✨ All ${sampleProducts.length} sample products already exist in database! Nothing to insert.`);
    return;
  }

  // Insert in batches of 20
  console.log(`Seeding ${toInsert.length} new products into Supabase...`);
  const batchSize = 20;
  let insertedCount = 0;

  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const { data, error } = await supabase.from("products").insert(batch).select("id");

    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message);
    } else {
      insertedCount += data.length;
      console.log(`  ✓ Inserted batch ${i / batchSize + 1} (${data.length} items)`);
    }
  }

  console.log(`🎉 Seeding complete! Successfully seeded ${insertedCount} products into 'products' table.`);
}

main().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
