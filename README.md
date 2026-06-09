# Priceyless

Full-stack product & category inventory dashboard dengan autentikasi JWT dan role-based access control.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Core Features](#core-features)
- [Service Architecture](#service-architecture)
- [API and Web Relationship](#api-and-web-relationship)
- [Database Overview](#database-overview)
- [Docker Compose Architecture](#docker-compose-architecture)
- [Nginx Reverse Proxy](#nginx-reverse-proxy)
- [Development Workflow](#development-workflow)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [Build and Deployment](#build-and-deployment)
- [Testing Strategy](#testing-strategy)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Current Limitations](#current-limitations)
- [Contribution Guide](#contribution-guide)

---

## Overview

**Priceyless** adalah aplikasi fullstack manajemen produk dan kategori. Aplikasi ini menyediakan dashboard web untuk mengelola inventaris produk, termasuk autentikasi user, role-based access (USER dan ADMIN), serta operasi CRUD pada kategori dan produk.

### Fitur Utama

- User registration dan login (JWT authentication)
- Dashboard overview dengan statistik (total produk, kategori, stok, nilai inventaris)
- Kategori management (CRUD)
- Produk management (CRUD dengan relasi ke kategori)
- Role-based access control (USER untuk read, ADMIN untuk CRUD)
- Dockerized deployment dengan Nginx reverse proxy

---

## System Architecture

```mermaid
flowchart LR
  User[User Browser] --> Nginx[Nginx Reverse Proxy :80]
  Nginx --> Web[Web App :3000]
  Nginx --> API[API Service :3000]
  API --> Prisma[Prisma ORM]
  Prisma --> Postgres[(PostgreSQL :5432)]
```

### Alur Request

1. User membuka browser dan mengakses `http://localhost`.
2. Nginx menerima request dan meneruskan ke service yang sesuai:
   - Path `/api/*` → API service (NestJS)
   - Path `/*` → Web service (React/Vite)
3. Web service mengirimkan halaman HTML + JavaScript.
4. Frontend melakukan API calls ke `/api/v1/*`.
5. Nginx meneruskan `/api/*` ke API service setelah menghapus prefix `/api/`.
6. API memproses request, mengakses database via Prisma, dan mengembalikan response.
7. Frontend merender data dan menampilkannya ke user.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 5.7, TanStack Router 1.132, TanStack Query 5.66, Tailwind CSS 4.0, Vite 7.1 |
| **Backend** | NestJS 11, Prisma 7.8, Zod 4.x, JWT (Passport), bcrypt, Helmet, Winston |
| **Database** | PostgreSQL 16 |
| **Reverse Proxy** | Nginx 1.27 |
| **Runtime** | Node.js 22 Alpine |
| **Package Manager** | pnpm 10.24 |
| **Container** | Docker, Docker Compose |

---

## Repository Structure

```txt
Priceyless/
├── api/                    # Backend NestJS
│   ├── prisma/             # Database schema, migrations, seed
│   ├── src/                # Source code (modules, controllers, services)
│   ├── test/               # E2E tests
│   ├── Dockerfile          # Multi-stage Docker build
│   └── package.json
├── web/                    # Frontend React
│   ├── src/                # Source code (routes, features, components)
│   ├── Dockerfile          # Multi-stage Docker build
│   └── package.json
├── nginx/                  # Nginx configuration
│   └── nginx.conf          # Reverse proxy config
├── docker-compose.yml      # Multi-service orchestration
├── .env.example            # Root environment variables template
└── README.md               # This file
```

**Dokumentasi lengkap:**
- [`api/README.md`](./api/README.md) — Backend API documentation
- [`web/README.md`](./web/README.md) — Frontend web documentation

---

## Core Features

| Feature | Keterangan |
|---|---|
| **User Registration** | Register user baru dengan name, email, password |
| **User Login** | Login dan dapatkan JWT access token |
| **JWT Authentication** | Stateless token-based authentication |
| **Current User** | Ambil data user aktif via `/v1/auth/me` |
| **Dashboard Overview** | Ringkasan statistik: produk, kategori, stok, nilai inventaris |
| **Category CRUD** | Create, read, update, delete kategori (ADMIN only untuk write) |
| **Product CRUD** | Create, read, update, delete produk (ADMIN only untuk write) |
| **Role-based Access** | USER (read-only) dan ADMIN (full access) |
| **Dockerized Deployment** | Satu command untuk menjalankan semua service |

---

## Service Architecture

### postgres

- **Image:** `postgres:16-alpine`
- **Port:** `${POSTGRES_PORT:-5432}` → `5432`
- **Volume:** `postgres_data` (persistent storage)
- **Healthcheck:** `pg_isready` setiap 10 detik
- **Network:** `app_network`

### api

- **Build:** Multi-stage dari `./api/Dockerfile`
- **Port:** `${API_PORT:-3001}` → `3000`
- **Startup command:** `pnpm prisma migrate deploy && node dist/main.js`
- **Environment:** `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`, `CORS_ORIGIN`
- **Depends on:** postgres (healthcheck)
- **Network:** `app_network`

### web

- **Build:** Multi-stage dari `./web/Dockerfile`
- **Port:** `${WEB_PORT:-3002}` → `3000`
- **Build arg:** `VITE_API_BASE_URL=/api`
- **Runtime command:** `pnpm run preview --port 3000 --host 0.0.0.0`
- **Depends on:** api
- **Network:** `app_network`

### nginx

- **Image:** `nginx:1.27-alpine`
- **Port:** `${NGINX_PORT:-80}` → `80`
- **Config:** Mount `./nginx/nginx.conf` sebagai read-only volume
- **Depends on:** api, web
- **Network:** `app_network`

---

## API and Web Relationship

```mermaid
flowchart LR
  subgraph "Nginx :80"
    direction TB
    Proxy["Reverse Proxy"]
  end

  subgraph "Internal Network"
    WebSvc["Web App :3000"]
    ApiSvc["API Service :3000"]
    DbSvc[(PostgreSQL :5432)]
  end

  User[Browser] --> Proxy
  Proxy -->|"/api/*"| ApiSvc
  Proxy -->|"/*"| WebSvc
  ApiSvc --> DbSvc
  WebSvc -.->|"fetch('/api/v1/*')"| ApiSvc
```

### Penjelasan

- **Frontend tidak langsung terhubung ke database.** Semua data akses melalui API.
- **Frontend memanggil API via path `/api/v1/*`.**
- **Nginx menghapus prefix `/api/`** sebelum meneruskan ke NestJS. Contoh: `/api/v1/auth/login` → `/v1/auth/login`.
- **API mengembalikan response standar** `{ status, message, data }` yang di-unwrap oleh frontend API client.

---

## Database Overview

### Models

| Model | Keterangan |
|---|---|
| `User` | Data user dengan role (`USER`/`ADMIN`) |
| `Session` | Session tracking (refresh token, user agent, IP) — belum terpakai penuh |
| `Verification` | Token verifikasi email/reset password — belum terintegrasi |
| `Category` | Kategori produk |
| `Product` | Produk dengan harga, stok, dan relasi ke kategori |

### ERD (Ringkas)

```mermaid
erDiagram
  User ||--o{ Session : has
  Category ||--o{ Product : contains

  User {
    string id PK
    string name
    string email UK
    string password
    Role role
  }

  Category {
    string id PK
    string name UK
    string description
  }

  Product {
    string id PK
    string name
    string description
    float price
    int stock
    string categoryId FK
  }
```

### Relasi

- **User → Session**: One-to-Many (cascade delete)
- **Category → Product**: One-to-Many (restrict delete — kategori tidak bisa dihapus jika masih ada produk)

---

## Docker Compose Architecture

### Network

Semua service berada di network bridge `app_network`. Service dapat saling mengakses menggunakan hostname Docker:

| Dari | Ke | Hostname |
|---|---|---|
| api | postgres | `postgres` |
| nginx | api | `api` |
| nginx | web | `web` |
| web | api | `api` (via Nginx) |

### Port Mapping

| Service | Host Port | Container Port | Akses |
|---|---|---|---|
| postgres | `${POSTGRES_PORT:-5432}` | 5432 | `localhost:5432` |
| api | `${API_PORT:-3001}` | 3000 | `localhost:3001` |
| web | `${WEB_PORT:-3002}` | 3000 | `localhost:3002` |
| nginx | `${NGINX_PORT:-80}` | 80 | `localhost` |

### Volumes

- `postgres_data` — persistent storage untuk data PostgreSQL

---

## Nginx Reverse Proxy

### Konfigurasi

```nginx
upstream web_app {
    server web:3000;
}

upstream api_app {
    server api:3000;
}

server {
    listen 80;

    location /api/ {
        proxy_pass http://api_app/;  # Strip /api/ prefix
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        proxy_pass http://web_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Fitur

- **Prefix stripping:** `/api/v1/auth/login` → `/v1/auth/login` di NestJS
- **gzip compression:** aktif untuk text, css, json, javascript, xml
- **WebSocket support:** header `Upgrade` dan `Connection` sudah dikonfigurasi
- **Body size limit:** 20MB (`client_max_body_size`)

---

## Development Workflow

### 1. Clone Repository

```bash
git clone <repository-url>
cd Priceyless
```

### 2. Install Dependencies

```bash
# Backend
cd api
pnpm install

# Frontend
cd ../web
pnpm install
```

### 3. Setup Environment

```bash
# Root (untuk Docker Compose)
cp .env.example .env

# API
cp api/.env.example api/.env
# Edit api/.env sesuai konfigurasi PostgreSQL lokal

# Web
cp web/.env.example web/.env
```

### 4. Jalankan Database

```bash
# Menggunakan Docker untuk PostgreSQL
docker run -d --name priceyless-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=priceyless \
  -p 5432:5432 \
  postgres:16-alpine
```

### 5. Generate Prisma Client & Migration

```bash
cd api
pnpm prisma generate
pnpm prisma migrate dev
```

### 6. Seed Data (Optional)

```bash
cd api
pnpm seed
```

### 7. Jalankan API

```bash
cd api
pnpm dev
```

### 8. Jalankan Web

```bash
cd web
VITE_API_BASE_URL=http://localhost:3000 pnpm dev
```

### 9. Test Flow

1. Buka `http://localhost:3000` (web)
2. Register user baru atau login dengan seed credential:
   - Admin: `admin@priceyless.test` / `password123`
   - User: `user@priceyless.test` / `password123`
3. Test CRUD kategori dan produk
4. Test role-based access (USER vs ADMIN)

### 10. Build Docker

```bash
docker compose up --build
```

---

## Environment Variables

### Root (.env)

Digunakan oleh Docker Compose:

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_USER` | `postgres` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `postgres` | PostgreSQL password |
| `POSTGRES_DB` | `priceyless` | PostgreSQL database name |
| `POSTGRES_PORT` | `5432` | Host port untuk PostgreSQL |
| `API_PORT` | `3001` | Host port untuk API |
| `WEB_PORT` | `3002` | Host port untuk Web |
| `NGINX_PORT` | `80` | Host port untuk Nginx |
| `JWT_SECRET` | `super-secret-key-123` | JWT signing secret |
| `JWT_EXPIRES_IN` | `1d` | JWT token expiration |
| `BCRYPT_SALT_ROUNDS` | `10` | Bcrypt hashing rounds |
| `CORS_ORIGIN` | `*` | Allowed CORS origin |
| `VITE_API_BASE_URL` | `/api` | Frontend API base path |

**Contoh `.env`:**

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=priceyless
POSTGRES_PORT=5432

# Ports
API_PORT=3001
WEB_PORT=3002
NGINX_PORT=80

# Secrets
JWT_SECRET=super-secret-key-change-me-in-prod

# API URL for Frontend
VITE_API_BASE_URL=/api
```

### API (.env)

Lihat [`api/README.md`](./api/README.md#environment-variables) untuk environment variables API.

### Web (.env)

Lihat [`web/README.md`](./web/README.md#environment-variables) untuk environment variables Web.

---

## Installation

### Backend (API)

```bash
cd api
pnpm install
```

### Frontend (Web)

```bash
cd web
pnpm install
```

---

## Running Locally Without Docker

### Terminal 1 — Backend API

```bash
cd api
pnpm prisma generate
pnpm prisma migrate dev
pnpm run start:dev
```

API berjalan di `http://localhost:3000`.

### Terminal 2 — Frontend Web

```bash
cd web
VITE_API_BASE_URL=http://localhost:3000 pnpm dev
```

Web berjalan di `http://localhost:3000` (port berbeda karena API juga 3000).

**Note:** Pastikan port tidak conflict. Jika API di port 3000, jalankan web di port lain:

```bash
pnpm dev --port 3001
```

---

## Running with Docker

### Jalankan Semua Service

```bash
docker compose up --build
```

### Rebuild Bersih

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

### Hapus Database Volume

```bash
docker compose down -v
```

> **Warning:** `down -v` akan menghapus semua data PostgreSQL secara permanen.

### Lihat Logs

```bash
docker compose logs api
docker compose logs web
docker compose logs nginx
docker compose logs postgres
```

### Akses Service

- **Aplikasi (via Nginx):** `http://localhost`
- **API langsung:** `http://localhost:3001`
- **Web langsung:** `http://localhost:3002`
- **PostgreSQL:** `localhost:5432`

---

## Build and Deployment

### API Dockerfile (Multi-Stage)

```
Stage 1 (base)    → Node.js 22 Alpine + pnpm 10.24.0
Stage 2 (deps)    → pnpm install --frozen-lockfile
Stage 3 (builder) → prisma generate + nest build
Stage 4 (runner)  → copy dist, generated, prisma, node_modules → jalankan node dist/main.js
```

### Web Dockerfile (Multi-Stage)

```
Stage 1 (base)    → Node.js 22 Alpine + pnpm 10.24.0
Stage 2 (deps)    → pnpm install --frozen-lockfile
Stage 3 (builder) → vite build (dengan build arg VITE_API_BASE_URL)
Stage 4 (runner)  → copy dist + node_modules → jalankan pnpm preview
```

### Production Migration

```bash
docker compose exec api pnpm prisma migrate deploy
```

---

## Testing Strategy

### Backend Testing

| Type | Command | Lokasi |
|---|---|---|
| Unit tests | `pnpm test` (di `api/`) | `src/**/*.spec.ts` |
| E2E tests | `pnpm test:e2e` (di `api/`) | `test/*.e2e-spec.ts` |
| Coverage | `pnpm test:cov` (di `api/`) | `coverage/` |

### Frontend Testing

| Type | Command | Lokasi |
|---|---|---|
| Unit tests | `pnpm test` (di `web/`) | `src/**/*.test.ts` (Vitest) |

### Docker Build Test

```bash
docker compose build --no-cache
```

Memverifikasi bahwa semua service dapat di-build tanpa error.

### Command Gabungan

```bash
# Backend tests
cd api
pnpm test
pnpm test:e2e

# Frontend build check
cd ../web
pnpm run build

# Docker build check
cd ..
docker compose build --no-cache
```

---

## Common Commands

| Command | Description |
|---|---|
| `docker compose up --build` | Build dan jalankan semua service |
| `docker compose down` | Stop semua service |
| `docker compose down -v` | Stop dan hapus volumes (hapus data PostgreSQL) |
| `docker compose logs api` | Lihat logs API |
| `docker compose logs web` | Lihat logs Web |
| `docker compose logs nginx` | Lihat logs Nginx |
| `docker compose logs postgres` | Lihat logs PostgreSQL |
| `docker compose exec api pnpm prisma migrate deploy` | Jalankan production migration |
| `docker compose exec api pnpm prisma studio` | Buka Prisma Studio |
| `cd api && pnpm dev` | Jalankan API dalam development mode |
| `cd web && pnpm dev` | Jalankan Web dalam development mode |

---

## Troubleshooting

### `DATABASE_URL` not found during Prisma generate

**Cause:** Prisma membutuhkan `DATABASE_URL` meskipun `generate` tidak connect ke database.

**Fix:** Pastikan file `.env` di `api/` berisi `DATABASE_URL`:

```bash
cd api
cp .env.example .env
# Edit .env dan isi DATABASE_URL
pnpm prisma generate
```

Atau set langsung:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/priceyless?schema=public pnpm prisma generate
```

### `.output not found` during web Docker build

**Cause:** Vite build menghasilkan output di `dist/`, bukan `.output/`.

**Fix:** Pastikan Dockerfile web menggunakan `COPY --from=builder /app/dist ./dist`.

### pnpm ignored builds

**Cause:** pnpm memblokir build script dari beberapa dependencies.

**Fix:** Sudah ditangani di `package.json` both API dan Web:

```json
"pnpm": {
  "onlyBuiltDependencies": [
    "@parcel/watcher",
    "esbuild",
    "sharp"
  ]
}
```

### pnpm minimum release age violation

**Cause:** pnpm memblokir package yang baru dirilis.

**Fix:** Pin versi pnpm di Dockerfile:

```dockerfile
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
```

### API cannot connect to PostgreSQL

**Fix:**
- Di Docker Compose, gunakan hostname `postgres` bukan `localhost`:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/priceyless?schema=public
```

- Pastikan PostgreSQL container berjalan dan healthcheck pass:

```bash
docker compose ps
docker compose logs postgres
```

### Nginx API route not working

**Checklist:**
1. Pastikan `nginx/nginx.conf` sudah benar.
2. Pastikan `location /api/` ada dan `proxy_pass http://api_app/;` (dengan trailing slash).
3. Pastikan API route menggunakan prefix `/v1/...`.
4. Cek logs Nginx: `docker compose logs nginx`.

### Port conflict

**Cause:** Port yang sudah digunakan oleh service lain.

**Fix:** Ubah port mapping di `.env`:

```env
POSTGRES_PORT=5433
API_PORT=3001
WEB_PORT=3002
NGINX_PORT=8080
```

---

## Roadmap

### Short Term

- [ ] OpenAPI/Swagger documentation untuk API
- [ ] Server-side pagination
- [ ] Advanced search dan filtering

### Medium Term

- [ ] Refresh token rotation
- [ ] Email verification flow
- [ ] Reset password flow
- [ ] Product image upload
- [ ] Edit profile (nama, email, password)

### Long Term

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Frontend E2E testing (Playwright)
- [ ] Audit logging
- [ ] Batch operations (bulk import/export)
- [ ] Rate limiting
- [ ] Role-specific dashboard views
- [ ] UI theming (dark mode)
- [ ] Export data (CSV/PDF)
- [ ] Production deployment guide

---

## Current Limitations

1. **Session/Refresh token belum terpakai penuh** — Model `Session` ada di database tetapi belum ada endpoint refresh token atau revoke.

2. **Verification belum terintegrasi** — Model `Verification` ada tetapi flow email verification dan reset password belum diimplementasikan.

3. **Tidak ada pagination** — Semua data di-load sekaligus. Dapat menjadi masalah dengan data besar.

4. **UsersController kosong** — User management hanya melalui AuthModule.

5. **Belum ada upload gambar** — Produk dan kategori hanya berupa data text.

6. **Form validation frontend masih sederhana** — Menggunakan HTML `required` tanpa library validasi.

7. **Belum ada API documentation** — Belum ada Swagger/OpenAPI docs.

---

## Contribution Guide

### Branch Strategy

1. Buat branch baru dari `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Buat perubahan dan pastikan:
   - Unit tests pass: `cd api && pnpm test`
   - E2E tests pass: `cd api && pnpm test:e2e`
   - Build berhasil: `cd web && pnpm build`
   - Docker build berhasil: `docker compose build --no-cache`

3. Commit dengan pesan yang jelas:
   ```bash
   git commit -m "feat: add pagination to products endpoint"
   ```

4. Push dan buat Pull Request.

### Guidelines

- **Jangan commit `.env`** — pastikan `.env` ada di `.gitignore`.
- **Jangan edit `routeTree.gen.ts` manual** — file ini di-generate otomatis oleh TanStack Router.
- **Jangan edit migration lama** yang sudah di-apply — buat migration baru untuk perubahan schema.
- **Pastikan Docker build berhasil** sebelum merge.
- **Update README** jika workflow atau struktur berubah.
- **Ikuti code style** yang ada (single quotes, trailing comma, semicolons).

### Code Style

- **API:** ESLint + Prettier (singleQuote, trailingComma: es5, semi: true)
- **Web:** Mengikuti TypeScript dan React conventions yang ada di codebase
- **Commit:** Conventional Commits format (`feat:`, `fix:`, `docs:`, `chore:`, dll)
