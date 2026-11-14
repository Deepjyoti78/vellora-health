import type { Metadata, Viewport } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import './globals.css';
import { BookingProvider } from '@/context/BookingContext';
import { AuthProvider } from '@/context/AuthContext';
import { BookingModal } from '@/components/common/BookingModal';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';

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
  title: 'Vellora Health | Complete Healthcare Platform',
  description:
    'Comprehensive healthcare platform connecting patients, licensed physicians, nurses, caretakers, and diagnostic phlebotomy at home.',
  icons: {
    icon: '/assets/favicon.svg',
  },
  openGraph: {
    title: 'Vellora Health | Complete Healthcare Platform',
    description:
      'Accessible, modern medical care — where technology meets compassion. Discover services, book visits, and manage health records.',
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
        <AuthProvider>
          <BookingProvider>
            {children}
            <BookingModal />
            <RoleSwitcher />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
