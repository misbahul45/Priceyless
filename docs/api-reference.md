# API Reference

*Catatan: API di bawah ini adalah rancangan kontrak (API Contract) yang belum diimplementasikan di kode backend (masih skeleton).*

## Auth API

### POST /auth/register
Fungsi:
Mendaftarkan user baru.

Request:
```json
{
  "name": "Misbahul Muttaqin",
  "email": "misbahul@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Misbahul Muttaqin",
      "email": "misbahul@example.com",
      "role": "USER"
    }
  }
}
```

### POST /auth/login
Fungsi:
Login user.

Request:
```json
{
  "email": "misbahul@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "status": "success",
  "message": "Login successfully",
  "data": {
    "accessToken": "jwt",
    "refreshToken": "token",
    "user": {}
  }
}
```

### POST /auth/refresh
Fungsi:
Membuat access token baru dari refresh token.

### POST /auth/logout
Fungsi:
Menghapus session atau refresh token.

### GET /auth/me
Fungsi:
Mengambil data user yang sedang login.

## Users API

### GET /users
Admin only. Mengambil semua user.

### GET /users/:id
Admin atau pemilik akun. Mengambil detail user.

### PATCH /users/me
User mengubah profil sendiri.

### PATCH /users/:id/role
Admin only. Mengubah role user.

## Categories API

### GET /categories
Mengambil semua kategori.

### POST /categories
Admin only. Membuat kategori.

### GET /categories/:id
Mengambil detail kategori.

### PATCH /categories/:id
Admin only. Update kategori.

### DELETE /categories/:id
Admin only. Hapus kategori jika tidak dipakai produk.

## Products API

### GET /products
Mengambil semua produk.

### GET /products/:id
Mengambil detail produk.

### POST /products
Admin only. Membuat produk.

### PATCH /products/:id
Admin only. Update produk.

### DELETE /products/:id
Admin only. Hapus produk.