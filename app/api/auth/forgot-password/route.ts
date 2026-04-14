import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/mailer";

const GENERIC_RESPONSE = NextResponse.json(
  { message: "If that email exists, we sent a reset code." },
  { status: 200 }
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) return GENERIC_RESPONSE;

    // Rate-limit: only allow resend after 60 seconds
    const recent = await prisma.passwordResetOtp.findFirst({
      where: {
        email: normalizedEmail,
        used: false,
        createdAt: { gte: new Date(Date.now() - 60_000) },
      },
    });
    if (recent) {
      return NextResponse.json(
        { error: "Please wait 60 seconds before requesting another OTP." },
        { status: 429 }
      );
    }

    // Invalidate all old OTPs for this email
    await prisma.passwordResetOtp.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    });

    // Generate and hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.passwordResetOtp.create({
      data: {
        userId: user.id,
        email: normalizedEmail,
        otpHash,
        expiresAt,
        used: false,
        attempts: 0,
      },
    });

    await sendOtpEmail(normalizedEmail, otp);
    return GENERIC_RESPONSE;
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}