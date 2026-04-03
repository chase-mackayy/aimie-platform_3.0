import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'AImie Solutions – AI Voice Receptionist for Australian Businesses',
  description: 'Never miss a call again. AImie answers every call 24/7, books appointments in real time, and sounds indistinguishable from your best receptionist.',
  icons: { icon: '/logo-icon.jpeg' },
  metadataBase: new URL('https://aimiesolutions.com.au'),
  openGraph: {
    title: 'AImie Solutions – AI Voice Receptionist for Australian Businesses',
    description: 'Never miss a call again. AImie answers every call 24/7, books appointments in real time, and sounds indistinguishable from your best receptionist.',
    siteName: 'AImie Solutions',
    locale: 'en_AU',
    type: 'website',
    images: [{ url: '/og-image.jpeg', width: 1200, height: 630, alt: 'AImie Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AImie Solutions – AI Voice Receptionist',
    description: 'Never miss a call again. 24/7 AI receptionist for Australian businesses.',
    images: ['/og-image.jpeg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body style={{ fontFamily: `var(${GeistSans.variable}), system-ui, sans-serif` }}>
        {children}
      </body>
    </html>
  );
}
