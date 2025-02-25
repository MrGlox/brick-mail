FROM --platform=amd64 node:20-alpine As base

# Install pnpm using npm instead of corepack
RUN npm install -g pnpm@latest

# Setup PNPM_HOME and add it to PATH
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# Create the global bin directory manually instead of using pnpm setup
RUN mkdir -p /root/.local/share/pnpm && \
    mkdir -p /root/.local/state/pnpm && \
    mkdir -p /root/.local/store/pnpm

FROM base AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app
RUN pnpm install -g turbo
COPY --chown=node:node . .
RUN turbo prune @repo/server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --chown=node:node --from=builder /app/out/json/ .
COPY --chown=node:node --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN pnpm install --shamefully-hoist

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Build packages and copy to root node_modules
RUN pnpm --filter @repo/web build && \
    pnpm --filter @repo/database build && \
    cd packages/database && \
    pnpm prisma generate && \
    cd ../.. && \
    pnpm --filter @repo/database -w tsc -p tsconfig.seeder.json && \
    mkdir -p node_modules/@repo && \
    cp -r apps/web node_modules/@repo/web && \
    cp -r packages/database node_modules/@repo/database

# Set environment variables
ENV TZ=Europe/Paris
ENV NODE_ENV="production"

# Add build arguments for database connection
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB

# Set DATABASE_URL using build arguments
ENV DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}

ADD packages/database packages/database

# Create turbo cache directories with proper permissions
RUN mkdir -p /app/apps/web/.turbo && \
    mkdir -p /app/apps/server/.turbo && \
    mkdir -p /app/packages/database/.turbo && \
    chown -R node:node /app/apps/web/.turbo && \
    chown -R node:node /app/apps/server/.turbo && \
    chown -R node:node /app/packages/database/.turbo

# Generate Prisma client and run migrations
RUN pnpm db:generate

RUN pnpm run build

FROM base AS runner
WORKDIR /app

# Install netcat and ts-node for database connection check and TypeScript execution
RUN apk add --no-cache netcat-openbsd && \
    pnpm install -g ts-node typescript

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix-api

# Copy files with proper ownership
COPY --chown=remix-api:nodejs --from=installer /app/apps/server/package.json ./apps/server/package.json
COPY --chown=remix-api:nodejs --from=installer /app/apps/server/dist ./apps/server/dist

COPY --chown=remix-api:nodejs --from=installer /app/apps/web/package.json ./apps/web/package.json
COPY --chown=remix-api:nodejs --from=installer /app/apps/web/build ./apps/web/build

COPY --chown=remix-api:nodejs --from=installer /app/node_modules ./node_modules
COPY --chown=remix-api:nodejs --from=installer /app/packages ./packages
COPY --chown=remix-api:nodejs --from=installer /app/config ./config
COPY --chown=remix-api:nodejs --from=installer /app/packages/database/prisma ./packages/database/prisma

# Copy repo packages
COPY --chown=remix-api:nodejs --from=installer /app/node_modules/@repo/web ./node_modules/@repo/web
COPY --chown=remix-api:nodejs --from=installer /app/node_modules/@repo/database ./node_modules/@repo/database

# Copy root files with proper ownership
COPY --chown=remix-api:nodejs --from=installer /app/package.json ./package.json
COPY --chown=remix-api:nodejs --from=installer /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --chown=remix-api:nodejs --from=installer /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --chown=remix-api:nodejs --from=installer /app/turbo.json ./turbo.json

# Copy TypeScript configuration files
COPY --chown=remix-api:nodejs --from=installer /app/apps/server/tsconfig.json ./apps/server/tsconfig.json
COPY --chown=remix-api:nodejs --from=installer /app/apps/server/tsconfig.build.json ./apps/server/tsconfig.build.json

# Create and set up start.sh with proper ownership
RUN echo '#!/bin/sh\n\ncd /app/apps/server\nexec node dist/main.js' > /app/apps/server/start.sh && \
    chown remix-api:nodejs /app/apps/server/start.sh && \
    chmod +x /app/apps/server/start.sh

# Copy locales
COPY apps/server/src/core/locales ./apps/server/src/core/locales
COPY apps/web/public/locales ./apps/web/public/locales

# Create public directory structure
RUN mkdir -p /app/apps/server/public/images

# Copy static assets
COPY apps/server/public/images /app/apps/server/public/images

# Copy and make entrypoint script executable with proper ownership
COPY config/entrypoint.sh /app/config/entrypoint.sh
RUN chown remix-api:nodejs /app/config/entrypoint.sh && \
    chmod +x /app/config/entrypoint.sh

# In the runner stage, ensure we copy the built seeder files
COPY --chown=remix-api:nodejs --from=installer /app/packages/database/dist ./packages/database/dist

# Copy Prisma schema and generated files
COPY --chown=remix-api:nodejs --from=installer /app/packages/database/prisma ./packages/database/prisma
COPY --chown=remix-api:nodejs --from=installer /app/packages/database/generated ./packages/database/generated
COPY --chown=remix-api:nodejs --from=installer /app/packages/database/dist ./packages/database/dist
COPY --chown=remix-api:nodejs --from=installer /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=remix-api:nodejs --from=installer /app/node_modules/@prisma ./node_modules/@prisma

# Ensure proper permissions
RUN chown -R remix-api:nodejs ./packages/database && \
    chown -R remix-api:nodejs ./node_modules/.prisma && \
    chown -R remix-api:nodejs ./node_modules/@prisma

# Switch to non-root user before entrypoint
# USER remix-api

ENTRYPOINT [ "/app/config/entrypoint.sh" ]