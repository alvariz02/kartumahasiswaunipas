import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Kartu Mahasiswa - Universitas Pasifik Morotai',
  description: 'Sistem pembuatan kartu mahasiswa digital Universitas Pasifik Morotai',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body style={{ width: '100vw', maxWidth: '100%', overflowX: 'hidden', margin: 0, padding: 0 }}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
