# Priceyless API

Backend RESTful API untuk aplikasi Priceyless — sebuah sistem manajemen produk dan kategori dengan autentikasi JWT serta role-based access control.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Backend Architecture](#backend-architecture)
- [Folder Structure](#folder-structure)
- [Request Lifecycle](#request-lifecycle)
- [Authentication Flow](#authentication-flow)
- [Authorization and Roles](#authorization-and-roles)
- [API Modules](#api-modules)
- [Database Design](#database-design)
- [Prisma Workflow](#prisma-workflow)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Running with Docker](#running-with-docker)
- [Build Process](#build-process)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Response Format](#response-format)
- [Logging](#logging)
- [Security](#security)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)
- [Current Limitations](#current-limitations)
- [Future Improvements](#future-improvements)

---

## Overview

Priceyless API adalah backend utama yang menyediakan endpoint RESTful untuk:

- **Autentikasi user** — register, login, dan mengambil data user aktif (`/me`).
- **Manajemen kategori** — CRUD kategori produk.
- **Manajemen produk** — CRUD produk dengan relasi ke kategori.
- **Role-based access control** — dua role: `USER` dan `ADMIN`.

API ini dibangun dengan pola modular NestJS, menggunakan Prisma ORM untuk akses database PostgreSQL, Zod untuk validasi request, dan JWT untuk autentikasi stateless.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22 | Runtime |
| NestJS | 11 | Backend framework |
| TypeScript | 5.7 | Type safety |
| Prisma | 7.8 | ORM & database access |
| PostgreSQL | 16 | Database |
| Zod | 4.x | Request validation |
| JWT (`@nestjs/jwt`) | 11 | Token-based authentication |
| Passport + Passport-JWT | 0.7 / 4.0 | Authentication strategy |
| bcrypt | 6.0 | Password hashing |
| Helmet | 8.2 | Security headers |
| Winston | 3.19 | Logging |
| Winston Daily Rotate File | 5.0 | Log rotation |
| Jest | 30 | Unit & E2E testing |
| Supertest | 7.0 | HTTP assertion for E2E |
| pnpm | 10.24 | Package manager |
| Docker | - | Containerization |

---

## Backend Architecture

### Pola Modular

API mengikuti arsitektur modular NestJS:

```
AppModule
├── DatabaseModule (global) — Prisma client & PostgreSQL connection pool
└── V1Module — semua endpoint API versi 1
    ├── AuthModule — autentikasi & otorisasi
    ├── UsersModule (global) — user data management
    ├── CategoriesModule — category CRUD
    └── ProductsModule — product CRUD
```

### Layer

| Layer | Fungsi |
|---|---|
| **Controller** | Menerima HTTP request, memanggil service, mengembalikan response |
| **Service** | Business logic, validasi data, interaksi database via Prisma |
| **Guard** | `JwtAuthGuard` untuk validasi token, `RolesGuard` untuk otorisasi role |
| **Pipe** | `ZodValidationPipe` untuk validasi request body/params/query |
| **Filter** | `HttpExceptionFilter` & `PrismaExceptionFilter` untuk error handling |
| **Interceptor** | `ResponseInterceptor` untuk membungkus response, `RequestLoggingInterceptor` untuk logging |
| **Decorator** | `@GetUser()` untuk extract user dari request, `@Roles()` untuk set role requirement |
| **Strategy** | `JwtStrategy` untuk validasi JWT token via Passport |

### Bootstrap

`main.ts` melakukan:

1. Membuat NestJS app dengan Winston logger.
2. Memanggil `setupApp()` yang mengkonfigurasi Helmet, CORS, global filters, global interceptors, dan shutdown hooks.
3. Mendengarkan pada port dari environment variable `PORT`.

---

## Folder Structure

```txt
api/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── seed.ts                # Seed data (users, categories, products)
│   └── migrations/
│       └── 20260209043753_setup_db/
│           └── migration.sql  # SQL migration
├── src/
│   ├── common/
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts      # Global HTTP exception handler
│   │   │   └── prisma-exception.filter.ts    # Prisma error code handler
│   │   ├── interceptors/
│   │   │   ├── request-logging.interceptor.ts # Request/response logging
│   │   │   └── response.interceptor.ts       # Standard response wrapper
│   │   ├── logger/
│   │   │   └── winston.config.ts             # Winston transport config
│   │   ├── pipes/
│   │   │   └── zod-validation.pipe.ts        # Zod schema validation pipe
│   │   ├── schemas/
│   │   │   └── params.schema.ts              # Shared UUID param schema
│   │   └── utils/
│   │       └── sanitize-user.ts              # Remove password from user object
│   ├── config/
│   │   ├── env.ts                             # Env validation & export
│   │   └── env.schema.ts                      # Zod schema for env vars
│   ├── database/
│   │   ├── database.module.ts                 # Global Prisma module
│   │   └── database.service.ts                # PrismaClient with connection pool
│   ├── v1/
│   │   ├── v1.module.ts                       # Aggregates all v1 feature modules
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.spec.ts
│   │   │   ├── auth.service.spec.ts
│   │   │   ├── decorators/
│   │   │   │   ├── get-user.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── schemas/
│   │   │   │   └── auth.schema.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.controller.spec.ts
│   │   │   └── users.service.spec.ts
│   │   ├── categories/
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   ├── categories.controller.spec.ts
│   │   │   ├── categories.service.spec.ts
│   │   │   └── schemas/
│   │   │       └── category.schema.ts
│   │   └── products/
│   │       ├── products.module.ts
│   │       ├── products.controller.ts
│   │       ├── products.service.ts
│   │       ├── products.controller.spec.ts
│   │       ├── products.service.spec.ts
│   │       └── schemas/
│   │           └── product.schema.ts
│   ├── app.module.ts
│   ├── app.setup.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── jest-e2e.json
│   ├── app.e2e-spec.ts
│   ├── priceyless.e2e-spec.ts
│   └── helpers/
│       └── create-test-app.ts
├── Dockerfile
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── nest-cli.json
```

### Penjelasan Folder Penting

| Folder | Fungsi |
|---|---|
| `prisma/` | Schema database, migration SQL, dan seed script |
| `src/common/` | Shared code: filters, interceptors, pipes, schemas, utils |
| `src/config/` | Environment variable validation dan export |
| `src/database/` | Global Prisma module dengan connection pool |
| `src/v1/` | Semua API endpoint versi 1, terorganisir per feature module |
| `test/` | E2E test specs dan test helpers |
| `generated/prisma/` | Auto-generated Prisma client (jangan edit manual) |

---

## Request Lifecycle

Alur setiap request HTTP yang masuk ke API:

```mermaid
flowchart LR
  Client[Client/Web] --> Nginx[Nginx /api/]
  Nginx --> Controller[NestJS Controller]
  Controller --> Guard[JWT/Role Guard]
  Guard --> Validation[Zod Validation Pipe]
  Validation --> Service[Service Layer]
  Service --> Prisma[Prisma ORM]
  Prisma --> DB[(PostgreSQL)]
  Service --> Response[Response Interceptor]
  Response --> Client
```

1. **Client** mengirim request ke Nginx pada path `/api/...`.
2. **Nginx** meneruskan ke NestJS API setelah menghapus prefix `/api/`.
3. **Controller** menerima request dan mengekstrak parameter.
4. **Guard** memvalidasi JWT token jika endpoint protected (`JwtAuthGuard`). `RolesGuard` memeriksa role jika ada `@Roles()` decorator.
5. **Pipe** `ZodValidationPipe` memvalidasi request body/params/query terhadap Zod schema.
6. **Service** menjalankan business logic dan berinteraksi dengan database via Prisma.
7. **Prisma** mengakses PostgreSQL dan mengembalikan data.
8. **Interceptor** `ResponseInterceptor` membungkus response ke format standar `{ status, message, data }`.
9. **Exception Filter** menangani error jika terjadi (HttpException atau PrismaClientKnownRequestError).

---

## Authentication Flow

### Register

1. Client mengirim `POST /v1/auth/register` dengan `{ name, email, password }`.
2. Service memeriksa apakah email sudah terdaftar.
3. Password di-hash dengan bcrypt.
4. User baru dibuat di database.
5. Response mengembalikan user tanpa field `password`.

### Login

1. Client mengirim `POST /v1/auth/login` dengan `{ email, password }`.
2. Service mencari user berdasarkan email.
3. Password dibandingkan dengan bcrypt compare.
4. Jika valid, JWT token di-generate dengan payload `{ email, sub: userId, role }`.
5. Response mengembalikan `{ accessToken, user }`.

### Mengambil Data User

1. Client mengirim `GET /v1/auth/me` dengan header `Authorization: Bearer <token>`.
2. `JwtStrategy` mengekstrak payload dari token.
3. Service mengambil data user berdasarkan `userId` dari token.
4. Response mengembalikan user tanpa field `password`.

```mermaid
sequenceDiagram
  participant User
  participant Web
  participant API
  participant DB

  User->>Web: Submit login form
  Web->>API: POST /v1/auth/login
  API->>DB: Find user by email
  API->>API: Compare password (bcrypt)
  API-->>Web: Access token + user data
  Web->>Web: Store token & user in localStorage
  Web->>API: GET /v1/auth/me (Bearer token)
  API->>API: Validate JWT via JwtStrategy
  API->>DB: Find user by ID
  API-->>Web: Current user data
```

---

## Authorization and Roles

Tersedia dua role:

| Role | Keterangan |
|---|---|
| `USER` | Default role. Dapat mengakses data publik (list/detail kategori & produk). |
| `ADMIN` | Dapat melakukan CRUD pada kategori dan produk. |

### Endpoint Access Matrix

| Endpoint | Public | USER | ADMIN |
|---|:---:|:---:|:---:|
| `POST /v1/auth/register` | Y | - | - |
| `POST /v1/auth/login` | Y | - | - |
| `GET /v1/auth/me` | - | Y | Y |
| `GET /v1/categories` | Y | Y | Y |
| `GET /v1/categories/:id` | Y | Y | Y |
| `POST /v1/categories` | - | - | Y |
| `PATCH /v1/categories/:id` | - | - | Y |
| `DELETE /v1/categories/:id` | - | - | Y |
| `GET /v1/products` | Y | Y | Y |
| `GET /v1/products/:id` | Y | Y | Y |
| `POST /v1/products` | - | - | Y |
| `PATCH /v1/products/:id` | - | - | Y |
| `DELETE /v1/products/:id` | - | - | Y |

---

## API Modules

### Auth Module

**Prefix:** `/v1/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/v1/auth/register` | Public | Register user baru |
| `POST` | `/v1/auth/login` | Public | Login dan dapatkan access token |
| `GET` | `/v1/auth/me` | Bearer token | Ambil data user aktif |

**Request Body — Register:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Request Body — Login:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response — Login:**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Categories Module

**Prefix:** `/v1/categories`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/v1/categories` | Public | - | List semua kategori |
| `GET` | `/v1/categories/:id` | Public | - | Detail kategori (termasuk produk) |
| `POST` | `/v1/categories` | Bearer | ADMIN | Buat kategori baru |
| `PATCH` | `/v1/categories/:id` | Bearer | ADMIN | Update kategori |
| `DELETE` | `/v1/categories/:id` | Bearer | ADMIN | Hapus kategori |

**Request Body — Create:**

```json
{
  "name": "Electronics",
  "description": "Phones, laptops, and smart devices."
}
```

**Validation Rules:**
- `name`: string, 2-100 karakter, unique
- `description`: string opsional, max 500 karakter

**Delete Constraints:**
- Kategori tidak dapat dihapus jika masih memiliki produk yang terkait (akan mengembalikan error `400 BAD_REQUEST`).

---

### Products Module

**Prefix:** `/v1/products`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/v1/products` | Public | - | List semua produk |
| `GET` | `/v1/products/:id` | Public | - | Detail produk |
| `POST` | `/v1/products` | Bearer | ADMIN | Buat produk baru |
| `PATCH` | `/v1/products/:id` | Bearer | ADMIN | Update produk |
| `DELETE` | `/v1/products/:id` | Bearer | ADMIN | Hapus produk |

**Request Body — Create:**

```json
{
  "name": "Smartphone Pro X",
  "description": "Flagship smartphone with OLED display.",
  "price": 999.99,
  "stock": 14,
  "categoryId": "0119cd0d-2187-494d-a77d-f8ec11425583"
}
```

**Validation Rules:**
- `name`: string, 2-150 karakter
- `description`: string opsional, max 1000 karakter
- `price`: number, minimum 0
- `stock`: integer, minimum 0
- `categoryId`: UUID, harus existing di database

---

## Database Design

### Models

| Model | Keterangan |
|---|---|
| `User` | Data user dengan role (`USER`/`ADMIN`) |
| `Session` | Session tracking (refresh token, user agent, IP) |
| `Verification` | Token verifikasi email dan reset password |
| `Category` | Kategori produk |
| `Product` | Produk dengan harga, stok, dan relasi ke kategori |

### ERD

```mermaid
erDiagram
  User ||--o{ Session : has
  User ||--o{ Verification : has
  Category ||--o{ Product : contains

  User {
    string id PK
    string name
    string email UK
    string password
    Role role
    datetime createdAt
    datetime updatedAt
  }

  Session {
    string id PK
    string userId FK
    string refreshToken UK
    string userAgent
    string ipAddress
    datetime expiresAt
    datetime createdAt
  }

  Verification {
    string id PK
    string email
    string token UK
    VerificationType type
    datetime expiresAt
    datetime createdAt
  }

  Category {
    string id PK
    string name UK
    string description
    datetime createdAt
    datetime updatedAt
  }

  Product {
    string id PK
    string name
    string description
    float price
    int stock
    string categoryId FK
    datetime createdAt
    datetime updatedAt
  }
```

### Enums

```typescript
enum Role {
  USER
  ADMIN
}

enum VerificationType {
  EMAIL_VERIFICATION
  RESET_PASSWORD
}
```

### Relasi

- **User → Session**: One-to-Many (cascade delete)
- **User → Verification**: One-to-Many
- **Category → Product**: One-to-Many (restrict delete — kategori tidak bisa dihapus jika masih ada produk)

---

## Prisma Workflow

### Generate Client

```bash
pnpm prisma generate
```

Membuat Prisma client di folder `generated/prisma/`. Harus dijalankan setiap kali `schema.prisma` diubah.

### Development Migration

```bash
pnpm prisma migrate dev
```

Membuat migration baru berdasarkan perubahan schema. Hanya untuk development — akan membuat migration file baru di `prisma/migrations/`.

### Production Migration

```bash
pnpm prisma migrate deploy
```

Menjalankan semua pending migration tanpa membuat migration baru. Digunakan di production dan Docker.

### Prisma Studio

```bash
pnpm prisma studio
```

Membuka browser-based GUI untuk melihat dan mengedit data di database.

### Seed

```bash
pnpm seed
```

Menjalankan `prisma/seed.ts` untuk insert data awal: 2 users (admin + user), 5 kategori, 20 produk, 2 verifikasi, 2 sessions.

**Credential seed:**
- Admin: `admin@priceyless.test` / `password123`
- User: `user@priceyless.test` / `password123`

---

## Environment Variables

| Variable | Required | Default | Example | Description |
|---|---|---|---|---|
| `NODE_ENV` | No | `development` | `production` | Runtime environment mode |
| `PORT` | No | `3000` | `3000` | Port API listening |
| `DATABASE_URL` | Yes | - | `postgresql://postgres:postgres@localhost:5432/priceyless?schema=public` | PostgreSQL connection string |
| `JWT_SECRET` | Yes | - | `super-secret-key-change-me` | Secret key untuk signing JWT (min 16 karakter) |
| `JWT_EXPIRES_IN` | No | `1d` | `7d` | JWT token expiration |
| `BCRYPT_SALT_ROUNDS` | No | `10` | `12` | Bcrypt hashing rounds (8-15) |
| `CORS_ORIGIN` | No | `*` | `http://localhost:3000` | Allowed CORS origin |

**Catatan:** Environment variables divalidasi saat startup menggunakan Zod schema (`src/config/env.schema.ts`). Jika ada variable yang tidak valid, aplikasi akan exit dengan error.

---

## Local Development

### Prasyarat

- Node.js 22+
- pnpm 10.24+
- PostgreSQL 16 (local atau via Docker)

### Langkah

```bash
# 1. Install dependencies
cd api
pnpm install

# 2. Setup environment
cp .env.example .env
# Edit .env sesuai konfigurasi PostgreSQL lokal

# 3. Generate Prisma client
pnpm prisma generate

# 4. Jalankan migration
pnpm prisma migrate dev

# 5. (Optional) Seed data
pnpm seed

# 6. Jalankan development server
pnpm dev
```

API akan berjalan di `http://localhost:3000`.

---

## Running with Docker

Dari root project:

```bash
docker compose up --build
```

Ini akan menjalankan:
- PostgreSQL di port `${POSTGRES_PORT:-5432}`
- API di port `${API_PORT:-3001}` (host) → `3000` (container)
- Web di port `${WEB_PORT:-3002}` (host) → `3000` (container)
- Nginx di port `${NGINX_PORT:-80}`

API container akan menjalankan `prisma migrate deploy` sebelum memulai server.

---

## Build Process

### Development

```bash
pnpm dev
```

Menggunakan `nest start --watch` dengan hot-reload.

### Production

```bash
pnpm build
pnpm start:prod
```

`pnpm build` menjalankan `nest build` yang compile TypeScript ke JavaScript di folder `dist/`.

### Dockerfile Multi-Stage Build

```dockerfile
# Stage 1: base — Node.js 22 Alpine + pnpm
# Stage 2: deps — install dependencies
# Stage 3: builder — prisma generate + nest build
# Stage 4: runner — copy dist, generated, prisma, node_modules
```

**Catatan Penting:**
- Build stage membutuhkan `DATABASE_URL` sebagai build argument untuk `prisma generate`. Ini hanya dummy URL — Prisma generate tidak melakukan koneksi database.
- Runner stage hanya copy file yang diperlukan: `dist/`, `generated/`, `prisma/`, `node_modules/`, `package.json`, `pnpm-lock.yaml`.

---

## Testing

### Unit Tests

```bash
pnpm test
```

Menjalankan semua spec file di `src/` yang cocok dengan pola `*.spec.ts`.

**Unit test files:**
- `src/app.controller.spec.ts`
- `src/v1/auth/auth.controller.spec.ts`
- `src/v1/auth/auth.service.spec.ts`
- `src/v1/users/users.controller.spec.ts`
- `src/v1/users/users.service.spec.ts`
- `src/v1/categories/categories.controller.spec.ts`
- `src/v1/categories/categories.service.spec.ts`
- `src/v1/products/products.controller.spec.ts`
- `src/v1/products/products.service.spec.ts`

### E2E Tests

```bash
pnpm test:e2e
```

Menjalankan semua spec file di `test/` yang cocok dengan pola `*.e2e-spec.ts`.

**E2E test files:**
- `test/app.e2e-spec.ts` — test endpoint root (`GET /`)
- `test/priceyless.e2e-spec.ts` — test flow lengkap: register, login, auth check, category CRUD, product CRUD, role-based access

**E2E test coverage:**
- Register success & duplicate email (409)
- Register with invalid email (400)
- Login success & wrong password (401)
- Get current user without token (401) and with token (200)
- Category create (ADMIN only), list, detail
- Category create without token (401) and as USER (403)
- Product create (ADMIN only), list, detail, update, delete
- Product create with invalid category (404)
- Product create without token (401) and as USER (403)

### Coverage

```bash
pnpm test:cov
```

### Debug E2E

```bash
pnpm test:e2e:debug
```

**Catatan:** Gunakan command di atas, jangan menjalankan `pnpm test:e2e -- --detectOpenHandles` karena dapat menyebabkan error.

---

## Error Handling

### HttpExceptionFilter

Menangani semua `HttpException` dan mengubahnya ke format standar:

```json
{
  "status": "error",
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": []
  }
}
```

**Error codes:**
- `BAD_REQUEST` (400) — validation error
- `UNAUTHORIZED` (401) — tidak ada/invalid token
- `FORBIDDEN` (403) — tidak punya akses
- `NOT_FOUND` (404) — resource tidak ditemukan
- `CONFLICT` (409) — data sudah ada (unique constraint)
- `INTERNAL_SERVER_ERROR` (500) — server error

### PrismaExceptionFilter

Menangani error spesifik Prisma:

| Prisma Code | HTTP Status | Message |
|---|---|---|
| `P2002` | 409 CONFLICT | Unique constraint violation |
| `P2025` | 404 NOT_FOUND | Record not found |
| `P2003` | 400 BAD_REQUEST | Foreign key constraint failed |

**Catatan:** Detail error Prisma hanya ditampilkan di mode non-production (`NODE_ENV !== 'production'`).

### ZodValidationPipe

Melempar `400 BAD_REQUEST` dengan detail path, message, dan code dari setiap Zod issue:

```json
{
  "status": "error",
  "message": "Validation failed",
  "error": {
    "code": "BAD_REQUEST",
    "details": [
      {
        "path": "email",
        "message": "Invalid email",
        "code": "invalid_string"
      }
    ]
  }
}
```

---

## Response Format

### Success

Semua response sukses dibungkus oleh `ResponseInterceptor`:

```json
{
  "status": "success",
  "message": "Request successful",
  "data": {}
}
```

Response dari controller yang sudah memiliki `{ message, data }` akan dipertahankan formatnya.

### Error

```json
{
  "status": "error",
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": []
  }
}
```

---

## Logging

### Request Logging

`RequestLoggingInterceptor` mencatat setiap request:

```
[Nest] - 2026-01-01T00:00:00.000Z info [HTTP] GET /v1/products 200 1234B - 45ms - IP: 127.0.0.1 - User: uuid - UA: Mozilla/5.0...
```

### Winston Configuration

Dua transport aktif:

1. **Console** — format colorized dengan timestamp, level, context, message, dan ms.
2. **Daily Rotate File** — JSON format, disimpan di `logs/application-YYYY-MM-DD.log`, max 20MB per file, retensi 14 hari.

---

## Security

| Fitur | Implementasi |
|---|---|
| **Security Headers** | Helmet (`app.use(helmet())`) |
| **Password Hashing** | bcrypt dengan salt rounds (default 10) |
| **JWT Authentication** | Stateless token via `@nestjs/jwt` + Passport |
| **Role-based Access** | `RolesGuard` dengan `@Roles()` decorator |
| **Input Validation** | Zod schema via `ZodValidationPipe` |
| **CORS** | Configurable via `CORS_ORIGIN` env variable |
| **Env Validation** | Zod schema validasi saat startup |
| **User Data Sanitization** | Password field dihapus dari response |

---

## Common Commands

| Command | Description |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Jalankan development server dengan watch mode |
| `pnpm build` | Build production |
| `pnpm start:prod` | Jalankan production build |
| `pnpm test` | Jalankan unit tests |
| `pnpm test:e2e` | Jalankan E2E tests |
| `pnpm test:cov` | Jalankan tests dengan coverage report |
| `pnpm test:watch` | Jalankan tests dalam watch mode |
| `pnpm test:e2e:debug` | Jalankan E2E tests dengan debug mode |
| `pnpm prisma generate` | Generate Prisma client |
| `pnpm prisma migrate dev` | Buat migration baru (development) |
| `pnpm prisma migrate deploy` | Jalankan pending migration (production) |
| `pnpm prisma studio` | Buka Prisma Studio di browser |
| `pnpm seed` | Jalankan seed script |
| `pnpm lint` | Jalankan ESLint |
| `pnpm format` | Format code dengan Prettier |

---

## Troubleshooting

### `DATABASE_URL` not found during `pnpm prisma generate`

**Cause:** Prisma config membutuhkan `DATABASE_URL` meskipun `generate` tidak melakukan koneksi.

**Fix:** Pastikan file `.env` ada dan berisi `DATABASE_URL`:

```bash
cp .env.example .env
# Edit .env dan isi DATABASE_URL
```

Atau set environment variable langsung:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/priceyless?schema=public pnpm prisma generate
```

### Jest did not exit

**Cause:** Ada koneksi database atau timer yang belum ditutup.

**Fix:**
- Pastikan `afterAll` memanggil `await app.close()`.
- `DatabaseService` sudah menangani `onModuleDestroy` untuk disconnect Prisma dan close pool.
- Tidak ada unclosed timers/listeners di test code.

### API cannot connect to PostgreSQL

**Cause:** PostgreSQL belum berjalan atau `DATABASE_URL` salah.

**Fix:**
- Pastikan PostgreSQL berjalan: `pg_isready -h localhost -p 5432`
- Pastikan `DATABASE_URL` benar dan menggunakan hostname/port yang tepat.
- Di Docker Compose, gunakan hostname `postgres` bukan `localhost`.

### JWT error: secret must have minimum 16 characters

**Cause:** `JWT_SECRET` kosong atau kurang dari 16 karakter.

**Fix:** Set `JWT_SECRET` dengan minimal 16 karakter di `.env`:

```env
JWT_SECRET=super-secret-key-change-me
```

### pnpm minimum release age violation

**Cause:** pnpm memblokir instalasi package yang baru dirilis.

**Fix:** Tambahkan di `package.json`:

```json
"pnpm": {
  "onlyBuiltDependencies": [
    "@parcel/watcher",
    "esbuild",
    "sharp"
  ]
}
```

Atau gunakan flag:

```bash
pnpm install --config.ignore-minimum-release-age=true
```

### Prisma migration error

**Cause:** Migration sudah diterapkan tapi file tidak cocok.

**Fix:**

```bash
# Reset database (HATI-HATI: menghapus semua data)
pnpm prisma migrate reset

# Atau buat migration baru
pnpm prisma migrate dev --name your_migration_name
```

---

## Current Limitations

1. **UsersController kosong** — `UsersController` saat ini hanya skeleton tanpa endpoint. User management hanya dilakukan melalui AuthModule.

2. **Session/Refresh token belum terpakai penuh** — Model `Session` ada di database dan di-seed, tetapi belum ada endpoint untuk refresh token, revoke session, atau logout. JWT access token langsung dikembalikan tanpa refresh token flow.

3. **Verification model belum terintegrasi** — Model `Verification` ada di database (untuk `EMAIL_VERIFICATION` dan `RESET_PASSWORD`), tetapi belum ada flow email verification atau reset password yang terimplementasi di controller/service.

4. **Seed script menggunakan pg pool langsung** — Seed menggunakan `PrismaPg` adapter dengan `Pool` dari `pg`, bukan `DatabaseService`. Ini karena seed dijalankan secara standalone.

5. **Tidak ada pagination** — Endpoint `GET /v1/categories` dan `GET /v1/products` mengembalikan semua data tanpa pagination, filtering, atau sorting di server-side.

---

## Future Improvements

- [ ] Refresh token rotation dan token revocation
- [ ] Email verification flow
- [ ] Reset password flow
- [ ] Server-side pagination, filtering, dan sorting
- [ ] Search functionality untuk products dan categories
- [ ] Product image upload
- [ ] Audit logging untuk perubahan data
- [ ] OpenAPI/Swagger documentation
- [ ] Rate limiting
- [ ] CI/CD pipeline dengan automated testing
- [ ] Users CRUD endpoints (admin management)
- [ ] Batch operations (bulk create/update/delete)
