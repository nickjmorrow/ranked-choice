# Conventions

How this repository is put together, and why. The [README](./README.md) says
what the app is; this says how to change it without breaking what it relies on.
Where a rule is enforced by a tool, the tool is named — a rule nobody checks is
a suggestion.

## Layout

```
backend/                  NestJS API, TypeORM, Postgres
  src/tally/tally.ts      The counting rules. A pure function; everything else
                          is plumbing around it.
  src/polls/              Polls, questions, options and ballots: entities,
                          validated request DTOs, and the views the API returns
  src/migrations/         The schema's history. Applied migrations are never
                          edited; a change is a new file.
  src/data-source.ts      Entities and migrations, listed by import
  src/migrate.ts          The one-shot migrate container's entry point
  test/                   End-to-end tests against a real Postgres
frontend/                 React 19, Vite, Tailwind v4, TanStack Query
  src/*.ts                Pure view-model modules, each with a test beside it
  src/api/                The HTTP boundary and the wire types
  src/components/         One component per file, named after its export
  src/hooks/              One hook per file, named after its export
  src/pages/              One component per route
scripts/                  setup.sh, check.sh, deploy.sh, reset-demo.sh
```

## The counting rules

`backend/src/tally/tally.ts` is instant-runoff voting and nothing else. It
takes option ids and weighted ballots (`{ ranking, count }`) and returns every
round plus an outcome. It imports nothing from Nest or TypeORM, so its tests
(`tally.spec.ts`) need neither.

**There is one implementation, and it is on the server.** The simulator could
count in the browser — the function is pure — but then the simulator and a
real poll's results could disagree about the rules, and the one place anyone
would notice is a demo. `POST /api/tally` exists so the simulator uses the same
code path as `GET /api/polls/:link/results`.

The two simplifications the count makes — tied-last options are eliminated
together; a count where every option still receiving votes is level stops as a
tie — are written at the top of the file and show up in the UI's round
narration. Change either and you change what users are told happened; update
`frontend/src/rounds.ts` in the same commit.

## Backend

- **Entities never leave the API.** Services map them to the types in
  `polls.views.ts`. A column added to a table is not published by accident,
  and the internal `pollId` is never exposed — polls are addressed by their
  unguessable `link`.
- **Every request body is a class-validator DTO**, and the global
  `ValidationPipe` runs with `whitelist` and `forbidNonWhitelisted`: an unknown
  field is a 400, not silently dropped. Messages are written for the person
  filling in the form, because the frontend shows them verbatim.
- **Every size limit is in `src/limits.ts`**, and text limits match the column
  widths in the migrations. A request that validates always fits.
- **Ids from the client are checked against the poll.** A ballot naming an
  option from a different poll is a 400, never a row: one stray vote would
  otherwise make that question's count throw for everyone.
- **Writes are transactions.** Creating a poll is several inserts; casting a
  ballot draws an id from `ballot_submission_seq` and inserts several votes.
  Either all of it happens or none of it does.
- **Entities and migrations are listed by import** in `data-source.ts`, not
  found by glob. A glob resolves against the working directory — `src/` under
  Jest, `dist/` in production — and matches nothing quietly when it is wrong.
- **Only `config.ts` reads the environment**, and it reads it when called, so a
  test can set `DATABASE_URL` before the app is built.
- **Rate limits are per client IP.** The API trusts `X-Forwarded-For` only
  from loopback and private addresses (Caddy and nginx in front of it), so a
  visitor cannot pick their own IP by sending the header. The end-to-end tests
  rely on that, and one of them asserts the limit.

## Frontend

- **Absolute imports only** (`src/api/client`). eslint.
- **One component per file, named after its default export.** eslint
  (`react/no-multi-comp`) and `src/structure.test.ts`.
- **Colours are semantic tokens** from the `@theme` block in `src/index.css`
  — `text-ink`, `bg-accent`, `border-ink/10` — never Tailwind palette colours.
  A theme is then one block of variables, which is how dark mode works.
  `src/structure.test.ts`.
- **Top-level `src/*.ts` modules are pure** — data in, data out, no React —
  and each has a `.test.ts` beside it. The results chart's numbers
  (`rounds.ts`), the simulator's model (`scenarios.ts`) and the create-poll
  form's validation (`pollForm.ts`) are all tested without a renderer.
  `src/structure.test.ts`.
- **Server state is TanStack Query.** No component fetches in an effect.
- **The theme is set before first paint** by `public/theme.js`, a file rather
  than an inline script so the production CSP can say `script-src 'self'`.
  `src/hooks/useTheme.ts` repeats its rule; keep the two in step.

### Accessibility

These are the rules the UI was built to, and a change that breaks one is a
regression:

- Every input has a `<label>`; placeholders are examples ("e.g. …"), never the
  only name. Hints and errors are wired with `aria-describedby`, and an invalid
  field has `aria-invalid`.
- A failed submit moves focus: to the error summary on the create-poll form
  (whose entries link to their fields), to the first unanswered question on a
  ballot.
- Anything that can be dragged can also be done with buttons. A ranked option
  has move-up, move-down and remove; dnd-kit's keyboard sensor and spoken
  announcements are on as well.
- A control that removes itself from the page (ranking an option, removing
  one) puts focus somewhere sensible first. Nothing drops focus to `<body>`.
- Changes that are not a page load are announced through a polite live region:
  ranking changes, the round narration beneath the results chart, the copy
  button's result.
- The results chart is text first. Every number is written in the row; the
  bars are `aria-hidden` decoration.
- Motion respects `prefers-reduced-motion` (`motion-safe:` on every
  transition).

## Checks

```bash
scripts/check.sh           # everything: lint, format, types, tests, builds, e2e
scripts/check.sh --fast    # the pre-commit hook's subset: no database, no builds
```

One script with three callers — you, `.githooks/pre-commit`, and
`.github/workflows/ci.yml` — so a green hook and a green CI mean the same
thing. The end-to-end suite needs Postgres (`docker compose up db -d`
publishes one on 5435); CI sets `CHECK_REQUIRE_DB=1` so a missing database is a
failure rather than a skip.

## Deploying

`scripts/deploy.sh` provisions one Ubuntu server over SSH and is safe to re-run.
It is the same script as clinical-copilot's and payout-ledger's, and shares a
server with them: everything it creates is named after the app. Caddy
terminates TLS; nginx in the frontend container serves the bundle and proxies
`/api`; the backend and Postgres are never published. `scripts/reset-demo.sh`
wipes the demo nightly and refuses to run unless `.env.prod` says
`DEMO_RESET=true`.
