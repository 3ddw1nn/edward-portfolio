-- Lets admins set `updated_at` manually via the admin form by only
-- auto-bumping when the caller didn't explicitly provide a new value.
--
-- Rule: if the UPDATE changes `updated_at` (or sets it to a different value
-- than the existing one), respect what was sent. Otherwise, stamp now().

create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  if new.updated_at is not distinct from old.updated_at then
    new.updated_at := now();
  end if;
  return new;
end;
$$;
