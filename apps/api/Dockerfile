# # Use Node 20 alpine as base
# FROM node:20-alpine AS base

# # Install pnpm
# RUN npm install -g pnpm

# # --- BUILD STAGE ---
# FROM base AS builder
# WORKDIR /app

# # Copy root config and workspaces
# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# COPY packages/shared ./packages/shared
# COPY apps/api ./apps/api

# # Install dependencies
# RUN pnpm install --frozen-lockfile

# # Generate Prisma client types before building
# WORKDIR /app/apps/api
# RUN npx prisma generate --generator client

# # Build API
# RUN pnpm build

# # --- RUNNER STAGE ---
# FROM base AS runner
# WORKDIR /app

# # Create a non-privileged user
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 node-api

# # Copy built assets
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/packages/shared ./packages/shared
# COPY --from=builder /app/apps/api ./apps/api

# WORKDIR /app/apps/api

# # Ensure prisma JS client is generated in the final image
# RUN npx prisma generate --generator client

# # Expose port
# EXPOSE 5000

# USER node-api

# CMD ["npm", "start"]


FROM node:20-alpine AS base
RUN npm install -g pnpm

# --- BUILD STAGE ---
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/api
RUN npx prisma generate --generator client
RUN pnpm build

# --- RUNNER STAGE ---
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 node-api

# Copy only what's needed to run
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/shared ./packages/shared

# Copy API source + built output
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

# Install production deps only
RUN pnpm install --frozen-lockfile --prod

WORKDIR /app/apps/api
RUN npx prisma generate --generator client

EXPOSE 5000
USER node-api

CMD ["node", "dist/server.js"]
