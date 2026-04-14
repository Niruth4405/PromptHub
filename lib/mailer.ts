import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_APP_PASSWORD!,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"PromptHub" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your PromptHub Password Reset OTP",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
          <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#a855f7,#06b6d4);"></div>
          <span style="font-weight:600;font-size:18px;">PromptHub</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;">Reset your password</h2>
        <p style="color:#94a3b8;margin:0 0 24px;">
          Use the OTP below to reset your password. It expires in
          <strong style="color:#e2e8f0;">10 minutes</strong>.
        </p>
        <div style="background:#1e293b;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px;">
          <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#a855f7;">${otp}</span>
        </div>
        <p style="color:#64748b;font-size:13px;margin:0;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  });
}