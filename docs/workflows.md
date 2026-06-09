# Workflows

## Workflow Aktual

### GET Root Backend

User/Client mengakses backend `/`.
Backend mengembalikan `Hello World!`.

```mermaid
sequenceDiagram
    actor Client
    participant API as NestJS API
    participant Service as AppService

    Client->>API: GET /
    API->>Service: getHello()
    Service-->>API: Hello World!
    API-->>Client: Hello World!
```

## Workflow Target (Perlu Dibuat)

### Register

```mermaid
sequenceDiagram
    actor User
    participant Web as TanStack Frontend
    participant API as NestJS API
    participant Auth as AuthService
    participant DB as PostgreSQL

    User->>Web: Isi form register
    Web->>API: POST /auth/register
    API->>Auth: validate input
    Auth->>DB: check existing email
    DB-->>Auth: result
    Auth->>DB: create user with hashed password
    DB-->>Auth: user created
    Auth-->>API: user data
    API-->>Web: success response
    Web-->>User: redirect login/dashboard
```

### Login

```mermaid
sequenceDiagram
    actor User
    participant Web as TanStack Frontend
    participant API as NestJS API
    participant Auth as AuthService
    participant DB as PostgreSQL

    User->>Web: Input email dan password
    Web->>API: POST /auth/login
    API->>Auth: validate credentials
    Auth->>DB: find user by email
    DB-->>Auth: user data
    Auth->>Auth: compare password
    Auth->>DB: create session refresh token
    Auth-->>API: access token + refresh token
    API-->>Web: login success
    Web-->>User: masuk dashboard
```

### Product Management

```mermaid
sequenceDiagram
    actor Admin
    participant Web as Dashboard
    participant API as ProductsController
    participant Service as ProductsService
    participant DB as PostgreSQL

    Admin->>Web: Submit form product
    Web->>API: POST /products
    API->>Service: create product
    Service->>DB: validate category exists
    Service->>DB: insert product
    DB-->>Service: created product
    Service-->>API: product data
    API-->>Web: success response
    Web-->>Admin: update product table
```