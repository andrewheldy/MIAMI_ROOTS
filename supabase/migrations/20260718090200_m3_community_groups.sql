-- M3: `community_groups` — public group content and status
-- (docs/03-architecture/data-model.md §community_groups).
--
-- Contains NO sensitive fields by design: invite links live in the separate,
-- fully client-inaccessible `group_invite_links` table when that milestone
-- arrives, so this table can be safely readable by anon.
--
-- NOTE (M3 scope): the public site continues rendering from the in-code
-- content module (`src/content/groups/`); moving content into this table is
-- Milestone 4. This migration establishes the shape and security only.

create table public.community_groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null
    constraint community_groups_slug_format
      check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null
    constraint community_groups_name_not_blank check (btrim(name) <> ''),
  short_description text not null,
  full_description text not null,
  welcome_message text,
  rules text,
  cta_label text,
  logo_path text,
  banner_path text,
  social_asset_path text,
  display_order integer not null default 0,
  visibility text not null default 'public'
    constraint community_groups_visibility_allowed
      check (visibility in ('public', 'unlisted')),
  requires_approval boolean not null default true,
  invite_reveal_policy text not null default 'after_approval'
    constraint community_groups_reveal_policy_allowed
      check (invite_reveal_policy in ('after_approval')),
  status text not null default 'active'
    constraint community_groups_status_allowed
      check (status in ('active', 'hidden', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.community_groups is
  'Public content model for each subgroup. Never holds invite links or any private community data. Content arrives in M4; groups are archived, not deleted.';

create unique index community_groups_slug_key on public.community_groups (slug);
create index community_groups_directory_idx
  on public.community_groups (status, visibility, display_order);

create trigger community_groups_set_updated_at
  before update on public.community_groups
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: anon/member read active+public rows; admins read everything;
-- owner writes. No delete policy exists for anyone (archive instead).
-- ---------------------------------------------------------------------------

alter table public.community_groups enable row level security;

revoke all on table public.community_groups from anon, authenticated;
grant select on public.community_groups to anon, authenticated;
grant insert, update on public.community_groups to authenticated;

create policy community_groups_select_public
  on public.community_groups for select to anon, authenticated
  using (status = 'active' and visibility = 'public');

create policy community_groups_select_admin
  on public.community_groups for select to authenticated
  using (public.is_admin());

create policy community_groups_insert_owner
  on public.community_groups for insert to authenticated
  with check (public.is_owner());

create policy community_groups_update_owner
  on public.community_groups for update to authenticated
  using (public.is_owner())
  with check (public.is_owner());
