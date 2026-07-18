#!/usr/bin/env bash
# Stop the throwaway local Postgres cluster started by start-local.sh.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PGDATA="${PGDATA:-$REPO_ROOT/.local/pgdata}"

# Mirror start-local.sh's root handling.
if [ "$(id -u)" = "0" ] && id postgres >/dev/null 2>&1; then
  PGDATA="${PGDATA_ROOT_OVERRIDE:-/var/tmp/miami-roots-pgdata}"
  exec su postgres -s /bin/bash -c \
    "PGDATA='$PGDATA' bash '$REPO_ROOT/scripts/db/stop-local.sh'"
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
  echo "pg_ctl not found" >&2
  exit 1
}

PGBIN="$(find_pgbin)"

if [ -d "$PGDATA" ] && "$PGBIN/pg_ctl" --pgdata="$PGDATA" status >/dev/null 2>&1; then
  "$PGBIN/pg_ctl" --pgdata="$PGDATA" stop >/dev/null
  echo "==> stopped"
else
  echo "==> not running"
fi
