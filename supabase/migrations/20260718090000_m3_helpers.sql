-- M3 database foundation — shared helpers.
--
-- Source of truth: docs/03-architecture/data-model.md ("Cross-cutting
-- requirements") and docs/03-architecture/identity-and-authorization.md.
-- Migrations are append-only once applied anywhere shared (CLAUDE.md).

-- Standard updated_at maintenance for mutable tables.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger function: stamps updated_at on every UPDATE of a mutable table.';
