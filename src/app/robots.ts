import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/profile', '/settings', '/reset-password'],
      },
    ],
    sitemap: 'https://animecount.vercel.app/sitemap.xml',
    host: 'https://animecount.vercel.app',
  };
}
