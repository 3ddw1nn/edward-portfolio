-- Run in Supabase SQL Editor after `comments` exists.
-- One like per visitor per comment. API uses service role.

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
