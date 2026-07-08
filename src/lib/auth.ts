import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail, sendResetPasswordEmail, sendWelcomeEmail } from '@/lib/email';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.NEXTAUTH_SECRET || process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword({ user, url }) {
      // Ensure the reset URL always uses the correct production domain
      const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
      const fixedUrl = url.replace(/^https?:\/\/[^/]+/, baseUrl.replace(/\/$/, ''));
      await sendResetPasswordEmail({ to: user.email, url: fixedUrl });
    },
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      await sendVerificationEmail({ to: user.email, url, name: user.name || undefined });
    },
  },
  user: {
    additionalFields: {},
  },
});
