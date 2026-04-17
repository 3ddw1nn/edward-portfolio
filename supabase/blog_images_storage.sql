-- Public bucket for blog post images (admin upload → markdown ![](url)).
-- Run in Supabase SQL Editor after Storage is enabled on the project.

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "blog_images_public_read" on storage.objects;

-- Anyone can read objects in this bucket (public URLs)
create policy "blog_images_public_read" on storage.objects
  for select
  using (bucket_id = 'blog-images');

-- Uploads use the service role from /api/admin/upload (bypasses RLS).
