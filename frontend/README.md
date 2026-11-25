# Arsipindex — Frontend

React + Vite. Mengonsumsi REST API di folder `../backend`.

```bash
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:3001
npm run dev              # http://localhost:5173
```

Fitur: daftar buku, tambah, ubah status baca, hapus, pencarian, filter status/kategori, dan statistik —
semuanya dibaca/ditulis ke API (data tersimpan di PostgreSQL).
