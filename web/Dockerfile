FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

# Stage 1: Dependencies
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


# Stage 2: Builder
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN pnpm run build


# Stage 3: Runner
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV VITE_API_BASE_URL=/api

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules

# Vite build output
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "run", "preview", "--port", "3000", "--host", "0.0.0.0"]