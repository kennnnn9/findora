# Findora 🛍️✨

An AI-powered e-commerce starter website built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase (PostgreSQL + pgvector)**, and **Google Gemini** via the official `@google/genai` SDK.

---

## 🌟 Features

- **Semantic Vector Search (pgvector)**: Find items by meaning and intent (e.g., *"quiet over-ear headphones for office work"* or *"durable kitchen gear under $50"*).
- **In-Memory Search Cache**: Lightning-fast responses for repeated search queries without re-embedding or re-querying the database.
- **Zero-Token "Similar Products"**: The product detail page reuses pre-computed product embeddings with `match_products`, consuming **zero** additional AI tokens.
- **Shopping Assistant with Tool Calling**: Gemini 2.5 Flash chatbot with a custom `search_products(query, max_price)` tool that queries real database inventory and renders interactive product cards in chat replies.
- **Strict Security Guarantees**:
  - `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are strictly server-side (API routes & server actions). Never leaked to the client.
  - Customer personal data is never transmitted to Gemini.
  - Product prices and stock levels strictly originate from Postgres records—never generated or hallucinated by model text.
- **Production Guardrails**:
  - In-memory sliding-window IP rate limiter (10 requests/minute).
  - 500-character user message cap to protect free-tier quotas.
  - Exponential backoff and retry handling for rate limits (HTTP 429 / RESOURCE_EXHAUSTED).
  - Graceful fallback mode: Runs with demo mock catalog even before Supabase or Gemini keys are set.

---

## 🛠️ Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language & Styling**: TypeScript, [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Vector Search**: [Supabase](https://supabase.com/) (PostgreSQL + `pgvector` with 768-dimensional embeddings)
- **AI & LLM**: Google Gemini API via [`@google/genai`](https://www.npmjs.com/package/@google/genai) (`gemini-2.5-flash` and `gemini-embedding-001` with `text-embedding-004` fallback)
- **Icons**: Lucide React

---

## 🚀 Setup Guide

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 & 24)
- A Supabase account ([supabase.com](https://supabase.com))
- A Google Gemini API key ([aistudio.google.com](https://aistudio.google.com))

### 2. Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Google Gemini API
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_CHAT_MODEL=gemini-2.5-flash

# Supabase Project Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

> ⚠️ **Important**: Use the `service_role` key (not the public anon key) so server scripts and API routes have full vector index and query permissions. This key is used strictly server-side.

### 3. Database Setup (Supabase)

1. Open your Supabase project dashboard and navigate to the **SQL Editor**.
2. Open [`supabase/schema.sql`](file:///Users/aungthetpaisoe/Desktop/Ai/supabase/schema.sql) in this repository, copy its contents, paste them into the SQL Editor, and click **Run**.
   - Enables the `vector` extension.
   - Creates the `products` table (columns: `id`, `name`, `description`, `category`, `price`, `stock`, `image_url`, `embedding vector(768)`).
   - Creates an HNSW cosine index `products_embedding_idx`.
   - Creates the `match_products(query_embedding, match_count, max_price)` stored function.

### 4. Seed 60 Realistic Sample Products

You can seed the database in either of two ways:

- **Option A (CLI)**:
  ```bash
  npm run seed
  ```
- **Option B (Supabase SQL Editor)**:
  Copy and execute [`supabase/seed.sql`](file:///Users/aungthetpaisoe/Desktop/Ai/supabase/seed.sql) directly in the Supabase SQL Editor.

The sample catalog includes 60 realistic products across 5 categories:
- **Electronics** (12 items)
- **Home & Kitchen** (12 items)
- **Fashion & Apparel** (12 items)
- **Health & Wellness** (12 items)
- **Sports & Outdoors** (12 items)

### 5. Generate Product Vector Embeddings

Generate 768-dimensional vector embeddings for all products using Gemini:
```bash
npm run embed
```
This script:
- Queries all products where `embedding IS NULL`.
- Builds the text string: `"${product.name}. ${product.category}. ${product.description}"`.
- Calls Gemini's embedding model with `outputDimensionality: 768`.
- Processes in polite batches with exponential backoff and jitter to stay within free-tier rate limits.
- Updates the vectors in Postgres.

### 6. Run the Application

Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the automated test suite to verify all modules:
```bash
npm test
```
The test suite validates:
1. Product catalog retrieval (60 items)
2. Category filtering
3. Product detail lookups
4. Similar products vector matching (excluding self)
5. Semantic search and price filtering
6. In-memory search cache TTL and retrieval
7. IP rate limiting (10 req/minute sliding window)
8. Message length enforcement (500 chars)

To build for production:
```bash
npm run build
```

---

## 📡 API Reference

### `POST /api/search`
Performs semantic vector search across product inventory.

**Request Body**:
```json
{
  "query": "quiet noise canceling headphones",
  "max_price": 200,
  "limit": 12
}
```

**Response**:
```json
{
  "query": "quiet noise canceling headphones",
  "count": 2,
  "products": [
    {
      "id": "...",
      "name": "Aura Noise-Canceling Wireless Headphones",
      "category": "Electronics",
      "price": 249.99,
      "stock": 35,
      "image_url": "https://...",
      "similarity": 0.89
    }
  ]
}
```

---

### `POST /api/chat`
Gemini-powered shopping assistant with function calling.

**Request Body**:
```json
{
  "message": "Can you recommend a pour-over kettle under $120?",
  "history": []
}
```

**Response**:
```json
{
  "reply": "I recommend the Artisan Gooseneck Electric Pour-Over Kettle! It features precise temperature control...",
  "products": [
    {
      "id": "...",
      "name": "Artisan Gooseneck Electric Pour-Over Kettle",
      "category": "Home & Kitchen",
      "price": 119.95,
      "stock": 25,
      "image_url": "https://..."
    }
  ]
}
```

---

## 📂 Project Structure

```
├── scripts/
│   ├── embed-products.ts       # Gemini embedding generator with backoff
│   ├── products-data.ts        # 60 sample products dataset across 5 categories
│   ├── seed.ts                 # Supabase seed runner and SQL generator
│   └── test-all.ts             # Automated verification test suite
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts   # Chatbot API with Gemini function calling
│   │   │   └── search/route.ts # Semantic search API
│   │   ├── products/[id]/      # Product detail page with similar products
│   │   ├── search/             # Semantic search results page
│   │   ├── globals.css         # Tailwind CSS styling
│   │   ├── layout.tsx          # Root layout with Navbar, Footer & Chat
│   │   └── page.tsx            # Home page with hero, filters & catalog grid
│   ├── components/
│   │   ├── category-filter.tsx # Category navigation tabs
│   │   ├── chat-widget.tsx     # Floating chatbot widget with product cards
│   │   ├── footer.tsx          # Footer with security guarantees
│   │   ├── navbar.tsx          # Sticky navigation with search bar
│   │   ├── product-card.tsx    # Product card with badges and real DB prices
│   │   └── search-bar.tsx      # Semantic search input with quick submit
│   └── lib/
│       ├── gemini.ts           # Gemini API client & embedding helper
│       ├── mock-data.ts        # In-memory fallback dataset for instant demo
│       ├── products.ts         # Unified search, fetch, and similarity logic
│       ├── rate-limiter.ts     # IP rate limiting and message length caps
│       ├── search-cache.ts     # In-memory search query cache
│       └── supabase.ts         # Server-side Supabase client & types
├── supabase/
│   ├── schema.sql              # pgvector extension, table & match_products RPC
│   └── seed.sql                # Standalone SQL insert file for 60 products
├── .env.example                # Environment variables template
├── package.json
└── README.md
```

---

## 🔒 Security Architecture

1. **Server Isolation**: No client component imports or accesses `process.env.GEMINI_API_KEY` or `process.env.SUPABASE_SERVICE_ROLE_KEY`.
2. **Zero Price Hallucination**: AI suggestions map directly to database IDs. The UI renders pricing and stock directly from the database query result.
3. **Privacy**: User chat history is filtered and bounded; no personal identifiable data is requested or forwarded.
4. **Rate Protection**: Guarded by per-IP rate limiting and character count limits to keep usage within Gemini free-tier constraints.
# findora
