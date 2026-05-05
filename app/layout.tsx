import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OYAIB Elderly Care | Honouring Our Elders',
  description: 'OYAIB Elderly Care is a Nigerian NGO dedicated to the welfare, dignity and wellbeing of the elderly.',
  keywords: 'elderly care Nigeria, NGO, OYAIB, senior citizens, welfare',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">{children}</body>
    </html>
  );
}