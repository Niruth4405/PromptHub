import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Generic response to prevent email enumeration
    const GENERIC_RESPONSE = NextResponse.json(
      { message: "If that email is registered, you will receive an OTP shortly." },
      { status: 200 }
    );

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // If user doesn't exist or has no password (OAuth-only user), return generic
    if (!user || !user.passwordHash) return GENERIC_RESPONSE;

    // Rate limit: check if an OTP was issued within the last 60 seconds
    const recentOtp = await prisma.passwordResetOtp.findFirst({
      where: {
        userId: user.id,
        used: false,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (recentOtp) {
      return NextResponse.json(
        { error: "Please wait 60 seconds before requesting another OTP." },
        { status: 429 }
      );
    }

    // Invalidate all previous unused OTPs for this user
    await prisma.passwordResetOtp.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.passwordResetOtp.create({
      data: {
        userId: user.id,
        email: normalizedEmail,
        otpHash,
        expiresAt,
      },
    });

    await resend.emails.send({
      from: "PromptHub <noreply@yourdomain.com>",
      to: normalizedEmail,
      subject: "Your PromptHub Password Reset OTP",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #a855f7, #06b6d4);"></div>
            <span style="font-weight: 600; font-size: 18px;">PromptHub</span>
          </div>
          <h2 style="margin: 0 0 8px; font-size: 22px;">Reset your password</h2>
          <p style="color: #94a3b8; margin: 0 0 24px;">Use the OTP below to reset your password. It expires in <strong style="color: #e2e8f0;">10 minutes</strong>.</p>
          <div style="background: #1e293b; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #a855f7;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 13px; margin: 0;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
      `,
    });

    return GENERIC_RESPONSE;
  } catch (error) {
    console.error("[forgot-password]:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
