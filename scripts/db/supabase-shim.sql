-- Test-harness ONLY — never a migration, never applied to a real Supabase
-- project (real projects already provide all of this).
--
-- Recreates the minimum Supabase baseline on a plain Postgres server so the
-- repository's migrations and RLS tests run identically in CI and local
-- sandboxes without Docker:
--   * the `anon`, `authenticated`, `service_role` roles (service_role with
--     BYPASSRLS, matching Supabase),
--   * the `auth` schema with a stub `auth.users` and the `auth.uid()` /
--     `auth.role()` functions reading `request.jwt.claims` (the same GUC the
--     real platform sets per request),
--   * Supabase's default privileges on new `public` objects — so the explicit
--     REVOKEs in migrations are exercised exactly as they are in production.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin noinherit bypassrls;
  end if;
end
$$;

create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key,
  email text unique,
  created_at timestamptz not null default now()
);

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select case
    when coalesce(current_setting('request.jwt.claims', true), '') = '' then null
    else nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', '')::uuid
  end;
$$;

create or replace function auth.role()
returns text
language sql
stable
as $$
  select case
    when coalesce(current_setting('request.jwt.claims', true), '') = '' then 'anon'
    else coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', 'anon')
  end;
$$;

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema auth to anon, authenticated, service_role;
grant execute on all functions in schema auth to anon, authenticated, service_role;

-- Mirror Supabase's default privileges for objects created by migrations:
-- broad by default, then pared down by each migration's explicit REVOKEs.
alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant execute on functions to anon, authenticated, service_role;
