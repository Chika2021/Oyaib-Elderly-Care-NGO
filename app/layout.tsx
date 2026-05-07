import type { Metadata } from 'next';
import './globals.css';

// export const metadata: Metadata = {
//   title: 'OYAIB Elderly Care | Honouring Our Elders',
//   description: 'OYAIB Elderly Care is a Nigerian NGO dedicated to the welfare, dignity and wellbeing of the elderly.',
//   keywords: 'elderly care Nigeria, NGO, OYAIB, senior citizens, welfare',
// };



export const metadata: Metadata = {
  metadataBase: new URL('https://oyaibelderlycare.com.ng'),
  title: {
    default: 'OYAIB Elderly Care | Honouring Our Elders',
    template: '%s | OYAIB Elderly Care',
  },
  description: 'OYAIB Elderly Care is a Nigerian NGO dedicated to the welfare, dignity and wellbeing of the elderly.',
  keywords: ['elderly care Nigeria', 'caregivers Lagos', 'home nursing services', 'geriatric care'],
  openGraph: {
    title: 'OYAIB Elderly Care',
    description: 'OYAIB Elderly Care is a Nigerian NGO dedicated to the welfare, dignity and wellbeing of the elderly.',
    url: 'https://oyaibelderlycare.com.ng',
    siteName: 'OYAIB Elderly Care',
    locale: 'en_NG',
    type: 'website',
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">{children}</body>
    </html>
  );
}