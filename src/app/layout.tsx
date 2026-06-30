import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://animecount.vercel.app'),
  title: {
    default: 'AnimeCount — Track Your Anime Watch Time',
    template: '%s | AnimeCount',
  },
  description:
    'AnimeCount is a free, minimal anime watch time tracker. Count every episode, hour, and day you have spent watching anime. Track your lifetime anime stats elegantly.',
  keywords: [
    'anime watch time tracker',
    'animecount',
    'anime time counter',
    'count anime episodes',
    'anime hours tracker',
    'anime watchlist',
    'anime stats',
    'how much time spent watching anime',
    'anime tracker',
    'anime episode counter',
    'lifetime anime stats',
    'anime time calculator',
    'anime progress tracker',
  ],
  authors: [{ name: 'AnimeCount', url: 'https://animecount.vercel.app' }],
  creator: 'AnimeCount',
  publisher: 'AnimeCount',
  category: 'Entertainment',
  applicationName: 'AnimeCount',
  alternates: {
    canonical: 'https://animecount.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'AnimeCount — Track Your Anime Watch Time',
    description:
      'Free minimal anime watch time tracker. Count every episode and hour spent watching anime. See your lifetime stats at a glance.',
    url: 'https://animecount.vercel.app',
    siteName: 'AnimeCount',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnimeCount — Track Your Anime Watch Time',
    description:
      'Free minimal anime watch time tracker. Count every episode and hour spent watching anime.',
    creator: '@animecount',
    site: '@animecount',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('animecount-theme') || 'dark';
              document.documentElement.classList.add(theme);
              if (theme === 'light') document.documentElement.classList.remove('dark');
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800 selection:text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
