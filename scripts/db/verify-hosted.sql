-- Hosted-rollout verification for the M3 database foundation.
--
-- Run this in the Supabase SQL editor (Dashboard → SQL) of the STAGING project
-- after `supabase db push`, and again in PRODUCTION after its push. It is
-- strictly READ-ONLY: no rows are inserted, changed, or deleted, and nothing
-- secret is echoed. Every check row must say PASS. The SQL editor runs as
-- `postgres` (which bypasses RLS), so this verifies structure and grants —
-- the behavioral anon/member/admin matrix is proven by the repository's CI
-- suite (`npm run db:test`), which impersonates the runtime roles directly.

with checks as (
  -- 1. Exactly the six spine tables exist in public.
  select 1 as ord, 'six spine tables exist' as check_name,
    (select array_agg(tablename order by tablename)
       from pg_tables where schemaname = 'public')
    = array['audit_log','community_groups','consent_events',
            'events','members','onboarding_submissions']::name[] as pass

  union all
  -- 2. RLS is enabled on every public table.
  select 2, 'RLS enabled on every public table',
    not exists (
      select 1 from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity)

  union all
  -- 3. Expected policies exist (exact set).
  select 3, 'expected policy set matches',
    (select array_agg(p.polname order by p.polname)
       from pg_policy p
       join pg_class c on c.oid = p.polrelid
       join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public')
    = array[
        'audit_log_select_admin',
        'community_groups_insert_owner',
        'community_groups_select_admin',
        'community_groups_select_public',
        'community_groups_update_owner',
        'consent_events_select_own',
        'members_select_admin',
        'members_select_own',
        'members_update_own']::name[]

  union all
  -- 4. Server-only tables have zero policies (fail closed).
  select 4, 'no policies on onboarding_submissions/events',
    not exists (
      select 1 from pg_policy p
      join pg_class c on c.oid = p.polrelid
      where c.relname in ('onboarding_submissions','events'))

  union all
  -- 5. Documented unique indexes exist.
  select 5, 'documented unique indexes exist',
    (select count(*) from pg_indexes
      where schemaname = 'public'
        and indexname in (
          'members_phone_e164_key','members_auth_user_id_key',
          'members_email_key','community_groups_slug_key')) = 4
    and exists (
      select 1 from pg_constraint
      where conname = 'events_dedup_key_key')

  union all
  -- 6. Append-only: no UPDATE/DELETE/TRUNCATE grant for any app role on
  --    consent_events / audit_log (service_role included).
  select 6, 'append-only grants on consent_events/audit_log',
    not exists (
      select 1 from information_schema.role_table_grants
      where table_schema = 'public'
        and table_name in ('consent_events','audit_log')
        and grantee in ('anon','authenticated','service_role')
        and privilege_type in ('UPDATE','DELETE','TRUNCATE'))

  union all
  -- 7. anon/authenticated hold no privileges at all on the protected
  --    server-only tables.
  select 7, 'no client grants on onboarding_submissions/events',
    not exists (
      select 1 from information_schema.role_table_grants
      where table_schema = 'public'
        and table_name in ('onboarding_submissions','events')
        and grantee in ('anon','authenticated'))

  union all
  -- 8. anon holds no write privilege anywhere in public.
  select 8, 'anon has no write grants anywhere',
    not exists (
      select 1 from information_schema.role_table_grants
      where table_schema = 'public' and grantee = 'anon'
        and privilege_type in ('INSERT','UPDATE','DELETE','TRUNCATE'))

  union all
  -- 9. members: authenticated cannot see notes_admin (column grant absent).
  select 9, 'notes_admin excluded from authenticated column grant',
    not exists (
      select 1 from information_schema.column_privileges
      where table_schema = 'public' and table_name = 'members'
        and grantee = 'authenticated' and column_name = 'notes_admin')

  union all
  -- 10. Identity helper functions exist.
  select 10, 'identity helper functions exist',
    (select count(*) from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
        and p.proname in ('current_member_id','is_admin','is_owner','set_updated_at')) = 4
)
select ord, check_name, case when pass then 'PASS' else 'FAIL' end as result
from checks
order by ord;

-- 11. Hosted projects only (the CLI records applied migrations here; the
-- local harness has no such table — skip this query there). Expect the seven
-- 20260718xxxxxx versions, one row each.
select version, name
from supabase_migrations.schema_migrations
where version like '20260718%'
order by version;
