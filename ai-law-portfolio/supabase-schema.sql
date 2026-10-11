-- Adyan's Portfolio article store.
-- Before running: replace 00000000-0000-0000-0000-000000000000 below
-- with the UUID of the one owner account you created in Supabase Auth.

create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  category text not null,
  body_html text not null default '',
  cover_image text,
  is_published boolean not null default false,
  published_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles enable row level security;
revoke all on public.articles from anon, authenticated;
grant select on public.articles to anon, authenticated;
grant insert, update, delete on public.articles to authenticated;

drop policy if exists "Anyone can read published articles" on public.articles;
create policy "Anyone can read published articles"
  on public.articles for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Owner can read every article" on public.articles;
create policy "Owner can read every article"
  on public.articles for select to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);

drop policy if exists "Owner can create articles" on public.articles;
create policy "Owner can create articles"
  on public.articles for insert to authenticated
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);

drop policy if exists "Owner can update articles" on public.articles;
create policy "Owner can update articles"
  on public.articles for update to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid)
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);

drop policy if exists "Owner can delete articles" on public.articles;
create policy "Owner can delete articles"
  on public.articles for delete to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);
