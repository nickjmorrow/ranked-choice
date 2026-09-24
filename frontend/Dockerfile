# Three stages: a builder, the dev server, and nginx serving the built bundle.
#
# `production` is last, so a bare `docker build` gives you the deployable image.
# docker-compose.yml asks for `dev` explicitly.

FROM node:24-alpine AS build

WORKDIR /srv
# corepack reads `packageManager` from package.json, so the image, CI and your
# machine all run the same pnpm — and bumping it is one line in one file.
RUN corepack enable

# Dependencies as their own layer so source edits don't reinstall them.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build


# ---------------------------------------------------------------------- dev
FROM node:24-alpine AS dev

WORKDIR /srv
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

# --host binds 0.0.0.0 so the port is reachable from outside the container.
CMD ["pnpm", "dev", "--host"]


# --------------------------------------------------------------- production
FROM nginx:1.28-alpine AS production

# Static files only. There is no Node in this image and nothing to execute —
# the bundle was built in the first stage and everything else is left behind.
COPY --from=build /srv/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 127.0.0.1, not localhost: Alpine resolves localhost to ::1 first, and nginx
# listens on IPv4.
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
