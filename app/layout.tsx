import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ReduxProvider from './providers/ReduxProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mojanime - Premium Anime Streaming',
  description: 'Discover and watch your favorite anime series and movies in high quality. Stream the latest episodes and classic series.',
  keywords: 'anime, streaming, manga, japanese animation, watch anime online',
  authors: [{ name: 'Mojanime Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ReduxProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}