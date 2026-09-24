#!/usr/bin/env bash
#
# Every check this repo knows how to run, in one place.
#
# Three callers, one script, on purpose: you run it by hand, `.githooks/pre-commit`
# runs it on the halves you touched, and `.github/workflows/ci.yml` runs it in
# CI. A pre-commit hook that checks something different from CI is worse than no
# hook — it teaches you to trust a green that does not mean anything.
#
#   scripts/check.sh                 everything
#   scripts/check.sh backend         backend only
#   scripts/check.sh frontend        frontend only
#   scripts/check.sh --fast          skip anything slow or stateful (see below)
#
# --fast drops the two checks that are not a pure function of the source: the
# end-to-end suite, which needs a Postgres, and the production builds, which
# are slow and re-prove what the type checks just proved. The hook uses it. CI
# does not.
#
# Failures are collected rather than fatal: one run tells you everything that is
# wrong, not the first thing.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

FAST=0
TARGET=all
for arg in "$@"; do
  case "$arg" in
    --fast) FAST=1 ;;
    backend | frontend | all) TARGET="$arg" ;;
    *)
      echo "usage: scripts/check.sh [backend|frontend|all] [--fast]" >&2
      exit 2
      ;;
  esac
done

FAILED=()
STEP_INDEX=0

# Run one check, remember whether it passed, keep going either way.
step() {
  local name="$1"
  shift
  STEP_INDEX=$((STEP_INDEX + 1))
  printf '\n\033[1m── %s\033[0m\n' "$name"
  if "$@"; then
    return 0
  fi
  FAILED+=("$name")
  return 1
}

note() { printf '\033[2m   %s\033[0m\n' "$1"; }

# pnpm, however this machine has it. `corepack pnpm` reads the `packageManager`
# field in package.json, so it is the SAME pnpm the Dockerfiles and CI use
# rather than whatever happens to be on PATH.
pnpm_cmd() {
  if command -v corepack >/dev/null 2>&1; then
    corepack pnpm "$@"
  elif command -v pnpm >/dev/null 2>&1; then
    pnpm "$@"
  else
    echo "pnpm not found. Install Node 24+ (corepack ships with it) or pnpm itself." >&2
    return 127
  fi
}

# Is there a Postgres for the end-to-end suite? Checked rather than assumed,
# because `docker compose up db` is a thing you forget.
database_is_up() {
  local url="${TEST_DATABASE_ADMIN_URL:-postgresql://app:app@localhost:5435/postgres}"
  local host port
  host="$(printf '%s' "$url" | sed -E 's|.*@([^:/]+).*|\1|')"
  port="$(printf '%s' "$url" | sed -E 's|.*:([0-9]+)/.*|\1|')"
  (echo >"/dev/tcp/${host}/${port}") >/dev/null 2>&1
}

# Install a half's dependencies if they are missing.
ensure_installed() {
  if [ ! -d node_modules ]; then
    note "node_modules missing — installing"
    pnpm_cmd install --frozen-lockfile || return 1
  fi
}

check_backend() {
  cd "$ROOT/backend" || return
  if ! ensure_installed; then
    FAILED+=("backend (install)")
    cd "$ROOT" || return
    return
  fi

  step "backend · lint" pnpm_cmd lint
  step "backend · format" pnpm_cmd format:check
  step "backend · types" pnpm_cmd typecheck
  # The counting rules: pure functions, no database.
  step "backend · unit tests" pnpm_cmd test

  if [ "$FAST" = "1" ]; then
    note "skipping the end-to-end suite and the build (--fast)"
  else
    step "backend · build" pnpm_cmd build
    if database_is_up; then
      step "backend · end-to-end tests" pnpm_cmd test:e2e
    elif [ "${CHECK_REQUIRE_DB:-0}" = "1" ]; then
      # CI sets this. Without it, a Postgres service that failed to come up
      # would make the suite quietly skip and the build go green.
      echo "CHECK_REQUIRE_DB=1 but no database is reachable." >&2
      FAILED+=("backend · end-to-end tests — no database")
    else
      note "no database reachable — skipping the end-to-end suite."
      note "start one with: docker compose up db -d"
    fi
  fi

  cd "$ROOT" || return
}

check_frontend() {
  cd "$ROOT/frontend" || return
  if ! ensure_installed; then
    FAILED+=("frontend (install)")
    cd "$ROOT" || return
    return
  fi

  step "frontend · lint" pnpm_cmd lint
  step "frontend · format" pnpm_cmd format:check
  step "frontend · types" pnpm_cmd typecheck
  step "frontend · tests" pnpm_cmd test

  if [ "$FAST" = "1" ]; then
    note "skipping the production build (--fast)"
  else
    # Not redundant with typecheck: `build` is `tsc -b && vite build`, which
    # proves the bundle actually resolves and builds.
    step "frontend · build" pnpm_cmd build
  fi

  cd "$ROOT" || return
}

if [ "$TARGET" = "all" ] || [ "$TARGET" = "backend" ]; then check_backend; fi
if [ "$TARGET" = "all" ] || [ "$TARGET" = "frontend" ]; then check_frontend; fi

echo
if [ ${#FAILED[@]} -eq 0 ]; then
  printf '\033[32m✔ all checks passed\033[0m (%s steps)\n' "$STEP_INDEX"
  exit 0
fi

printf '\033[31m✘ %s of %s checks failed:\033[0m\n' "${#FAILED[@]}" "$STEP_INDEX"
printf '   %s\n' "${FAILED[@]}"
exit 1
