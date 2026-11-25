# Arsipindex

Sistem manajemen literatur dan pelacak bacaan digital berbasis **React + Vite** (`frontend/`, port `5173`) dan **NestJS + Prisma ORM + PostgreSQL** (`backend/`, port `3001`). Penyimpanan data menggunakan basis data PostgreSQL sehingga data buku tersimpan permanen.

## Menjalankan Proyek

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Akses aplikasi di `http://localhost:5173` dan REST API di `http://localhost:3001/books`.

## Fitur & Endpoint Utama

- CRUD buku (`GET /books`, `GET /books/:id`, `POST /books`, `PATCH /books/:id`, `DELETE /books/:id`)
- Filter dan pencarian (`?status=&category=&search=`)
- Statistik koleksi (`GET /books/stats`)
