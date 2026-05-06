'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import KartuMahasiswa from '@/components/KartuMahasiswa';
import toast from 'react-hot-toast';

type FormData = {
  nama: string;
  npm: string;
  fakultas: string;
  prodi: string;
  alamat: string;
  angkatan: string;
  email: string;
  no_hp: string;
};

const FAKULTAS_PRODI: Record<string, string[]> = {
  'FKIP': ['PGSD', 'Pendidikan Bahasa Inggris'],
  'FISIP': ['Ilmu Administrasi Negara'],
  'Ekonomi': ['Akuntansi'],
  'Teknik': ['Teknik Informatika', 'Teknik Sipil', 'Teknik Lingkungan', 'Teknik Industri'],
  'MIPA': ['Matematika'],
  'Perikanan & Ilmu Kelautan': ['Ilmu Kelautan', 'Teknologi Hasil Perikanan'],
};

export default function FormPage() {
  const [form, setForm] = useState<FormData>({
    nama: '',
    npm: '',
    fakultas: 'FKIP',
    prodi: 'PGSD',
    alamat: '',
    angkatan: new Date().getFullYear().toString(),
    email: '',
    no_hp: '',
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<FormData | null>(null);
  const [lastFotoPreview, setLastFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'fakultas') {
      const prods = FAKULTAS_PRODI[value];
      setForm(prev => ({ ...prev, [name]: value, prodi: prods?.[0] || '' }));
    }
  };

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 2MB');
      return;
    }
    setFoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.npm || !form.alamat) {
      toast.error('Nama, NPM, dan Alamat wajib diisi!');
      return;
    }

    setSubmitting(true);
    try {
      // Cek duplikat NPM sebelum menyimpan
      const { data: existing } = await supabase
        .from('mahasiswa')
        .select('id')
        .eq('npm', form.npm)
        .maybeSingle();

      if (existing) {
        toast.error('NPM sudah terdaftar! Setiap NPM hanya bisa digunakan sekali.');
        return;
      }

      let foto_url: string | null = null;

      // Upload foto ke Cloudinary via API route jika ada
      if (foto) {
        const uploadForm = new FormData();
        uploadForm.append('file', foto);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadForm,
        });

        const result = await response.json();
        if (!response.ok || !result.secure_url) {
          console.error('Upload failed', result);
          toast.error('Gagal mengunggah foto. Coba lagi.');
          return;
        }

        foto_url = result.secure_url;
      }

      // Simpan ke database
      const { data, error } = await supabase
        .from('mahasiswa')
        .insert([{ ...form, foto_url }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('NPM sudah terdaftar! Setiap NPM hanya bisa digunakan sekali.');
        } else {
          throw error;
        }
        return;
      }

      setSavedId(data.id);
      setLastSubmittedData(form);
      setLastFotoPreview(fotoPreview);
      setForm({
        nama: '',
        npm: '',
        fakultas: 'FKIP',
        prodi: 'PGSD',
        alamat: '',
        angkatan: new Date().getFullYear().toString(),
        email: '',
        no_hp: '',
      });
      setFoto(null);
      setFotoPreview(null);
      toast.success('Kartu mahasiswa berhasil dibuat! 🎉');
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('kartu-mahasiswa');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `KartuMahasiswa-${form.npm}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Kartu berhasil diunduh!');
    } catch {
      toast.error('Gagal mengunduh. Coba lagi.');
    }
  };

  const prodiList = FAKULTAS_PRODI[form.fakultas] || [];

  // ========================
  // FORM STATE
  // ========================
  return (
    <div className="main-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #001845 0%, #003087 50%, #0050c8 100%)',
      padding: '16px 12px',
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '20px',
        width: '100%',
      }}>

        {/* HEADER */}
        <div className="main-header" style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          '@media (max-width: 768px)': {
            padding: '12px',
          },
        } as any}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 1,
            minWidth: '250px',
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <img src="/logo-unipas.png" alt="Logo" style={{ width: '40px', objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <div style={{ color: '#FFD700', fontWeight: '800', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                UNIVERSITAS PASIFIK
              </div>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '16px', marginTop: '2px', lineHeight: '1.2' }}>
                Formulir Kartu Mahasiswa
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '2px', lineHeight: '1.3' }}>
                Isi data lengkap untuk kartu digital
              </div>
            </div>
          </div>
          <a
            className="admin-link"
            href="/admin"
            style={{
              background: '#0094D9',
              color: 'white',
              borderRadius: '10px',
              padding: '10px 14px',
              fontWeight: '700',
              fontSize: '12px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flex: '0 0 auto',
            }}
          >
            📋 Data Mahasiswa
          </a>
        </div>

        {/* CONTENT */}
        <div className="page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

          {/* LEFT: FORM */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <h2 style={{ color: 'white', fontWeight: '800', fontSize: '16px', margin: '0 0 20px', letterSpacing: '0.5px' }}>
              Data Mahasiswa
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
              {/* FOTO */}
              <div>
                <label style={labelStyle}>Foto Mahasiswa</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed rgba(0,148,217,0.5)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center' as const,
                    cursor: 'pointer',
                    background: 'rgba(0,148,217,0.05)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {fotoPreview ? (
                    <>
                      <img src={fotoPreview} alt="" style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #0094D9' }} />
                      <span style={{ color: '#0094D9', fontSize: '13px', fontWeight: '600' }}>Foto dipilih — klik untuk ganti</span>
                    </>
                  ) : (
                    <div style={{ width: '100%' }}>
                      <div style={{ fontSize: '28px' }}>📷</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '4px' }}>Klik untuk upload foto (maks 2MB)</div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
              </div>

              {/* NAMA */}
              <FormInput label="Nama Lengkap *" name="nama" value={form.nama} onChange={handleChange} placeholder="Masukkan nama lengkap" />

              {/* NPM */}
              <FormInput label="NPM *" name="npm" value={form.npm} onChange={handleChange} placeholder="Contoh: 12010225045" />

              {/* FAKULTAS */}
              <div>
                <label style={labelStyle}>Fakultas *</label>
                <select name="fakultas" value={form.fakultas} onChange={handleChange} style={selectStyle}>
                  {Object.keys(FAKULTAS_PRODI).map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* PRODI */}
              <div>
                <label style={labelStyle}>Program Studi *</label>
                <select name="prodi" value={form.prodi} onChange={handleChange} style={selectStyle}>
                  {prodiList.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* ALAMAT */}
              <div>
                <label style={labelStyle}>Alamat *</label>
                <textarea
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap"
                  rows={2}
                  style={{ ...inputStyle, resize: 'none' as const }}
                />
              </div>

              {/* ANGKATAN */}
              <FormInput label="Angkatan" name="angkatan" value={form.angkatan} onChange={handleChange} placeholder="Tahun angkatan" />

              {/* EMAIL */}
              <FormInput label="Email" name="email" value={form.email} onChange={handleChange} placeholder="email@mahasiswa.ac.id" type="email" />

              {/* NO HP */}
              <FormInput label="No. HP" name="no_hp" value={form.no_hp} onChange={handleChange} placeholder="08xxxxxxxxxx" />

              {/* SUBMIT */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  background: submitting ? 'rgba(255,215,0,0.5)' : '#FFD700',
                  color: '#003087',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  fontWeight: '800',
                  fontSize: '16px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                  transition: 'all 0.2s',
                  letterSpacing: '0.5px',
                }}
              >
                {submitting ? '⏳ Menyimpan...' : '🎓 Buat Kartu Mahasiswa'}
              </button>

              {/* DOWNLOAD BUTTON IF LAST SUBMITTED */}
              {lastSubmittedData && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '14px',
                    padding: '18px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}>
                    ✅ Data sudah tersimpan. Kartu akan diproses oleh admin.
                    <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.75)' }}>
                      Anda tidak dapat mencetak atau mengunduh kartu langsung dari halaman ini.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: PREVIEW */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <h2 style={{ color: 'white', fontWeight: '800', fontSize: '16px', margin: '0 0 20px', letterSpacing: '0.5px' }}>
                Preview Kartu
              </h2>
              <div className="preview-outer" style={{ width: '100%', maxWidth: '540px' }}>
                <KartuMahasiswa
                  nama={(lastSubmittedData?.nama || form.nama) || 'NAMA MAHASISWA'}
                  npm={(lastSubmittedData?.npm || form.npm) || 'XXXXXXXXXX'}
                  fakultas={lastSubmittedData?.fakultas || form.fakultas}
                  prodi={lastSubmittedData?.prodi || form.prodi}
                  alamat={(lastSubmittedData?.alamat || form.alamat) || 'ALAMAT MAHASISWA'}
                  angkatan={lastSubmittedData?.angkatan || form.angkatan}
                  fotoUrl={lastFotoPreview || fotoPreview}
                />
              </div>
            </div>

            {/* Info box */}
            <div style={{
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <div style={{ color: '#FFD700', fontWeight: '800', fontSize: '13px', marginBottom: '8px' }}>
                ℹ️ Panduan Pengisian
              </div>
              <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0, padding: '0 0 0 16px', lineHeight: '1.8' }}>
                <li>Upload foto formal (berpakaian rapi)</li>
                <li>NPM harus sesuai dengan yang diberikan kampus</li>
                <li>Data yang tersimpan tidak dapat diubah sendiri</li>
                <li>Kartu akan diproses dan dicetak oleh admin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================
// HELPER COMPONENTS
// ========================
function FormInput({
  label, name, value, onChange, placeholder, type = 'text'
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '12px',
  fontWeight: '600',
  marginBottom: '6px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.08)',
  border: '1.5px solid rgba(255,255,255,0.15)',
  borderRadius: '10px',
  padding: '11px 14px',
  color: 'white',
  fontSize: '14px',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundColor: 'rgba(255,255,255,0.95)',
  color: '#0B1F44',
  borderColor: 'rgba(0,0,0,0.15)',
};
