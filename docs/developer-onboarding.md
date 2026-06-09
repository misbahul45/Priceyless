# Developer Onboarding

Selamat datang di proyek Priceyless! Dokumen ini akan membantu Anda memahami cara mengatur environment lokal Anda dan menjalankan proyek ini.

## Pengenalan Proyek
Proyek ini merupakan monorepo untuk aplikasi Priceyless.
- **Backend (`api/`)**: Dibangun dengan NestJS, Prisma, dan PostgreSQL.
- **Frontend (`web/`)**: Dibangun menggunakan TanStack React Start, Vite, dan Tailwind CSS.

## Prasyarat Lingkungan
Pastikan tools berikut sudah terinstal di mesin Anda:
- **Node.js**: v22.10.x atau terbaru yang stabil.
- **pnpm**: Sebagai package manager utama proyek ini.
- **PostgreSQL**: Server database untuk backend Prisma.
- **Git**: Untuk version control.

## Langkah-langkah Setup Lokal

1. **Clone Repository**
   ```bash
   git clone <url-repo-ini>
   cd priceyless
   ```

2. **Setup Database**
   Buat database PostgreSQL lokal untuk proyek ini. Contoh: `priceyless_db`.

3. **Setup Backend**
   Masuk ke direktori backend:
   ```bash
   cd api
   pnpm install
   ```
   Buat file `.env` dan tambahkan variabel environment berikut (sesuaikan username/password dan nama db):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/priceyless_db?schema=public"
   PORT=3000
   ```
   Generate Prisma Client dan jalankan migrasi:
   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev
   ```
   Jalankan server dev:
   ```bash
   pnpm run start:dev
   ```
   Server backend akan berjalan di `http://localhost:3000`.

4. **Setup Frontend**
   Buka terminal baru, masuk ke direktori frontend dari root proyek:
   ```bash
   cd web
   pnpm install
   ```
   Jalankan server Vite dev:
   ```bash
   pnpm dev
   ```
   Aplikasi frontend akan berjalan di `http://localhost:3000` (atau port lain yang dialokasikan oleh Vite).

## Referensi Dokumentasi
Untuk memahami lebih dalam mengenai arsitektur, database, API, atau frontend, silakan merujuk ke dokumen-dokumen yang ada di folder `docs/`:
- [Architecture](./architecture.md)
- [Database Schema](./database.md)
- [API Reference](./api-reference.md)
- [Workflows](./workflows.md)