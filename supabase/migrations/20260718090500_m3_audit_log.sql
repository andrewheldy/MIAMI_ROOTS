-- M3: `audit_log` — append-only record of every privileged or state-changing
-- action (docs/03-architecture/data-model.md §audit_log).
--
-- Redaction rule (hard): metadata never contains invite URLs, full phone
-- numbers, or emails — entity IDs and last-4 masking only. Enforced by the
-- writing code paths and review; the table is structurally append-only.

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null
    constraint audit_log_actor_type_allowed
      check (actor_type in ('admin', 'owner', 'system')),
  actor_id uuid references public.members (id),
  action text not null
    constraint audit_log_action_not_blank check (btrim(action) <> ''),
  entity_type text not null
    constraint audit_log_entity_type_not_blank check (btrim(entity_type) <> ''),
  entity_id uuid,
  from_state text,
  to_state text,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  -- System actions have no member actor; human actions must name one.
  constraint audit_log_actor_id_presence
    check (actor_type = 'system' or actor_id is not null)
);

comment on table public.audit_log is
  'Append-only audit trail: who did what to which entity, from→to, why. metadata must never contain invite URLs, full phone numbers, or emails.';

create index audit_log_entity_idx on public.audit_log (entity_type, entity_id);
create index audit_log_actor_idx on public.audit_log (actor_id, created_at);

-- ---------------------------------------------------------------------------
-- RLS: admin/owner read; system writes server-side (service role).
-- No update/delete for anyone, mechanically.
-- ---------------------------------------------------------------------------

alter table public.audit_log enable row level security;

revoke all on table public.audit_log from anon, authenticated;
grant select on public.audit_log to authenticated;

create policy audit_log_select_admin
  on public.audit_log for select to authenticated
  using (public.is_admin());

revoke update, delete, truncate on table public.audit_log
  from anon, authenticated, service_role;
