# Risks and Gaps Analysis

## Backend Gap Analysis

### Critical
- Auth module belum memiliki endpoint register/login/logout.
- Password hashing belum terlihat.
- JWT/session flow belum terlihat.
- Controller users/products/categories masih kosong.
- Belum ada validation DTO.
- Belum ada global response format.
- Belum ada global exception filter.
- Belum ada auth guard.
- Belum ada role guard.
- Belum ada CORS setup jika frontend beda origin.

### High
- Database schema sudah ada, tetapi belum dipakai oleh service.
- Belum ada seed data.
- Belum ada `.env.example`.
- Belum ada API documentation (seperti Swagger).
- Belum ada integration nyata antara frontend dan backend.

### Medium
- Test (e2e, unit) masih starter.
- README backend masih bawaan NestJS.
- Naming module sudah baik, tetapi implementasi belum ada.

### Low
- Formatting perlu distandarkan.
- Dokumentasi developer onboarding terperinci belum ada.

## Frontend Gap Analysis

### Critical
- UI masih template TanStack Start.
- Belum ada login/register page.
- Belum ada dashboard.
- Belum ada API client ke backend.
- Belum ada auth state.
- Belum ada protected route.

### High
- Header/sidebar masih menggunakan demo TanStack.
- Route demo masih aktif.
- Belum ada product/category management UI.
- Belum ada form validation.

### Medium
- Belum ada loading, error, dan empty state untuk data real.
- Belum ada struktur fitur (feature-based structure).
- Belum ada design system final.

### Low
- Asset dan manifest masih branding TanStack.
