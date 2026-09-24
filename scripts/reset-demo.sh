#!/usr/bin/env bash
#
# Wipe the public demo's database and bring it back with only the example
# poll. Runs on the server, nightly, from the cron file scripts/deploy.sh
# installs.
#
#   APP=ranked-choice /opt/ranked-choice/scripts/reset-demo.sh
#
# There are no accounts, so anyone can create polls and vote as often as they
# like — which is the point of a demo, and means the example poll drifts and
# the database fills with other people's tests. A reset every night keeps the
# first thing a visitor sees the thing it should be.
#
# `down -v` removes this Compose project's volumes and nothing else: -p scopes
# it, so another project sharing the server keeps its database. The images are
# already built, so `up` is a restart, not a rebuild; the migrate container
# re-creates the schema and the example poll on the way up.
#
# **It refuses to run unless DEMO_RESET=true.** That is the flag that says
# "this deployment is a demo", and the only thing standing between a cron line
# and deleting real polls every night at four.
set -euo pipefail

cd "$(dirname "$0")/.."
app="${APP:?APP must name the Compose project, as deploy.sh does}"

if ! grep -qx 'DEMO_RESET=true' .env.prod 2>/dev/null; then
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) refusing: .env.prod does not say DEMO_RESET=true, so this is not a demo" >&2
  exit 1
fi

compose="docker compose -p $app -f docker-compose.prod.yml --env-file .env.prod"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) resetting $app"
$compose down -v --remove-orphans
$compose up -d
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) reset $app"
