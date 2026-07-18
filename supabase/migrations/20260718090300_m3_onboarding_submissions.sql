-- M3: `onboarding_submissions` — immutable record of each onboarding form
-- submission (docs/03-architecture/data-model.md §onboarding_submissions).
--
-- Each submission is its own row, recorded as submitted. Processing (M6) may
-- link a member and advance `status`, but content fields are never edited.
-- This table NEVER reaches the browser: no client grants, no client policies —
-- server-only writes via the service role, admin reads via server-rendered
-- surfaces. RLS is enabled with no policies so any client access fails closed.

create table public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  -- Linked after processing; a purged/rejected submission may never link.
  member_id uuid references public.members (id) on delete set null,
  first_name text not null
    constraint onboarding_submissions_first_name_not_blank
      check (btrim(first_name) <> ''),
  phone_e164 text not null
    constraint onboarding_submissions_phone_e164_format
      check (phone_e164 ~ '^\+[1-9][0-9]{6,14}$'),
  email text
    constraint onboarding_submissions_email_shape
      check (email is null or position('@' in email) > 1),
  instagram_handle text,
  selected_group_ids uuid[] not null default '{}',
  referral_slug_claimed text,
  referral_source text not null default 'none'
    constraint onboarding_submissions_referral_source_allowed
      check (referral_source in ('cookie', 'manual', 'none')),
  guidelines_version_accepted text not null
    constraint onboarding_submissions_guidelines_version_not_blank
      check (btrim(guidelines_version_accepted) <> ''),
  status text not null default 'received'
    constraint onboarding_submissions_status_allowed
      check (status in ('received', 'processed', 'rejected', 'purged')),
  -- Anti-abuse network metadata: hashed only, short retention (30 days).
  user_agent_hash text,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.onboarding_submissions is
  'Immutable submission records. No client role has any access — server-only via service role. Unverified rows purge at 90 days; hashes drop at 30 (scheduled jobs, later milestone).';

create index onboarding_submissions_phone_idx
  on public.onboarding_submissions (phone_e164);
create index onboarding_submissions_status_idx
  on public.onboarding_submissions (status);
create index onboarding_submissions_created_at_idx
  on public.onboarding_submissions (created_at);

create trigger onboarding_submissions_set_updated_at
  before update on public.onboarding_submissions
  for each row execute function public.set_updated_at();

-- Deny-by-default, fail closed: RLS on, zero client grants, zero policies.
alter table public.onboarding_submissions enable row level security;
revoke all on table public.onboarding_submissions from anon, authenticated;
