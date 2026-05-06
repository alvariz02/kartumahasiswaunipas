import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Kartu Mahasiswa - Universitas Pasifik Morotai',
  description: 'Sistem pembuatan kartu mahasiswa digital Universitas Pasifik Morotai',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
