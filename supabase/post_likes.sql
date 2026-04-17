-- REQUIRED for post like button: run once in Supabase SQL Editor (Dashboard → SQL → New query).
-- If you skip this, POST /api/engagement/like returns 503 until the table exists.
-- Stores one like per visitor per post. API uses the service role; RLS enabled with no anon policies.

create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  constraint post_likes_slug_visitor_unique unique (post_slug, visitor_id)
);

create index if not exists post_likes_post_slug_idx
  on public.post_likes using btree (post_slug);

alter table public.post_likes enable row level security;
