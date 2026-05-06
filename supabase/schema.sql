-- =============================================
-- Schema Kartu Mahasiswa - Universitas Pasifik Morotai
-- Jalankan ini di Supabase SQL Editor
-- =============================================

-- Tabel mahasiswa
CREATE TABLE IF NOT EXISTS mahasiswa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  npm VARCHAR(50) NOT NULL UNIQUE,
  fakultas VARCHAR(100) NOT NULL,
  prodi VARCHAR(100) NOT NULL,
  alamat TEXT NOT NULL,
  angkatan VARCHAR(10),
  email VARCHAR(255),
  no_hp VARCHAR(20),
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_mahasiswa_npm ON mahasiswa(npm);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_fakultas ON mahasiswa(fakultas);

-- Enable Row Level Security
ALTER TABLE mahasiswa ENABLE ROW LEVEL SECURITY;

-- Policy: semua orang bisa insert (untuk form publik)
CREATE POLICY "Allow public insert" ON mahasiswa
  FOR INSERT WITH CHECK (true);

-- Policy: semua orang bisa baca (untuk preview kartu)
CREATE POLICY "Allow public select" ON mahasiswa
  FOR SELECT USING (true);

-- Policy: update hanya untuk authenticated user (admin)
CREATE POLICY "Allow authenticated update" ON mahasiswa
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: delete hanya untuk authenticated user (admin)
-- NOTE: Untuk production, sebaiknya gunakan autentikasi dan ganti USING (true) dengan USING (auth.role() = 'authenticated')
CREATE POLICY "Allow authenticated delete" ON mahasiswa
  FOR DELETE USING (true);

-- Trigger untuk update updated_at otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mahasiswa_updated_at
  BEFORE UPDATE ON mahasiswa
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket untuk foto mahasiswa
INSERT INTO storage.buckets (id, name, public)
VALUES ('foto-mahasiswa', 'foto-mahasiswa', true)
ON CONFLICT DO NOTHING;

-- Policy storage: allow public upload
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'foto-mahasiswa');

CREATE POLICY "Allow public view" ON storage.objects
  FOR SELECT USING (bucket_id = 'foto-mahasiswa');
