# Four stages: dependencies, the dev server, a build, and the image that ships.
#
# `production` is last, so a bare `docker build` gives you the deployable image.
# docker-compose.yml asks for `dev` explicitly.

FROM node:24-alpine AS deps
WORKDIR /srv
# corepack reads `packageManager` from package.json, so the image, CI and your
# machine all run the same pnpm — and bumping it is one line in one file.
RUN corepack enable
# Dependencies as their own layer so source edits don't reinstall them.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


# ---------------------------------------------------------------------- dev
FROM deps AS dev
COPY . .
EXPOSE 8000
CMD ["pnpm", "start:dev"]


# -------------------------------------------------------------------- build
FROM deps AS build
COPY . .
# Compile, then drop the dev dependencies so the next stage copies only what
# runs.
RUN pnpm build && pnpm prune --prod --ignore-scripts


# --------------------------------------------------------------- production
FROM node:24-alpine AS production
WORKDIR /srv
ENV NODE_ENV=production
COPY --from=build /srv/package.json ./
COPY --from=build /srv/node_modules ./node_modules
COPY --from=build /srv/dist ./dist
# The image's own unprivileged user. Nothing here needs root.
USER node
EXPOSE 8000
# 127.0.0.1, not localhost: Alpine resolves localhost to ::1 first, and the
# API listens on IPv4.
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8000/api/health >/dev/null || exit 1
CMD ["node", "dist/main"]
