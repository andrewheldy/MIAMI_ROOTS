-- Founding Connectors program — `connectors`, `connector_nominations`, and the
-- `events.connector_id` link (owner-directed scope, 2026-08-03).
--
-- Program design: docs/01-product/founding-connectors-program.md
-- Delivery record: docs/08-delivery/founding-connectors-mvp.md
--
-- Relationship to the planned `referral_links` table (Milestone 5): a
-- Founding Connector card is NOT a member referral link. `referral_links`
-- belongs to a *member* who has been through onboarding and activation, and
-- feeds the points ledger. A connector card is issued by the owner to a person
-- who may never create an account, and credits nothing automatically. They are
-- deliberately separate tables; when M5 lands, a member may hold both, and the
-- link between them is a nullable `member_id` here — added then, with its
-- foreign key, rather than as a dangling column now (the same discipline the
-- M3 `events` migration applied to `referral_link_id`).
--
-- Migrations are append-only once applied anywhere shared (CLAUDE.md).

-- ---------------------------------------------------------------------------
-- connectors — one row per issued card
-- ---------------------------------------------------------------------------

create table public.connectors (
  id uuid primary key default gen_random_uuid(),
  -- The public code printed on the card and encoded in NFC/QR. Public by
  -- nature (it is literally printed on a physical object), but the opaque
  -- `id` is what every other table references, so a code can never leak an
  -- enumerable internal identifier.
  code text not null
    constraint connectors_code_format
      check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
    constraint connectors_code_length
      check (char_length(code) between 2 and 30),
  display_name text not null
    constraint connectors_display_name_not_blank
      check (btrim(display_name) <> ''),
  category text not null
    constraint connectors_category_allowed
      check (category in (
        'wellness', 'music', 'events', 'hospitality', 'organizing',
        'business', 'creative', 'neighborhood', 'civic'
      )),
  -- active: credited. paused/retired: the card still opens the community door
  -- (a real person is holding it) but credits nobody. Rows are never deleted —
  -- the code stays reserved so a card in the wild can never start crediting a
  -- different person.
  status text not null default 'active'
    constraint connectors_status_allowed
      check (status in ('active', 'paused', 'retired')),
  -- Editable destination: this pair is what makes a printed card re-pointable.
  -- `page`  -> destination_ref is an internal path ('/join')
  -- `group` -> destination_ref is a community_groups slug
  -- `chat`  -> destination_ref is a /go/<slug> redirect slug
  -- Deliberately NOT a URL column: an absolute URL here would make an open
  -- redirect one bad row away. The application allowlists each form again
  -- before redirecting (src/lib/connectors/destination.ts).
  destination_kind text not null default 'page'
    constraint connectors_destination_kind_allowed
      check (destination_kind in ('page', 'group', 'chat')),
  destination_ref text not null default '/join'
    constraint connectors_destination_ref_not_blank
      check (btrim(destination_ref) <> '')
    constraint connectors_destination_ref_not_absolute
      check (destination_ref !~* '^[a-z][a-z0-9+.-]*:' and destination_ref !~ '^//'),
  issued_on date,
  -- Opt-in, per the program's privacy posture: nobody is named publicly by
  -- default, and there is no consent-free path to a connector's name.
  public_recognition_consent boolean not null default false,
  notes_admin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.connectors is
  'One row per issued Founding Connector card. Written server-side only (service role); no client role reads or writes it — /r/<code> resolution happens in server code.';
comment on column public.connectors.code is
  'Public card code. Permanent once printed; never reassigned to another person.';
comment on column public.connectors.destination_ref is
  'Interpreted per destination_kind. Never an absolute URL — enforced by check constraint and re-validated in application code.';
comment on column public.connectors.notes_admin is
  'Admin-only working notes. Never exposed to any client role.';

create unique index connectors_code_key on public.connectors (code);
create index connectors_status_idx on public.connectors (status);
create index connectors_category_idx on public.connectors (category);

create trigger connectors_set_updated_at
  before update on public.connectors
  for each row execute function public.set_updated_at();

-- Deny-by-default, fail closed: RLS on, zero client grants, zero policies.
-- Card resolution is a server-side lookup; the browser never queries this.
alter table public.connectors enable row level security;
revoke all on table public.connectors from anon, authenticated;

-- ---------------------------------------------------------------------------
-- connector_nominations — intake from the public /connectors page
-- ---------------------------------------------------------------------------
--
-- Contains a real person's contact details, so it follows the
-- `onboarding_submissions` posture exactly: no client grants, no client
-- policies, server-only writes via the service role, admin reads only through
-- server-rendered surfaces.
--
-- Data minimization: exactly one person's contact details per row — the
-- submitter's. Nominating someone else records that person's NAME and public
-- handle only; their private contact details are never entered by a third
-- party who has not asked them (see docs/01-product/founding-connectors-program.md).

create table public.connector_nominations (
  id uuid primary key default gen_random_uuid(),
  kind text not null
    constraint connector_nominations_kind_allowed
      check (kind in ('self', 'other')),
  nominee_name text not null
    constraint connector_nominations_nominee_name_not_blank
      check (btrim(nominee_name) <> ''),
  -- Null for a self-nomination; required when nominating someone else, so
  -- there is always a person to follow up with for the introduction.
  nominator_name text,
  contact_method text not null
    constraint connector_nominations_contact_method_allowed
      check (contact_method in ('email', 'instagram', 'whatsapp', 'other')),
  contact_value text not null
    constraint connector_nominations_contact_value_not_blank
      check (btrim(contact_value) <> ''),
  instagram_handle text,
  neighborhood text not null
    constraint connector_nominations_neighborhood_not_blank
      check (btrim(neighborhood) <> ''),
  community_role text not null
    constraint connector_nominations_community_role_not_blank
      check (btrim(community_role) <> ''),
  why text not null
    constraint connector_nominations_why_not_blank check (btrim(why) <> ''),
  referral_source text,
  -- Storing a contact detail without permission to use it is the thing this
  -- column exists to prevent, so false is not a storable state.
  consent_to_contact boolean not null
    constraint connector_nominations_consent_required check (consent_to_contact),
  status text not null default 'received'
    constraint connector_nominations_status_allowed
      check (status in ('received', 'reviewing', 'invited', 'declined', 'purged')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint connector_nominations_nominator_present
    check (kind = 'self' or btrim(coalesce(nominator_name, '')) <> '')
);

comment on table public.connector_nominations is
  'Founding Connector interest/nomination intake. Holds contact details for the submitter only. No client role has any access — server-only via the service role. Declined/unused rows purge on the schedule in docs/01-product/founding-connectors-program.md.';

create index connector_nominations_status_idx
  on public.connector_nominations (status);
create index connector_nominations_created_at_idx
  on public.connector_nominations (created_at);

create trigger connector_nominations_set_updated_at
  before update on public.connector_nominations
  for each row execute function public.set_updated_at();

-- Deny-by-default, fail closed: RLS on, zero client grants, zero policies.
alter table public.connector_nominations enable row level security;
revoke all on table public.connector_nominations from anon, authenticated;

-- ---------------------------------------------------------------------------
-- events.connector_id — card scans join to the card that produced them
-- ---------------------------------------------------------------------------
--
-- The M3 `events` migration deferred `referral_link_id` until its table
-- existed. `connectors` now exists, so this column lands with its foreign key
-- rather than as a dangling reference.
--
-- Until the card registry moves out of src/content/connectors/ and into this
-- table, application writes leave this null and carry the public code in
-- `properties` — so turning the link on later is a backfill, not a redesign.

alter table public.events
  add column connector_id uuid references public.connectors (id) on delete set null;

comment on column public.events.connector_id is
  'The Founding Connector card a scan event came from, once cards are provisioned in the database. Null while the card registry lives in application content.';

create index events_connector_idx on public.events (connector_id);
