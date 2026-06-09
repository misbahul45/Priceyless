# Priceyless Web App

This is the frontend dashboard for Priceyless, a clean and scalable inventory management prototype.

## Quick Start

### 1. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure `VITE_API_BASE_URL` points to your backend instance.

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm dev
```
Visit `http://localhost:3000` to see the application.

## Build and Preview

```bash
pnpm build
pnpm preview
```

## Tech Stack
- [TanStack Start](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

For complete architecture guidelines, check `docs/frontend.md`.
