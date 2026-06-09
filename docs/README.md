# Project Documentation

## Ringkasan Project

Project ini adalah monorepo fullstack dengan backend NestJS dan frontend TanStack React Start.

Backend berada di folder `api/`.
Frontend berada di folder `web/`.

Saat ini project masih berada pada tahap starter/skeleton. Backend sudah memiliki struktur module awal dan schema database, tetapi endpoint utama belum diimplementasikan. Frontend masih menggunakan template TanStack Start dan demo route, sehingga perlu dibersihkan dan diarahkan ke kebutuhan aplikasi sebenarnya.

## Kondisi Saat Ini

### Backend
- Framework: NestJS
- Bahasa: TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Module tersedia:
  - Auth
  - Users
  - Products
  - Categories
- Model database:
  - User
  - Session
  - Verification
  - Category
  - Product

### Frontend
- Framework: TanStack React Start
- Router: TanStack Router
- Data fetching: TanStack Query
- Styling: Tailwind CSS
- Build tool: Vite
- Deployment target: Netlify
- Kondisi UI: masih template/demo TanStack Start

## Documents

- [Architecture](./architecture.md)
- [Setup](./setup.md)
- [Database](./database.md)
- [Backend](./backend.md)
- [Frontend](./frontend.md)
- [API Reference](./api-reference.md)
- [Workflows](./workflows.md)
- [Environment](./environment.md)
- [Deployment](./deployment.md)
- [Docker Setup](./docker.md)
- [Risks and Gaps](./risks-and-gaps.md)
- [Roadmap](./roadmap.md)
- [Developer Onboarding](./developer-onboarding.md)