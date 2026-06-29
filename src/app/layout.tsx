import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AnimeCount — Minimal Anime Watch Time Tracker',
  description: 'Count every minute you spent watching anime with an elegant, modern, and high-performance tracker.',
  openGraph: {
    title: 'AnimeCount — Minimal Anime Watch Time Tracker',
    description: 'Count every minute you spent watching anime.',
    url: 'https://animetime.app',
    siteName: 'AnimeCount',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnimeCount — Anime Watch Time Tracker',
    description: 'Minimalist lifetime anime stats calculation.',
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
              document.documentElement.classList.remove('dark', 'light');
              document.documentElement.classList.add(theme);
              if (theme === 'light') {
                document.body && (document.body.style.backgroundColor = '#ffffff');
              }
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
