# Arsipindex — Backend

REST API **NestJS + PostgreSQL + Prisma ORM**.

## Menjalankan

```bash
npm install
cp .env.example .env            # sesuaikan DATABASE_URL
docker compose up -d            # opsional: PostgreSQL via Docker
npx prisma migrate dev          # membuat tabel `books`
npx prisma db seed              # opsional: 3 buku contoh
npm run start:dev               # http://localhost:3001
```

> Jika memakai PostgreSQL sendiri (bukan Docker), buat database `arsipindex` lalu ubah `DATABASE_URL` di `.env`.

## Endpoint

| Method | Rute | Keterangan | Status |
|---|---|---|---|
| GET | `/books` | Daftar buku. Query opsional: `status`, `category`, `search` (Prisma `where`) | 200 |
| GET | `/books/stats` | Statistik `{ total, selesai, sedang, rencana }` (Prisma `count`) | 200 |
| GET | `/books/:id` | Satu buku | 200 / 404 |
| POST | `/books` | Tambah buku | 201 / 400 |
| PATCH | `/books/:id` | Ubah sebagian field | 200 / 400 / 404 |
| DELETE | `/books/:id` | Hapus buku | 204 / 404 |

Contoh request ada di `api.http` (ekstensi VS Code *REST Client*).

## Struktur

```
prisma/schema.prisma      model Book + enum ReadingStatus
prisma/migrations/        migrasi awal (wajib di-commit)
prisma/seed.ts            data awal
src/prisma/               PrismaService (@Global module)
src/books/                controller, service (Prisma Client), DTO
src/common/filters/       exception filter global
src/main.ts               CORS, ValidationPipe, filter
```
