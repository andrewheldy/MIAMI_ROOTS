-- M3: `members` — the identity anchor (docs/03-architecture/data-model.md §members).
--
-- One row per human known to Miami Roots. Inserts happen server-side only
-- (service role, from onboarding processing — M6). Roles are member|admin|owner
-- per docs/03-architecture/identity-and-authorization.md.

create table public.members (
  id uuid primary key default gen_random_uuid(),
  first_name text not null
    constraint members_first_name_not_blank check (btrim(first_name) <> ''),
  last_name text,
  -- E.164, the operational identity in a WhatsApp community.
  phone_e164 text not null
    constraint members_phone_e164_format check (phone_e164 ~ '^\+[1-9][0-9]{6,14}$'),
  email text
    constraint members_email_shape check (email is null or position('@' in email) > 1),
  instagram_handle text,
  -- Linked at staged activation (magic link) — null until then.
  auth_user_id uuid references auth.users (id) on delete set null,
  role text not null default 'member'
    constraint members_role_allowed check (role in ('member', 'admin', 'owner')),
  status text not null default 'applicant'
    constraint members_status_allowed
      check (status in ('applicant', 'active', 'inactive', 'deleted')),
  notes_admin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.members is
  'Identity anchor: one row per human, applicant through member. Client inserts do not exist; onboarding processing writes via the service role.';
comment on column public.members.notes_admin is
  'Admin-only working notes. Deliberately excluded from the authenticated column grant — reachable only through privileged server paths.';

create unique index members_phone_e164_key on public.members (phone_e164);
create unique index members_auth_user_id_key on public.members (auth_user_id)
  where auth_user_id is not null;
create unique index members_email_key on public.members (lower(email))
  where email is not null;
create index members_status_idx on public.members (status);
create index members_role_idx on public.members (role);

create trigger members_set_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Identity helpers used by RLS policies across the schema. SECURITY DEFINER so
-- policies can consult members without granting broad members access to every
-- role; the definer (migration role) bypasses RLS for this lookup only.
-- ---------------------------------------------------------------------------

create or replace function public.current_member_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select m.id
  from public.members m
  where m.auth_user_id = auth.uid()
    and m.status <> 'deleted';
$$;

comment on function public.current_member_id() is
  'The members.id linked to the authenticated Supabase user, or null.';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.members m
    where m.auth_user_id = auth.uid()
      and m.role in ('admin', 'owner')
      and m.status <> 'deleted'
  );
$$;

comment on function public.is_admin() is
  'True when the authenticated user is a non-deleted admin or owner member.';

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.members m
    where m.auth_user_id = auth.uid()
      and m.role = 'owner'
      and m.status <> 'deleted'
  );
$$;

comment on function public.is_owner() is
  'True when the authenticated user is the non-deleted owner member.';

revoke all on function public.current_member_id() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_owner() from public;
grant execute on function public.current_member_id() to anon, authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.is_owner() to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Row Level Security: deny by default.
--   anon: nothing. authenticated: own row (limited columns) + admin row reads.
--   Inserts/deletes: no client policies at all — server-side (service role) only.
-- ---------------------------------------------------------------------------

alter table public.members enable row level security;

revoke all on table public.members from anon, authenticated;

-- Member self-read excludes notes_admin (admin-only, via privileged server
-- paths). Column grants are per Postgres role, so this exclusion applies to
-- admins using the API too — their notes access is a server-rendered surface.
grant select (
  id, first_name, last_name, phone_e164, email, instagram_handle,
  auth_user_id, role, status, created_at, updated_at
) on public.members to authenticated;

-- The matrix allows members to edit display name, Instagram, and email only.
grant update (first_name, last_name, email, instagram_handle)
  on public.members to authenticated;

create policy members_select_own
  on public.members for select to authenticated
  using (auth_user_id = auth.uid());

create policy members_select_admin
  on public.members for select to authenticated
  using (public.is_admin());

create policy members_update_own
  on public.members for update to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());
