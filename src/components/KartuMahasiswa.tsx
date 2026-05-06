'use client';

import React from 'react';

type Props = {
  nama: string;
  npm: string;
  fakultas: string;
  prodi: string;
  alamat: string;
  angkatan?: string;
  fotoUrl?: string | null;
  forDownload?: boolean;
};

export default function KartuMahasiswa({
  nama,
  npm,
  fakultas,
  prodi,
  alamat,
  angkatan,
  fotoUrl,
  forDownload = false,
}: Props) {
  const scale = forDownload ? 1 : 1;

  return (
    <div
      id="kartu-mahasiswa"
      style={{
        width: forDownload ? '540px' : '100%',
        maxWidth: '540px',
        minHeight: '320px',
        background: '#E0F7FF',
        borderRadius: forDownload ? '0' : '16px',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
        boxShadow: forDownload ? 'none' : '0 25px 70px rgba(0,48,135,0.3)',
        position: 'relative',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #003087 0%, #0050c8 60%, #0094D9 100%)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          position: 'relative',
        }}
      >
        {/* Decorative yellow + cyan stripes top-right */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '4px 0',
          width: '80px',
        }}>
          <div style={{ flex: 1, background: 'rgba(0,188,212,0.7)', borderRadius: '2px 0 0 2px' }} />
          <div style={{ flex: 1, background: '#FFD700', borderRadius: '2px 0 0 2px' }} />
          <div style={{ flex: 1, background: 'rgba(0,188,212,0.5)', borderRadius: '2px 0 0 2px' }} />
        </div>

        {/* Logo */}
        <div style={{
          width: '54px',
          height: '54px',
          flexShrink: 0,
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.5)',
        }}>
          {/* SVG Logo placeholder - will use image tag */}
          <img
            src="/logo-unipas.png"
            alt="Logo UNIPAS"
            style={{ width: '46px', height: '46px', objectFit: 'contain' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML = `
                  <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="18" stroke="white" stroke-width="2" fill="none"/>
                    <rect x="15" y="14" width="3" height="14" fill="white"/>
                    <rect x="19" y="12" width="3" height="16" fill="white"/>
                    <rect x="23" y="14" width="3" height="14" fill="white"/>
                    <path d="M12 28 Q20 24 28 28" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                `;
              }
            }}
          />
        </div>

        {/* University name */}
        <div>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '15px', lineHeight: '1.2', letterSpacing: '0.5px' }}>
            UNIVERSITAS PASIFIK
          </div>
          <div style={{ color: '#FFD700', fontWeight: '700', fontSize: '14px', letterSpacing: '1px' }}>
            MOROTAI
          </div>
        </div>
      </div>

      {/* TITLE */}
      <div style={{
        textAlign: 'center',
        padding: '12px 0 8px',
        background: '#E0F7FF',
      }}>
        <span style={{
          color: '#003087',
          fontWeight: '800',
          fontSize: '20px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          KARTU MAHASISWA
        </span>
      </div>

      {/* DIVIDER LINE */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #0094D9, #003087, #FFD700)', margin: '0 18px' }} />

      {/* BODY */}
      <div style={{
        display: 'flex',
        gap: '16px',
        padding: '14px 20px',
        position: 'relative',
      }}>
        {/* WATERMARK */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.10,
          pointerEvents: 'none',
        }}>
          <img src="/logo-unipas.png" alt="" style={{ width: '140px' }}
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
        </div>

        {/* FOTO */}
        <div style={{
          width: '80px',
          height: '100px',
          flexShrink: 0,
          border: '2px solid #0094D9',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#EBF4FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt="Foto Mahasiswa"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="14" r="8" fill="#B0C4DE" />
              <path d="M4 36c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#B0C4DE" />
            </svg>
          )}
        </div>

        {/* DATA */}
        <div style={{ flex: 1 }}>
          {[
            { label: 'NAMA', value: nama || '—' },
            { label: 'NPM', value: npm || '—' },
            { label: 'FAKULTAS', value: fakultas || '—' },
            { label: 'PRODI', value: prodi || '—' },
            { label: 'ALAMAT', value: alamat || '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '4px',
              alignItems: 'flex-start',
            }}>
              <span style={{
                color: '#003087',
                fontWeight: '700',
                fontSize: '10px',
                width: '60px',
                flexShrink: 0,
                letterSpacing: '0.3px',
              }}>
                {label}
              </span>
              <span style={{ color: '#003087', fontWeight: '700', fontSize: '10px' }}>:</span>
              <span style={{
                color: '#1a1a2e',
                fontWeight: '600',
                fontSize: '10px',
                flex: 1,
                lineHeight: '1.3',
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        background: 'linear-gradient(90deg, #003087 0%, #0094D9 100%)',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '4px',
        position: 'relative',
      }}>
        {/* Yellow stripe left */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '210px',
          background: '#FFD700',
          clipPath: 'polygon(0 0, 90% 0, 100% 100%, 0 100%)',
        }} />
        <div style={{
          position: 'relative',
          zIndex: 2,
          color: '#003087',
          fontWeight: '700',
          fontSize: '9px',
        }}>
          email: unipasmorotai@univpasifik.ac.id
        </div>
        {angkatan && (
          <div style={{
            position: 'relative',
            zIndex: 2,
            color: 'white',
            fontWeight: '700',
            fontSize: '10px',
          }}>
            Angkatan {angkatan}
          </div>
        )}
        {/* Cyan stripe right */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '60px',
          background: 'rgba(0,188,212,0.6)',
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
        }} />
      </div>
    </div>
  );
}
