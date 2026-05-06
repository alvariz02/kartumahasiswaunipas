'use client';

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { supabase, Mahasiswa } from '@/lib/supabase';
import KartuMahasiswa from '@/components/KartuMahasiswa';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AdminPage() {
  const [list, setList] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterFakultas, setFilterFakultas] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('mahasiswa')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal memuat data');
    } else {
      setList(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus data ${nama}?`)) return;
    try {
      const { data, error } = await supabase
        .from('mahasiswa')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Delete error:', error);
        toast.error(`Gagal menghapus: ${error.message}`);
        return;
      }
      
      toast.success('Data dihapus');
      setList(list.filter(item => item.id !== id));
      fetchAll();
    } catch (err) {
      console.error('Delete exception:', err);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  const exportAllToPDF = async () => {
    if (filtered.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    toast.loading('Membuat PDF...');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const cardWidth = 90; // mm
    const cardHeight = 55; // mm
    const margin = 10;
    let x = margin;
    let y = margin;

    for (let i = 0; i < filtered.length; i++) {
      const m = filtered[i];

      // Create temporary element for the card
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '540px';
      tempDiv.style.height = '320px';
      document.body.appendChild(tempDiv);

      // Render KartuMahasiswa into tempDiv
      const root = ReactDOM.createRoot(tempDiv);
      root.render(
        <KartuMahasiswa
          nama={m.nama}
          npm={m.npm}
          fakultas={m.fakultas}
          prodi={m.prodi}
          alamat={m.alamat}
          angkatan={m.angkatan}
          fotoUrl={m.foto_url}
          forDownload={true}
        />
      );

      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture with html2canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      // Add to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);

      // Clean up
      root.unmount();
      document.body.removeChild(tempDiv);

      // Position for next card
      x += cardWidth + margin;
      if (x + cardWidth > pageWidth) {
        x = margin;
        y += cardHeight + margin;
        if (y + cardHeight > pageHeight) {
          pdf.addPage();
          y = margin;
        }
      }
    }

    pdf.save('KartuMahasiswa-Semua.pdf');
    toast.dismiss();
    toast.success('PDF berhasil dibuat!');
  };

  const filtered = list.filter(m => {
    const matchSearch = !search ||
      m.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.npm.includes(search);
    const matchFakultas = !filterFakultas || m.fakultas === filterFakultas;
    return matchSearch && matchFakultas;
  });

  const fakultasList = Array.from(new Set(list.map(m => m.fakultas)));

  const stats = {
    total: list.length,
    fkip: list.filter(m => m.fakultas === 'FKIP').length,
    thisMonth: list.filter(m => {
      const d = new Date(m.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #001845 0%, #003087 60%, #004aad 100%)',
      padding: '16px 12px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

        {/* HEADER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap' as const,
          gap: '12px',
        }}>
          <div>
            <div style={{ color: '#FFD700', fontSize: '11px', fontWeight: '700', letterSpacing: '2px' }}>
              UNIVERSITAS PASIFIK MOROTAI
            </div>
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '800', margin: '4px 0 0' }}>
              Dashboard Admin
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a
              href="/"
              style={{
                background: '#FFD700',
                color: '#003087',
                borderRadius: '8px',
                padding: '8px 14px',
                fontWeight: '700',
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              ➕ Tambah
            </a>
            <button
              onClick={exportAllToPDF}
              style={{
                background: '#0094D9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              📄 Export PDF
            </button>
          </div>
        </div>

        {/* STATS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}>
          {[
            { label: 'Total Mahasiswa', value: stats.total, icon: '🎓' },
            { label: 'Bulan Ini', value: stats.thisMonth, icon: '📅' },
            { label: 'Jumlah Fakultas', value: fakultasList.length, icon: '🏛️' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ color: '#FFD700', fontSize: '28px', fontWeight: '800' }}>{value}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* SEARCH & FILTER */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap' as const,
        }}>
          <input
            type="text"
            placeholder="🔍 Cari nama atau NPM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
          <select
            value={filterFakultas}
            onChange={(e) => setFilterFakultas(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <option value="" style={{ background: '#003087' }}>Semua Fakultas</option>
            {fakultasList.map(f => (
              <option key={f} value={f} style={{ background: '#003087' }}>{f}</option>
            ))}
          </select>
          <button onClick={fetchAll} style={{
            background: 'rgba(0,148,217,0.3)',
            border: '1px solid rgba(0,148,217,0.4)',
            borderRadius: '10px',
            padding: '10px 16px',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '600',
          }}>
            🔄 Refresh
          </button>
        </div>

        {/* TABLE */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
              ⏳ Memuat data...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
              📭 Tidak ada data ditemukan
            </div>
          ) : (
            <div style={{ overflowX: 'auto' as const, WebkitOverflowScrolling: 'touch', width: '100%', maxWidth: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const, minWidth: '600px' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,48,135,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Foto', 'Nama / NPM', 'Fakultas', 'Prodi', 'Alamat', 'Terdaftar', 'Aksi'].map(h => (
                      <th key={h} style={{
                        padding: '14px 16px',
                        color: '#FFD700',
                        fontSize: '11px',
                        fontWeight: '700',
                        textAlign: 'left' as const,
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase' as const,
                        whiteSpace: 'nowrap' as const,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                        transition: 'background 0.2s',
                      }}
                    >
                      {/* FOTO */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{
                          width: '44px',
                          height: '55px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '2px solid rgba(0,148,217,0.4)',
                          background: 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {m.foto_url ? (
                            <img src={m.foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '20px' }}>👤</span>
                          )}
                        </div>
                      </td>

                      {/* NAMA / NPM */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>{m.nama}</div>
                        <div style={{ color: '#0094D9', fontWeight: '600', fontSize: '12px', marginTop: '2px' }}>{m.npm}</div>
                      </td>

                      <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{m.fakultas}</td>
                      <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{m.prodi}</td>

                      <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', maxWidth: '150px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                          {m.alamat}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', whiteSpace: 'nowrap' as const }}>
                        {new Date(m.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>

                      {/* AKSI */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <a
                            href={`/kartu/${m.id}`}
                            target="_blank"
                            style={{
                              background: 'rgba(0,148,217,0.3)',
                              border: '1px solid rgba(0,148,217,0.5)',
                              color: 'white',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap' as const,
                            }}
                          >
                            👁 Lihat
                          </a>
                          <button
                            onClick={() => {
                              const url = `${window.location.origin}/kartu/${m.id}`;
                              navigator.clipboard.writeText(url);
                              toast.success('Link disalin!');
                            }}
                            style={{
                              background: 'rgba(255,215,0,0.15)',
                              border: '1px solid rgba(255,215,0,0.3)',
                              color: '#FFD700',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap' as const,
                            }}
                          >
                            🔗 Link
                          </button>
                          <button
                            onClick={() => handleDelete(m.id, m.nama)}
                            style={{
                              background: 'rgba(239,68,68,0.15)',
                              border: '1px solid rgba(239,68,68,0.3)',
                              color: '#ef4444',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
          Menampilkan {filtered.length} dari {list.length} mahasiswa
        </div>
      </div>
    </div>
  );
}
