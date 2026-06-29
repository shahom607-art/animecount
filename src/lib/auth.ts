import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail, sendResetPasswordEmail, sendWelcomeEmail } from '@/lib/email';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true for strict production email verification
    async sendResetPassword({ user, url }) {
      await sendResetPasswordEmail({ to: user.email, url });
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
