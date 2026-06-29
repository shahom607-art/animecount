import nodemailer from 'nodemailer';
import { getVerificationEmailHtml, getResetPasswordEmailHtml, getWelcomeEmailHtml } from '@/emails/templates';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail({ to, url, name }: { to: string; url: string; name?: string }) {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log(`[DEV MODE] Verification URL for ${to}: ${url}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'AniTime <noreply@animetime.app>',
    to,
    subject: 'Verify your AniTime account',
    html: getVerificationEmailHtml(url, name),
  });
}

export async function sendResetPasswordEmail({ to, url }: { to: string; url: string }) {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log(`[DEV MODE] Reset Password URL for ${to}: ${url}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'AniTime <noreply@animetime.app>',
    to,
    subject: 'Reset your AniTime password',
    html: getResetPasswordEmailHtml(url),
  });
}

export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log(`[DEV MODE] Welcome email triggered for ${to}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'AniTime <noreply@animetime.app>',
    to,
    subject: 'Welcome to AniTime!',
    html: getWelcomeEmailHtml(name),
  });
}
