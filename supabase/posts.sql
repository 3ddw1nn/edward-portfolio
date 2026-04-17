-- Blog posts in Supabase (canonical on the site). Optional src/content/blog/*.mdx files are a fallback when no row exists.
-- Run in Supabase SQL Editor.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null,
  tags text[] not null default '{}',
  date text not null,
  read_time text not null default '5 min read',
  created_at timestamptz not null default now()
);

create index if not exists posts_date_idx on public.posts (date desc);

alter table public.posts enable row level security;

drop policy if exists "posts_select_public" on public.posts;

-- Public site reads posts with the anon key
create policy "posts_select_public" on public.posts
  for select
  using (true);

-- Inserts/updates/deletes use the service role (API routes) and bypass RLS
