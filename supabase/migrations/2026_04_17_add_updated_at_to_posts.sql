-- Adds updated_at to public.posts and a trigger that bumps it on any update,
-- so the blog list can sort by "last touched" (edits surface to the top).
--
-- Safe to run multiple times.

alter table public.posts
  add column if not exists updated_at timestamptz not null default now();

-- Backfill existing rows so ordering is stable immediately after the migration.
-- NOTE: `add column ... default now()` stamps every existing row with the
-- same timestamp, so we unconditionally overwrite with `created_at` here.
update public.posts
  set updated_at = coalesce(created_at, now());

create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;

create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_posts_updated_at();

create index if not exists posts_updated_at_idx
  on public.posts (updated_at desc);
