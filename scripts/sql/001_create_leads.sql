-- Run this in Supabase SQL editor (recommended) before going live.
-- It creates a 'leads' table to store contact form submissions.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  name text,
  email text,
  phone text,
  message text,
  plan text,
  source text,
  user_agent text,
  referrer text,
  ip text
);

-- Helpful indexes
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);

-- Enable RLS for safety. The API route uses the service role key and will bypass RLS.
alter table public.leads enable row level security;

-- (Optional) If you ever want to allow anon inserts directly from the browser (not recommended),
-- you can add a policy similar to the below. Keep it commented by default.
-- create policy "allow_insert_from_anon"
--   on public.leads for insert
--   to anon
--   with check (true);
