type SendPasswordResetEmailArgs = {
  to: string;
  resetUrl: string;
};

function emailFrom() {
  return process.env.DOGLOG_EMAIL_FROM || 'Doglog <onboarding@resend.dev>';
}

export async function sendPasswordResetEmail({ to, resetUrl }: SendPasswordResetEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Password reset email not sent: RESEND_API_KEY is not configured.');
    return { sent: false };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailFrom(),
      to,
      subject: 'Reset your Doglog password',
      html: `
        <p>You asked to reset your Doglog password.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>
      `,
      text: `Reset your Doglog password: ${resetUrl}\n\nThis link expires in 30 minutes. If you did not request this, you can ignore this email.`,
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(`Resend password reset email failed: ${response.status} ${message}`);
  }

  return { sent: true };
}
