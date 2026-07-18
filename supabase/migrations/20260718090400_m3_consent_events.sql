-- M3: `consent_events` — append-only log of consent grants and withdrawals
-- (docs/03-architecture/data-model.md §consent_events).
--
-- Kept even after member anonymization (proof of consent history keyed to the
-- surviving UUID), so member deletion is anonymization — the FK deliberately
-- blocks hard-deleting a member who has consent history.
-- Append-only is mechanical: UPDATE/DELETE are revoked for every app role,
-- including service_role (grants are not bypassed by BYPASSRLS).

create table public.consent_events (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members (id),
  -- Pre-member consent (onboarding form) references the submission instead.
  submission_id uuid references public.onboarding_submissions (id),
  consent_type text not null
    constraint consent_events_type_not_blank check (btrim(consent_type) <> ''),
  document_version text,
  granted boolean not null,
  recorded_via text not null
    constraint consent_events_recorded_via_allowed
      check (recorded_via in ('onboarding_form', 'member_area', 'admin')),
  created_at timestamptz not null default now(),
  constraint consent_events_subject_present
    check (member_id is not null or submission_id is not null)
);

comment on table public.consent_events is
  'Append-only consent record (guidelines acceptance with version, contact/marketing consent, deletion requests). Never updated or deleted; corrections are new rows.';

create index consent_events_member_idx on public.consent_events (member_id);
create index consent_events_submission_idx on public.consent_events (submission_id);

-- ---------------------------------------------------------------------------
-- RLS: member reads own rows; all writes are server-side (service role).
-- No update/delete exists for anyone — enforced by revoked grants.
-- ---------------------------------------------------------------------------

alter table public.consent_events enable row level security;

revoke all on table public.consent_events from anon, authenticated;
grant select on public.consent_events to authenticated;

create policy consent_events_select_own
  on public.consent_events for select to authenticated
  using (member_id is not null and member_id = public.current_member_id());

-- Mechanical append-only: no role — not even service_role — may update/delete.
revoke update, delete, truncate on table public.consent_events
  from anon, authenticated, service_role;
