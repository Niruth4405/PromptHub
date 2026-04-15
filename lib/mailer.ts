// lib/mailer.ts
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const mailFrom = process.env.MAIL_FROM;

const resend = new Resend(resendApiKey || "");

export async function sendOtpEmail(to: string, otp: string) {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!mailFrom) {
    throw new Error("MAIL_FROM is not configured.");
  }

  const subject = "Your PromptHub password reset code";

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a;">
      <h2 style="margin-bottom: 12px;">Password reset code</h2>
      <p style="margin-bottom: 8px;">Your PromptHub password reset code is:</p>
      <p style="font-size: 24px; font-weight: 700; letter-spacing: 0.25em; margin: 16px 0;">
        ${otp}
      </p>
      <p style="margin-bottom: 4px;">This code will expire in 10 minutes.</p>
      <p style="font-size: 13px; color: #6b7280; margin-top: 16px;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;

  const response = await resend.emails.send({
    from: mailFrom,
    to,
    subject,
    html,
  });

  console.log("[sendOtpEmail] Resend response:", JSON.stringify(response, null, 2));

  if (response.error) {
    console.error(
      "[sendOtpEmail] Resend error raw:",
      JSON.stringify(response.error, null, 2)
    );
    throw new Error("Failed to send OTP email.");
  }
}