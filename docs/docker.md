# Docker Setup

## Service

| Service | Container | Port Host | Port Internal | Fungsi |
|---|---|---:|---:|---|
| nginx | project-nginx | 80 | 80 | Reverse proxy (Entry point) |
| web | project-web | 3002 | 3000 | Frontend app (TanStack Start) |
| api | project-api | 3001 | 3000 | NestJS backend (API) |
| postgres | project-postgres | 5432 | 5432 | PostgreSQL Database |

## URL

| URL | Fungsi |
|---|---|
| http://localhost | Frontend utama |
| http://localhost/api | Backend API (lewat Nginx proxy) |
| http://localhost:3001 | Backend direct (untuk debugging) |
| http://localhost:3002 | Frontend direct (untuk debugging) |

## Menjalankan Project

1. **Siapkan Environment Variables**
   ```bash
   cp .env.example .env
   cp api/.env.example api/.env
   cp web/.env.example web/.env
   ```

2. **Jalankan Docker Compose**
   ```bash
   docker compose up --build
   ```

## Menjalankan Migration

Migration dijalankan otomatis oleh service `api` saat container baru dinyalakan menggunakan command:
```bash
npx prisma migrate deploy
```

Jika ingin menjalankan migration secara manual:
```bash
docker compose exec api npx prisma migrate deploy
```

## Melihat Log

```bash
docker compose logs -f
docker compose logs -f api
docker compose logs -f web
```

## Troubleshooting

### API tidak bisa connect database
Pastikan `DATABASE_URL` di dalam Docker Compose atau `.env` internal `api` menggunakan host `postgres` (nama service), bukan `localhost`.

### Nginx 502 Bad Gateway
- Pastikan service `api` dan `web` sudah berjalan (`docker compose ps`).
- Cek log `web` untuk memastikan server frontend sudah siap menerima request.
- Jika TanStack Start menggunakan port selain 3000, sesuaikan di `docker-compose.yml` dan `nginx.conf`.

### Masalah Prisma Client
Jika muncul error module not found untuk Prisma, pastikan `pnpm prisma generate` berhasil dijalankan pada tahap build di `Dockerfile`.
