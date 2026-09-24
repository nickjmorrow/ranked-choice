#!/usr/bin/env bash
#
# One-time setup for a fresh clone.
#
# You do NOT need this to run the app — `docker compose up` is the whole story,
# and the containers carry their own dependencies. This is for running the
# checks on your machine and for the pre-commit hook, both of which run outside
# Docker because a check you have to wait on a container for is a check you
# stop running.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

say() { printf '\n\033[1m%s\033[0m\n' "$1"; }

say "git hooks"
# Git will not version .git/hooks, so the hook lives in .githooks/ and this
# points git at it. One line, per clone, and reviewable like any other file.
git config core.hooksPath .githooks
echo "   core.hooksPath -> .githooks (pre-commit runs scripts/check.sh --fast)"

if ! command -v corepack >/dev/null 2>&1; then
  echo "   corepack not found — install Node 24+, which ships with it, and re-run."
  exit 1
fi

for half in backend frontend; do
  say "$half"
  # corepack reads `packageManager` in package.json, so this is the same pnpm
  # the Dockerfiles and CI use rather than whatever is on PATH.
  (cd "$half" && corepack pnpm install --frozen-lockfile)
done

say "done"
cat <<'MSG'
   docker compose up          run the app on http://localhost:3002
   scripts/check.sh           lint, types and tests, both halves
   scripts/check.sh --fast    what the pre-commit hook runs
MSG
