import type { Metadata, Viewport } from 'next';
import { DM_Sans, Manrope, Playfair_Display } from 'next/font/google';
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
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
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
    <html
      lang="en"
      className={`${dmSans.variable} ${manrope.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        {process.env.NODE_ENV === 'development' && (
          <script dangerouslySetInnerHTML={{ __html: `if (['localhost','127.0.0.1'].includes(location.hostname) && location.hash.includes('figmacapture=')) { const boot = () => { document.title = new URLSearchParams(location.hash.slice(1)).get('velloracapturelabel') || document.title; const css = document.createElement('style'); css.textContent = 'nextjs-portal {display:none!important} [class*="scroll-reveal"] {opacity:1!important;transform:none!important}'; document.head.append(css); const script = document.createElement('script'); script.src = 'https://mcp.figma.com/mcp/html-to-design/capture.js'; document.head.appendChild(script); }; if (document.readyState === 'complete') boot(); else window.addEventListener('load',boot,{once:true}); }` }} />
        )}
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
