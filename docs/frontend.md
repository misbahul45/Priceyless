# Frontend Documentation

## Frontend Current Architecture

- Frontend menggunakan TanStack React Start.
- Routing memakai TanStack Router.
- Root route berada di `web/src/routes/__root.tsx`.
- Home page berada di `web/src/routes/index.tsx`.
- Header berada di `web/src/components/Header.tsx`.
- QueryClient provider berada di `web/src/integrations/tanstack-query/root-provider.tsx`.
- Masih ada banyak demo routes di `web/src/routes/demo`.
- Branding masih TanStack Start, belum branding aplikasi final.

### Tabel Route Aktual

| Route                      | File                                         | Status        | Catatan                                     |
| -------------------------- | -------------------------------------------- | ------------- | ------------------------------------------- |
| `/`                        | `web/src/routes/index.tsx`                   | Demo/template | Perlu diganti landing/dashboard             |
| `/demo/start/server-funcs` | `web/src/routes/demo/start.server-funcs.tsx` | Demo          | Bisa dihapus                                |
| `/demo/start/api-request`  | `web/src/routes/demo/start.api-request.tsx`  | Demo          | Bisa dihapus                                |
| `/demo/start/ssr`          | `web/src/routes/demo/start.ssr.index.tsx`    | Demo          | Bisa dihapus                                |
| `/demo/tanstack-query`     | `web/src/routes/demo/tanstack-query.tsx`     | Demo          | Bisa dihapus setelah query pattern dipahami |

*(Catatan: Rute lain di bawah `/demo/start/ssr/` seperti `spa-mode`, `full-ssr`, `data-only` juga ada sebagai demo dan kandidat hapus)*

## Rekomendasi Frontend Structure

Rekomendasi struktur frontend yang lebih siap produksi:

```txt
web/src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── Sidebar.tsx
│   ├── ui/
│   └── common/
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── users/
│   ├── products/
│   └── categories/
├── lib/
│   ├── api-client.ts
│   ├── auth.ts
│   └── utils.ts
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── dashboard/
│       ├── index.tsx
│       ├── products.tsx
│       ├── categories.tsx
│       └── users.tsx
└── styles.css
```

Prinsip:

* `routes/` hanya route-level component.
* Logic API disimpan di `features/*/api`.
* Komponen fitur disimpan di `features/*/components`.
* API client global disimpan di `lib/api-client.ts`.
* Auth helper disimpan di `lib/auth.ts`.
* UI reusable disimpan di `components/ui`.