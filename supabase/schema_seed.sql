-- Portfolio Supabase schema (single file for a new project)
-- Supabase Dashboard → SQL → New query → paste → Run
--
-- Order: tables (FK-safe) → indexes → RLS → storage bucket + policy
-- App reads posts with the anon key; writes use the service role from API routes.

-- ── posts ───────────────────────────────────────────────────────────────────

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

create policy "posts_select_public" on public.posts
  for select
  using (true);

-- ── comments (matches /api/comments insert + select) ───────────────────────

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  name text,
  body text not null default '',
  gif_url text,
  reply_to_id uuid references public.comments (id) on delete set null,
  reply_to_name text,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_slug_idx on public.comments using btree (post_slug);

alter table public.comments enable row level security;

drop policy if exists "comments_select_public" on public.comments;

create policy "comments_select_public" on public.comments
  for select
  using (true);

-- ── comment_likes (one like per visitor per comment) ─────────────────────────

create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments (id) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  constraint comment_likes_comment_visitor_unique unique (comment_id, visitor_id)
);

create index if not exists comment_likes_comment_id_idx
  on public.comment_likes using btree (comment_id);

alter table public.comment_likes enable row level security;

-- ── post_likes (one like per visitor per post) ───────────────────────────────

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

-- ── storage: public blog images (admin upload → markdown) ─────────────────────

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "blog_images_public_read" on storage.objects;

create policy "blog_images_public_read" on storage.objects
  for select
  using (bucket_id = 'blog-images');

-- Uploads use the service role from /api/admin/upload (bypasses RLS).
