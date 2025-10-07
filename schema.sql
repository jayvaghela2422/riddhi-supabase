-- Schema + RLS
create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  city text,
  owner uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.businesses enable row level security;

create policy read_businesses
on public.businesses
for select
using (true);

create policy insert_own_business
on public.businesses
for insert
with check (auth.uid() = owner);

create policy update_own_business
on public.businesses
for update
using (auth.uid() = owner)
with check (auth.uid() = owner);

create policy delete_own_business
on public.businesses
for delete
using (auth.uid() = owner);
