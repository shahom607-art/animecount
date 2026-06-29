export function getVerificationEmailHtml(url: string, name?: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 40px 20px; }
    .container { max-width: 500px; margin: 0 auto; background: #18181b; border-radius: 16px; padding: 32px; border: 1px solid #27272a; }
    .logo { font-size: 24px; font-weight: 700; tracking: -0.05em; color: #ffffff; margin-bottom: 24px; text-align: center; }
    .title { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #f4f4f5; }
    .text { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px; }
    .button { display: block; width: 100%; padding: 14px 0; background-color: #ffffff; color: #09090b; text-align: center; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 10px; box-sizing: border-box; }
    .footer { margin-top: 32px; text-align: center; font-size: 12px; color: #71717a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">AnimeCount</div>
    <div class="title">Verify your email address</div>
    <div class="text">Hello ${name || 'there'}, welcome to AnimeCount. Please click the button below to verify your email and activate your account.</div>
    <a href="${url}" class="button">Verify Email</a>
    <div class="footer">If you did not request this email, you can safely ignore it.</div>
  </div>
</body>
</html>
  `;
}

export function getResetPasswordEmailHtml(url: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 40px 20px; }
    .container { max-width: 500px; margin: 0 auto; background: #18181b; border-radius: 16px; padding: 32px; border: 1px solid #27272a; }
    .logo { font-size: 24px; font-weight: 700; tracking: -0.05em; color: #ffffff; margin-bottom: 24px; text-align: center; }
    .title { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #f4f4f5; }
    .text { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px; }
    .button { display: block; width: 100%; padding: 14px 0; background-color: #ffffff; color: #09090b; text-align: center; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 10px; box-sizing: border-box; }
    .footer { margin-top: 32px; text-align: center; font-size: 12px; color: #71717a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">AnimeCount</div>
    <div class="title">Reset your password</div>
    <div class="text">We received a request to reset your AnimeCount account password. Click below to choose a new password.</div>
    <a href="${url}" class="button">Reset Password</a>
    <div class="footer">If you did not request a password reset, please ignore this message.</div>
  </div>
</body>
</html>
  `;
}

export function getWelcomeEmailHtml(name: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 40px 20px; }
    .container { max-width: 500px; margin: 0 auto; background: #18181b; border-radius: 16px; padding: 32px; border: 1px solid #27272a; }
    .logo { font-size: 24px; font-weight: 700; tracking: -0.05em; color: #ffffff; margin-bottom: 24px; text-align: center; }
    .title { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #f4f4f5; }
    .text { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px; }
    .footer { margin-top: 32px; text-align: center; font-size: 12px; color: #71717a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">AnimeCount</div>
    <div class="title">Welcome to AnimeCount, ${name}!</div>
    <div class="text">Thank you for joining AnimeCount — the minimal, elegant anime watch time tracker. Start adding your favorite series and watch your lifetime statistics accumulate automatically.</div>
    <div class="footer">Happy tracking!</div>
  </div>
</body>
</html>
  `;
}
