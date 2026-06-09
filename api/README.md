# Priceyless API

Backend API untuk Priceyless menggunakan NestJS, Prisma, PostgreSQL, JWT, Zod validation, Winston logging, Helmet, dan Jest E2E testing.

## Tech Stack

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- JWT Auth
- Passport JWT
- Zod
- Winston
- Helmet
- Jest
- Supertest
- Docker

## Features

- Register user
- Login user
- Get current user
- Role-based access control
- Public category list/detail
- Admin category create/update/delete
- Public product list/detail
- Admin product create/update/delete
- Global response format
- Global error format
- Zod validation pipe
- Request logging
- Prisma exception handling
- E2E tests

## Project Structure

```txt
src/
├── common/
│   ├── filters/
│   ├── interceptors/
│   ├── logger/
│   ├── pipes/
│   ├── schemas/
│   └── utils/
├── config/
├── database/
├── v1/
│   ├── auth/
│   ├── users/
│   ├── categories/
│   └── products/
├── app.module.ts
├── app.setup.ts
└── main.ts
```

## Environment Variables

| Variable           | Required | Example                             | Description           |
| ------------------ | -------- | ----------------------------------- | --------------------- |
| NODE_ENV           | Yes      | development                         | App environment       |
| PORT               | No       | 3000                                | App port              |
| DATABASE_URL       | Yes      | postgresql://...                    | PostgreSQL connection |
| JWT_SECRET         | Yes      | change-this-secret-minimum-16-chars | JWT secret            |
| JWT_EXPIRES_IN     | No       | 1d                                  | JWT expiration        |
| BCRYPT_SALT_ROUNDS | No       | 10                                  | Bcrypt salt rounds    |
| CORS_ORIGIN        | No       | *                                   | Allowed CORS origin   |

## Installation

```bash
pnpm install
```

## Setup Database

```bash
cp .env.example .env
pnpm prisma generate
pnpm prisma migrate dev
```

For production-style migration deployment:

```bash
pnpm prisma migrate deploy
```

## Run Development

```bash
pnpm dev
```

## Run Production

```bash
pnpm build
pnpm start:prod
```

## Run Tests

```bash
pnpm test
pnpm test:e2e
pnpm run test:e2e:debug
```

Correct debug command:

```bash
pnpm exec jest --config ./test/jest-e2e.json --detectOpenHandles --runInBand
```

Do not pass an extra `--` before the Jest flags.

## API Response Format

Success:

```json
{
  "status": "success",
  "message": "Request successful",
  "data": {}
}
```

Error:

```json
{
  "status": "error",
  "message": "Validation failed",
  "error": {
    "code": "BAD_REQUEST",
    "details": []
  }
}
```

## Auth Endpoints

| Method | Endpoint          | Auth         | Description   |
| ------ | ----------------- | ------------ | ------------- |
| POST   | /v1/auth/register | Public       | Register user |
| POST   | /v1/auth/login    | Public       | Login user    |
| GET    | /v1/auth/me       | Bearer token | Current user  |

## Category Endpoints

| Method | Endpoint           | Auth   | Description     |
| ------ | ------------------ | ------ | --------------- |
| GET    | /v1/categories     | Public | List categories |
| GET    | /v1/categories/:id | Public | Category detail |
| POST   | /v1/categories     | ADMIN  | Create category |
| PATCH  | /v1/categories/:id | ADMIN  | Update category |
| DELETE | /v1/categories/:id | ADMIN  | Delete category |

## Product Endpoints

| Method | Endpoint         | Auth   | Description    |
| ------ | ---------------- | ------ | -------------- |
| GET    | /v1/products     | Public | List products  |
| GET    | /v1/products/:id | Public | Product detail |
| POST   | /v1/products     | ADMIN  | Create product |
| PATCH  | /v1/products/:id | ADMIN  | Update product |
| DELETE | /v1/products/:id | ADMIN  | Delete product |

## Example Login

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

## Troubleshooting

### Jest says No tests found

Use:

```bash
pnpm exec jest --config ./test/jest-e2e.json --detectOpenHandles --runInBand
```

Do not use:

```bash
pnpm run test:e2e -- --detectOpenHandles --runInBand
```

### Jest did not exit

Check:

- `afterAll` calls `await app.close()`
- `DatabaseService` closes Prisma and the PG pool
- No unclosed timers/listeners remain

### API cannot connect database

Check `DATABASE_URL` and make sure PostgreSQL is running.

### JWT error

Make sure `JWT_SECRET` exists and has at least 16 characters.
