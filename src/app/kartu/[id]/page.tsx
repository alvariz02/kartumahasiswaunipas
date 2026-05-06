'use client';

import { useEffect, useState } from 'react';
import { supabase, Mahasiswa } from '@/lib/supabase';
import KartuMahasiswa from '@/components/KartuMahasiswa';
import toast from 'react-hot-toast';

export default function KartuPage({ params }: { params: { id: string } }) {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('mahasiswa')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setMahasiswa(data);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  const handleDownload = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('kartu-mahasiswa');
      if (!element) return;
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `KartuMahasiswa-${mahasiswa?.npm}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Kartu berhasil diunduh!');
    } catch {
      toast.error('Gagal mengunduh.');
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
          <p style={{ fontSize: '16px', opacity: 0.8 }}>Memuat data...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>❌</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Kartu Tidak Ditemukan</h1>
          <p style={{ opacity: 0.7 }}>ID kartu tidak valid atau data belum tersedia.</p>
          <a href="/" style={{
            display: 'inline-block',
            marginTop: '16px',
            background: '#FFD700',
            color: '#003087',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: '800',
            textDecoration: 'none',
          }}>
            ← Buat Kartu Baru
          </a>
          <a href="/admin" style={{
            display: 'inline-block',
            marginTop: '16px',
            marginLeft: '12px',
            background: 'rgba(0,188,212,0.2)',
            color: 'white',
            border: '1.5px solid rgba(0,188,212,0.4)',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: '700',
            textDecoration: 'none',
          }}>
            ← Kembali ke Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ textAlign: 'center', color: 'white', marginBottom: '8px' }}>
        <div style={{ fontSize: '36px' }}>🎓</div>
        <h1 style={{ fontSize: '18px', fontWeight: '800', margin: '8px 0 4px' }}>
          Kartu Mahasiswa Digital
        </h1>
        <p style={{ opacity: 0.6, fontSize: '13px', margin: 0 }}>
          Universitas Pasifik Morotai
        </p>
      </div>

      {/* Card */}
      <div style={{
        filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))',
      }}>
        <KartuMahasiswa
          nama={mahasiswa!.nama}
          npm={mahasiswa!.npm}
          fakultas={mahasiswa!.fakultas}
          prodi={mahasiswa!.prodi}
          alamat={mahasiswa!.alamat}
          angkatan={mahasiswa!.angkatan}
          fotoUrl={mahasiswa!.foto_url}
        />
      </div>

      {/* Detail info */}
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '16px 20px',
        border: '1px solid rgba(255,255,255,0.12)',
        maxWidth: '540px',
        width: '100%',
      }}>
        <div style={{ color: '#FFD700', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px' }}>
          INFORMASI TAMBAHAN
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {mahasiswa!.email && (
            <InfoRow label="Email" value={mahasiswa!.email} />
          )}
          {mahasiswa!.no_hp && (
            <InfoRow label="No. HP" value={mahasiswa!.no_hp} />
          )}
          <InfoRow label="Terdaftar" value={new Date(mahasiswa!.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
          })} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
        <button onClick={handleDownload} style={{
          background: '#FFD700',
          color: '#003087',
          border: 'none',
          borderRadius: '12px',
          padding: '13px 24px',
          fontWeight: '800',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          ⬇ Download PNG
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link disalin!');
          }}
          style={{
            background: 'rgba(255,255,255,0.12)',
            color: 'white',
            border: '1.5px solid rgba(255,255,255,0.25)',
            borderRadius: '12px',
            padding: '13px 24px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          🔗 Salin Link
        </button>
        <a href="/admin" style={{
          background: 'rgba(0,188,212,0.2)',
          color: 'white',
          border: '1.5px solid rgba(0,188,212,0.4)',
          borderRadius: '12px',
          padding: '13px 24px',
          fontWeight: '700',
          fontSize: '14px',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          ← Kembali ke Dashboard
        </a>
        <a href="/" style={{
          background: 'rgba(0,148,217,0.2)',
          color: 'white',
          border: '1.5px solid rgba(0,148,217,0.4)',
          borderRadius: '12px',
          padding: '13px 24px',
          fontWeight: '700',
          fontSize: '14px',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          + Daftar Mahasiswa Baru
        </a>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px' }}>
        {label.toUpperCase()}
      </div>
      <div style={{ color: 'white', fontSize: '13px', fontWeight: '600', marginTop: '2px' }}>
        {value}
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #001845 0%, #003087 50%, #0050c8 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 16px',
  gap: '24px',
};
