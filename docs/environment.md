# Environment Variables

Daftar environment variables yang digunakan (atau direkomendasikan untuk digunakan) di dalam project.

| Variable | Area | Required | Fungsi | Status saat ini |
|---|---|---|---|---|
| `DATABASE_URL` | Backend | Yes | Koneksi Prisma ke PostgreSQL | Perlu dikonfigurasi secara manual. |
| `PORT` | Backend | No | Port NestJS, default 3000 | Mengacu pada `main.ts` `process.env.PORT ?? 3000`. |
| `VITE_API_BASE_URL` | Frontend | Recommended | Base URL backend API | *Rekomendasi*, belum terlihat penggunaannya di kode frontend saat ini. |