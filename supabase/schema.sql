-- Voyora Supabase schema
-- Run this once in your Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query).
-- Auth itself needs no table here — Supabase's built-in auth.users handles
-- accounts; the display name typed at signup is stored in that user's
-- metadata automatically by the app code.

-- ============================================================
-- Saved destinations — replaces the old localStorage saved list
-- ============================================================
create table if not exists public.saved_destinations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, destination_slug)
);

alter table public.saved_destinations enable row level security;

create policy "Users can view their own saved destinations"
  on public.saved_destinations for select
  using (auth.uid() = user_id);

create policy "Users can save destinations for themselves"
  on public.saved_destinations for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own saved destinations"
  on public.saved_destinations for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Community posts — replaces the old localStorage community blog
-- ============================================================
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  title text not null,
  body text not null,
  cover_image text,
  destination_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;

-- Posts are public to read (it's a blog), but only the author can write/edit/delete.
create policy "Anyone can read community posts"
  on public.community_posts for select
  using (true);

create policy "Authenticated users can create their own posts"
  on public.community_posts for insert
  with check (auth.uid() = user_id);

create policy "Authors can update their own posts"
  on public.community_posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Authors can delete their own posts"
  on public.community_posts for delete
  using (auth.uid() = user_id);

create index if not exists community_posts_created_at_idx
  on public.community_posts (created_at desc);
