#!/usr/bin/env bash
#
# Reset the harness database from zero: drop the app schemas, apply the
# Supabase shim, replay every migration in order, apply the seed.
#
# This script is for the plain-Postgres harness (CI, sandboxes, `npm run
# db:reset`). Real Supabase environments use `npx supabase db reset` instead —
# the CLI provides the platform baseline itself. As a guard, this script
# refuses non-local hosts: it must never point at a hosted project.
#
# Required: SUPABASE_DB_URL, e.g. postgresql://postgres:postgres@localhost:5432/postgres

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

: "${SUPABASE_DB_URL:?SUPABASE_DB_URL must be set (e.g. postgresql://postgres:postgres@localhost:5432/postgres). It is a server-only value — never commit it.}"

# Refuse anything that isn't clearly a local/CI database.
case "$SUPABASE_DB_URL" in
  *localhost*|*127.0.0.1*|*@postgres:*|*@postgres/*) ;;
  *)
    echo "refusing to reset non-local database host (this harness is for local/CI only; use 'npx supabase db reset' for real projects)" >&2
    exit 1
    ;;
esac

PSQL=(psql "$SUPABASE_DB_URL" --no-psqlrc --set ON_ERROR_STOP=1 --quiet)

echo "==> dropping app schemas (public, auth)"
"${PSQL[@]}" <<'SQL'
drop schema if exists public cascade;
drop schema if exists auth cascade;
create schema public;
comment on schema public is 'standard public schema';
grant all on schema public to postgres;
grant create, usage on schema public to public;
SQL

echo "==> applying Supabase shim (test harness baseline)"
"${PSQL[@]}" --file "$REPO_ROOT/scripts/db/supabase-shim.sql"

echo "==> applying migrations from zero"
shopt -s nullglob
migrations=("$REPO_ROOT"/supabase/migrations/*.sql)
if [ ${#migrations[@]} -eq 0 ]; then
  echo "no migrations found" >&2
  exit 1
fi
for migration in "${migrations[@]}"; do
  echo "    -> $(basename "$migration")"
  "${PSQL[@]}" --file "$migration"
done

echo "==> applying seed"
"${PSQL[@]}" --file "$REPO_ROOT/supabase/seed/seed.sql"

echo "==> reset complete"
