## Prompt 1 — Clean TanStack Starter

```md
Baca dokumentasi di `/docs`, lalu bersihkan frontend TanStack Starter secara bertahap.
Jangan ubah backend.
Hapus atau nonaktifkan route demo hanya setelah membuat pengganti route utama.
Ganti branding TanStack menjadi branding aplikasi.
Buat layout dasar aplikasi dengan Header/Sidebar baru.
Pastikan aplikasi tetap bisa jalan.
```

## Prompt 2 — Implement Backend Auth

```md
Baca dokumentasi backend, database, dan API reference.
Implementasikan Auth module di NestJS:
- Register
- Login
- Refresh token
- Logout
- Get current user
- Password hashing
- JWT access token
- Refresh token session
- DTO validation
- Error handling

Jangan mengubah schema database kecuali benar-benar perlu.
Pastikan semua endpoint memakai response format konsisten.
```

## Prompt 3 — Implement CRUD Products Categories

```md
Implementasikan CRUD untuk Products dan Categories.
Gunakan Prisma schema yang sudah ada.
Tambahkan DTO validation.
Tambahkan endpoint:
- GET /categories
- POST /categories
- GET /categories/:id
- PATCH /categories/:id
- DELETE /categories/:id
- GET /products
- POST /products
- GET /products/:id
- PATCH /products/:id
- DELETE /products/:id

Pastikan relasi product-category valid.
```

## Prompt 4 — Connect Frontend to Backend

```md
Buat API client di frontend.
Hubungkan frontend TanStack React Start ke backend NestJS.
Buat halaman:
- Login
- Register
- Dashboard
- Products
- Categories
- Profile

Gunakan TanStack Query untuk fetching/mutation.
Tambahkan loading, error, dan empty state.
```