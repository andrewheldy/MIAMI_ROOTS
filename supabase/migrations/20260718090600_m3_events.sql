-- M3: `events` — first-party canonical funnel/analytics event stream
-- (docs/03-architecture/data-model.md §events;
--  taxonomy in docs/03-architecture/analytics-and-events.md).
--
-- Deliberate M3 deviation, documented in the decision log: the data model
-- lists a `referral_link_id` column, but the `referral_links` table is
-- explicitly deferred to Milestone 5 ("referral tables arrive with their
-- features"). The column lands in M5's migration together with its foreign
-- key, so referential integrity is never weakened by a dangling column.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null
    constraint events_name_not_blank check (btrim(event_name) <> ''),
  occurred_at timestamptz not null default now(),
  actor_kind text not null
    constraint events_actor_kind_allowed
      check (actor_kind in ('anon', 'member', 'admin', 'system')),
  member_id uuid references public.members (id) on delete set null,
  group_id uuid references public.community_groups (id),
  -- Idempotency seam: unique where present (multiple NULLs are fine).
  dedup_key text unique,
  -- Classification rules apply: never invite URLs, full phone numbers,
  -- emails, free-text member content, or raw IPs (hashed only).
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.events is
  'Canonical first-party event stream. No client role reads or writes raw events — aggregates are served by privileged server paths; retention purges are scheduled server jobs.';

create index events_name_occurred_idx on public.events (event_name, occurred_at);
create index events_member_idx on public.events (member_id);
create index events_group_idx on public.events (group_id);

-- Deny-by-default, fail closed: RLS on, zero client grants, zero policies.
-- service_role retains full access (server-side writes + retention purges).
alter table public.events enable row level security;
revoke all on table public.events from anon, authenticated;
