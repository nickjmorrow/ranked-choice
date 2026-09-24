#!/usr/bin/env bash
#
# The public demo's nightly tidy-up. Runs on the server from the cron file
# scripts/deploy.sh installs.
#
#   APP=ranked-choice /opt/ranked-choice/scripts/reset-demo.sh
#
# Two things, in one transaction (backend/src/demo/resetDemo.ts):
#
# - The example poll goes back to its 21 seeded ballots, so visitors' votes
#   cannot pile up until it stops showing a comeback on transfers.
# - Polls visitors created are deleted once they are 30 days old. Not
#   nightly: sharing a poll's link is the point of the app, and a link that
#   dies overnight is a broken demo.
#
# It runs inside the backend container that is already up, so nothing
# restarts and the site stays up while it happens.
#
# **It refuses to run unless DEMO_RESET=true** — here, and again inside the
# backend — because on anything but the public demo those polls are real.
set -euo pipefail

cd "$(dirname "$0")/.."
app="${APP:?APP must name the Compose project, as deploy.sh does}"

if ! grep -qx 'DEMO_RESET=true' .env.prod 2>/dev/null; then
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) refusing: .env.prod does not say DEMO_RESET=true, so this is not a demo" >&2
  exit 1
fi

compose="docker compose -p $app -f docker-compose.prod.yml --env-file .env.prod"
$compose exec -T backend node dist/reset-demo
