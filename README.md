# Priceyless Monorepo

Project ini adalah aplikasi fullstack manajemen harga dan produk.

## Struktur Project

- `api/`: Backend menggunakan NestJS, Prisma, dan PostgreSQL.
- `web/`: Frontend menggunakan TanStack React Start (React 19).

## Cara Menjalankan (Local Development)

### Tanpa Docker

1. **Backend**
   ```bash
   cd api
   pnpm install
   # Sesuaikan .env dengan DB PostgreSQL lokal
   pnpm prisma migrate dev
   pnpm run dev
   ```

2. **Frontend**
   ```bash
   cd web
   pnpm install
   pnpm dev
   ```

### Dengan Docker (Recommended)

Pastikan Docker dan Docker Compose sudah terinstal.

```bash
# Siapkan environment variables
cp .env.example .env
cp api/.env.example api/.env
cp web/.env.example web/.env

# Jalankan semua service
docker compose up --build
```

Akses aplikasi di:
- Frontend: [http://localhost](http://localhost)
- Backend API: [http://localhost/api](http://localhost/api)

## Dokumentasi Lengkap

Dokumentasi lebih detail tersedia di folder `/docs`:
- [Arsitektur](./docs/architecture.md)
- [Setup Detail](./docs/setup.md)
- [Database](./docs/database.md)
- [Docker Setup](./docs/docker.md)
- [Roadmap](./docs/roadmap.md)
