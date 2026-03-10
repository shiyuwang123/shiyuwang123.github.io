import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'My Personal Blog',
  description: 'A minimalist personal blog built with Next.js and TypeScript',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-primary/30" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
