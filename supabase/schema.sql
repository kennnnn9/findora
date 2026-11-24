-- Enable pgvector extension
create extension if not exists vector;

-- Create products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null,
  price numeric(10, 2) not null,
  stock int not null default 0,
  image_url text not null,
  embedding vector(768),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Vector similarity index using HNSW for cosine distance
create index if not exists products_embedding_idx 
on products 
using hnsw (embedding vector_cosine_ops);

-- Grant table and sequence permissions to Supabase roles
grant all on table products to service_role, anon, authenticated;
grant all on all sequences in schema public to service_role, anon, authenticated;

-- Enable Row Level Security and configure access policies
alter table products enable row level security;

drop policy if exists "Allow public read access" on products;
create policy "Allow public read access" 
on products for select 
using (true);

drop policy if exists "Allow service role full access" on products;
create policy "Allow service role full access" 
on products for all 
using (true) 
with check (true);


-- RPC function: match_products
-- Returns nearest products by cosine distance, optionally filtered by max_price and stock > 0
create or replace function match_products (
  query_embedding vector(768),
  match_count int,
  max_price numeric default null
)
returns table (
  id uuid,
  name text,
  description text,
  category text,
  price numeric,
  stock int,
  image_url text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    p.id,
    p.name,
    p.description,
    p.category,
    p.price,
    p.stock,
    p.image_url,
    1 - (p.embedding <=> query_embedding) as similarity
  from products p
  where p.embedding is not null
    and p.stock > 0
    and (max_price is null or p.price <= max_price)
  order by p.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Grant execution permission on match_products
grant execute on function match_products(vector(768), int, numeric) to service_role, anon, authenticated;

