# Deployment Documentation

## Frontend (Web)

Aplikasi web dikonfigurasi untuk di-deploy ke Netlify.
Terdapat plugin `@netlify/vite-plugin-tanstack-start` di dalam `web/vite.config.ts`.
Terdapat juga file konfigurasi `web/netlify.toml`.

Langkah deployment standar Netlify:
1. Hubungkan repository ke Netlify.
2. Netlify akan secara otomatis mendeteksi project Vite.
3. Build command: `pnpm build` (di dalam directory `web/`).
4. Pastikan environment variables (seperti URL backend) di-set di dashboard Netlify.

## Backend (API)

Backend NestJS belum memiliki target deployment spesifik atau file Docker/Docker Compose di repository ini.

Rekomendasi Deployment:
- Dapat di-deploy sebagai container menggunakan Docker (perlu dibuat `Dockerfile`).
- Dapat di-deploy di platform PaaS seperti Render, Railway, Fly.io, atau AWS.
- Diperlukan setup server PostgreSQL (seperti Supabase, AWS RDS, atau self-hosted).

Langkah deployment dasar:
1. Konfigurasi environment `DATABASE_URL`.
2. Jalankan `pnpm prisma migrate deploy` saat build step.
3. Build dengan `pnpm build`.
4. Jalankan aplikasi hasil build `pnpm run start:prod` (menjalankan `node dist/main`).