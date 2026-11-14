import type { Metadata, Viewport } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import './globals.css';
import { BookingProvider } from '@/context/BookingContext';
import { BookingModal } from '@/components/common/BookingModal';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vellora Health | Exceptional Healthcare, Always',
  description:
    'Vellora Health — exceptional healthcare, always. Discover services, specialties, doctors, facilities, and personalized care.',
  icons: {
    icon: '/assets/favicon.svg',
  },
  openGraph: {
    title: 'Vellora Health | Exceptional Healthcare, Always',
    description:
      'Accessible, modern medical care — where technology meets compassion. Discover services, specialties, doctors, and facilities.',
    siteName: 'Vellora Health',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#101b1d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <BookingProvider>
          {children}
          <BookingModal />
        </BookingProvider>
      </body>
    </html>
  );
}
