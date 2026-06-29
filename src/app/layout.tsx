import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AniTime — Minimal Anime Watch Time Tracker',
  description: 'Count every minute you spent watching anime with an elegant, modern, and high-performance tracker.',
  openGraph: {
    title: 'AniTime — Minimal Anime Watch Time Tracker',
    description: 'Count every minute you spent watching anime.',
    url: 'https://animetime.app',
    siteName: 'AniTime',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AniTime — Anime Watch Time Tracker',
    description: 'Minimalist lifetime anime stats calculation.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800 selection:text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
