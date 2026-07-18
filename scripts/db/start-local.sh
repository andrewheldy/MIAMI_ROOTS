#!/usr/bin/env bash
#
# Start a throwaway local Postgres cluster for the database harness in
# environments without Docker (where `npx supabase start` isn't possible).
# Data lives in .local/pgdata (gitignored); the server listens on 55432.
#
# After it starts:
#   export SUPABASE_DB_URL=postgresql://postgres@localhost:55432/postgres
#   npm run db:reset && npm run db:test

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PGDATA="${PGDATA:-$REPO_ROOT/.local/pgdata}"
PGPORT="${PGPORT:-55432}"

# Postgres refuses to run as root. When invoked as root (containers/sandboxes),
# re-run as the unprivileged postgres user against a directory it can own.
if [ "$(id -u)" = "0" ] && id postgres >/dev/null 2>&1; then
  PGDATA="${PGDATA_ROOT_OVERRIDE:-/var/tmp/miami-roots-pgdata}"
  mkdir -p "$PGDATA"
  chown postgres:postgres "$PGDATA"
  exec su postgres -s /bin/bash -c \
    "PGDATA='$PGDATA' PGPORT='$PGPORT' bash '$REPO_ROOT/scripts/db/start-local.sh'"
fi

find_pgbin() {
  if command -v pg_ctl >/dev/null 2>&1; then
    dirname "$(command -v pg_ctl)"
    return
  fi
  for dir in /usr/lib/postgresql/*/bin; do
    if [ -x "$dir/pg_ctl" ]; then
      echo "$dir"
      return
    fi
  done
  echo "pg_ctl not found — install PostgreSQL or use 'npx supabase start'" >&2
  exit 1
}

PGBIN="$(find_pgbin)"

if [ ! -f "$PGDATA/PG_VERSION" ]; then
  echo "==> initializing cluster at $PGDATA"
  mkdir -p "$PGDATA"
  "$PGBIN/initdb" --pgdata="$PGDATA" --username=postgres --auth=trust --no-instructions >/dev/null
fi

if "$PGBIN/pg_ctl" --pgdata="$PGDATA" status >/dev/null 2>&1; then
  echo "==> cluster already running"
else
  echo "==> starting cluster on port $PGPORT"
  "$PGBIN/pg_ctl" --pgdata="$PGDATA" --log="$PGDATA/postgres.log" \
    --options="-p $PGPORT -k /tmp -c listen_addresses=localhost" start >/dev/null
fi

echo "==> ready"
echo "    export SUPABASE_DB_URL=postgresql://postgres@localhost:$PGPORT/postgres"
