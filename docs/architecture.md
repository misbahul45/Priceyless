# Struktur Folder

## Root

```txt
.
├── api/
└── web/
```

## Backend: api/

```txt
api/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── database/
│   ├── v1/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   └── categories/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
└── package.json
```

Jelaskan fungsi setiap folder:

* `prisma/`: menyimpan schema database dan migration.
* `src/database/`: konfigurasi Prisma client untuk NestJS.
* `src/v1/`: versioned API module.
* `auth/`: module autentikasi, saat ini masih skeleton.
* `users/`: module user, saat ini masih skeleton.
* `products/`: module produk, saat ini masih skeleton.
* `categories/`: module kategori, saat ini masih skeleton.

## Frontend: web/

```txt
web/
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── integrations/
│   ├── lib/
│   ├── routes/
│   │   ├── demo/
│   │   ├── __root.tsx
│   │   └── index.tsx
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   └── styles.css
├── vite.config.ts
├── tsconfig.json
└── package.json
```

Jelaskan:

* `routes/`: file-based routing TanStack Router.
* `routes/demo/`: demo bawaan TanStack Start, kandidat untuk dihapus setelah fitur asli dibuat.
* `components/Header.tsx`: header/sidebar navigation bawaan template.
* `integrations/tanstack-query/`: setup React Query provider dan devtools.
* `lib/utils.ts`: helper utility untuk styling/classname.

# Tech Stack

| Area | Teknologi | Fungsi | Status |
|---|---|---|---|
| Backend | NestJS | Framework API server | Sudah setup |
| Backend | TypeScript | Bahasa utama backend | Sudah setup |
| Database | PostgreSQL | Database utama | Sudah dikonfigurasi di Prisma |
| ORM | Prisma | Database ORM dan migration | Sudah setup |
| Frontend | TanStack React Start | Fullstack React framework | Sudah setup |
| Routing | TanStack Router | File-based routing frontend | Sudah setup |
| Data Fetching | TanStack Query | Client-side async state | Sudah setup |
| Styling | Tailwind CSS | Styling utility-first | Sudah setup |
| Build Tool | Vite | Bundler frontend | Sudah setup |
| Deployment | Netlify | Target deployment frontend | Sudah ada plugin |
| Testing | Jest / Supertest | Unit dan e2e test backend | Starter tersedia |

Catatan:
* Backend dan frontend belum terlihat memiliki integrasi API nyata.
* Belum ada dokumentasi env lengkap.
* Belum ada Docker Compose pada repo ini jika memang tidak ditemukan.
* Belum ada business feature final pada frontend.
