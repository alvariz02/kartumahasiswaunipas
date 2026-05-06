# Kartu Mahasiswa - Universitas Pasifik Morotai

Aplikasi web untuk generate kartu mahasiswa otomatis menggunakan Next.js + Supabase.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.local.example` ke `.env.local` dan isi dengan kredensial Supabase
3. Jalankan SQL di Supabase Dashboard (lihat `supabase/schema.sql`)
4. Jalankan: `npm run dev`

## Fitur
- Form input data mahasiswa (link bisa dishare)
- Preview kartu mahasiswa real-time
- Download kartu sebagai PNG
- Dashboard admin untuk melihat semua data
- Database PostgreSQL via Supabase
