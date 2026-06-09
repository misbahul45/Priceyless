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

# Prisma config membutuhkan DATABASE_URL saat build.
# Ini hanya build-time dummy URL. Prisma generate tidak connect ke database.
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/priceyless?schema=public
ENV DATABASE_URL=$DATABASE_URL

RUN pnpm prisma generate
RUN pnpm run build


# Stage 3: Runner
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/generated ./dist/generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
