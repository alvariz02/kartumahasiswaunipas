import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Mahasiswa = {
  id: string;
  nama: string;
  npm: string;
  fakultas: string;
  prodi: string;
  alamat: string;
  angkatan: string;
  email: string;
  no_hp: string;
  foto_url: string | null;
  created_at: string;
};
