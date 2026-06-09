FROM node:22-alpine AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Stage 1: Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Set build-time env
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# Build app
RUN pnpm run build

# Stage 3: Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built assets
# Note: TanStack Start usually outputs to .output or dist depending on the adapter
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# If using a node-based adapter, we might need node_modules
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Fallback to vite preview if no start script, 
# but ideally TanStack Start should run from the built server output.
# For Docker, 'vite preview' is often used for local testing.
CMD ["pnpm", "run", "preview", "--port", "3000", "--host"]
