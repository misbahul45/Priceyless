# Setup Project

## Prasyarat

- Node.js (v22.10.x disarankan, mengacu pada types package.json).
- pnpm.
- PostgreSQL.
- Git.

## Setup Backend

```bash
cd api
pnpm install
cp .env.example .env
```

Isi `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME?schema=public"
PORT=3000
```
> *Catatan: File `.env.example` saat ini belum ada, ini adalah rekomendasi isinya.*

Generate Prisma client:

```bash
pnpm prisma generate
```

Jalankan migration:

```bash
pnpm prisma migrate dev
```

Jalankan backend:

```bash
pnpm run start:dev
```

## Setup Frontend

```bash
cd web
pnpm install
pnpm dev
```
*(Menjalankan Vite dev server di port 3000, sesuai script dev di `web/package.json`)*
