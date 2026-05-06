# 📚 PANDUAN SETUP LENGKAP
## Kartu Mahasiswa Digital - Universitas Pasifik Morotai

---

## ✅ LANGKAH 1 — Setup Supabase

### 1.1 Buat akun & project
1. Buka https://supabase.com → Sign Up (gratis)
2. Klik **New Project**
3. Isi: Name = `kartu-mahasiswa`, Password (catat!), Region = `Southeast Asia`
4. Tunggu ± 1 menit sampai project siap

### 1.2 Jalankan SQL Schema
1. Di Supabase Dashboard → klik **SQL Editor** (sidebar kiri)
2. Klik **New Query**
3. Copy-paste seluruh isi file `supabase/schema.sql`
4. Klik **Run** (tombol hijau)
5. Pastikan muncul "Success" ✅

### 1.3 Ambil kredensial
1. Di Supabase → **Settings** → **API**
2. Copy:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon/public** key → string panjang

---

## ✅ LANGKAH 2 — Setup Project Next.js

### 2.1 Install dependencies
```bash
npm install
```

### 2.2 Buat file `.env.local`
Buat file `.env.local` di root project:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc....(paste anon key)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, dan `CLOUDINARY_API_SECRET` diperlukan untuk upload foto ke Cloudinary secara aman melalui server.

### 2.3 Setup Cloudinary
1. Buka https://cloudinary.com → buat akun gratis.
2. Di Cloudinary Dashboard → **Dashboard** → catat **Cloud name**.
3. Di menu **Settings** → tab **Access Keys** → catat **API Key** dan **API Secret**.
4. Masukkan ke `.env.local`:
   - `CLOUDINARY_CLOUD_NAME` = Cloud name kamu
   - `CLOUDINARY_API_KEY` = API Key kamu
   - `CLOUDINARY_API_SECRET` = API Secret kamu

> Foto akan diupload secara aman melalui endpoint server, bukan langsung dari browser.

### 2.4 Upload logo
Letakkan file logo UNIPAS di:
```
public/logo-unipas.png
```
(Gunakan file `50419.png` yang sudah ada)

### 2.4 Jalankan development server
```bash
npm run dev
```

Buka browser: **http://localhost:3000**

---

## ✅ LANGKAH 3 — Deploy ke Vercel (Online/Gratis)

### 3.1 Push ke GitHub
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/username/kartu-mahasiswa.git
git push -u origin main
```

### 3.2 Deploy di Vercel
1. Buka https://vercel.com → login dengan GitHub
2. **New Project** → Import repository `kartu-mahasiswa`
3. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL Supabase kamu
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key kamu
4. Klik **Deploy**
5. Selesai! Kamu dapat URL seperti: `https://kartu-mahasiswa-unipas.vercel.app`

---

## 🔗 HALAMAN-HALAMAN APLIKASI

| Halaman | URL | Fungsi |
|---------|-----|--------|
| **Form Daftar** | `/` | Link ini yang dikirim ke mahasiswa |
| **Kartu Individual** | `/kartu/[id]` | Link kartu per mahasiswa (bisa dishare) |
| **Admin Dashboard** | `/admin` | Lihat semua data, hapus, salin link |

---

## 📋 ALUR PENGGUNAAN

```
Admin share link "/" ke mahasiswa
    ↓
Mahasiswa isi form (nama, NPM, foto, dll)
    ↓
Sistem simpan ke Supabase PostgreSQL
    ↓
Kartu otomatis dibuat & bisa didownload
    ↓
Mahasiswa dapat link unik: /kartu/[uuid]
    ↓
Link bisa dishare & dilihat kapan saja
```

---

## 🛠 TROUBLESHOOTING

**Error: "Invalid API Key"**
→ Cek file `.env.local`, pastikan tidak ada spasi ekstra

**Foto tidak muncul**
→ Di Supabase → Storage → Policies, pastikan bucket `foto-mahasiswa` sudah public

**NPM sudah terdaftar**
→ Normal! Setiap NPM hanya bisa digunakan sekali

**Kartu tidak bisa download**
→ Pastikan browser mendukung html2canvas (Chrome/Firefox terbaru)

---

## 📞 STRUKTUR FILE

```
kartu-mahasiswa/
├── src/
│   ├── app/
│   │   ├── page.tsx          ← Form pendaftaran (link publik)
│   │   ├── admin/page.tsx    ← Dashboard admin
│   │   ├── kartu/[id]/       ← Kartu individual
│   │   └── globals.css
│   ├── components/
│   │   └── KartuMahasiswa.tsx ← Komponen desain kartu
│   └── lib/
│       └── supabase.ts       ← Koneksi database
├── supabase/
│   └── schema.sql            ← SQL untuk database
├── public/
│   └── logo-unipas.png       ← Logo universitas
├── .env.local.example
└── package.json
```
