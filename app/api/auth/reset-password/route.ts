import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const record = await prisma.passwordResetOtp.findFirst({
      where: {
        email: normalizedEmail,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { error: "OTP is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(otp.toString(), record.otpHash);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid OTP." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password & invalidate ALL OTPs for this user atomically
    await prisma.$transaction([
      prisma.user.update({
        where: { email: normalizedEmail },
        data: { passwordHash },
      }),
      prisma.passwordResetOtp.updateMany({
        where: { email: normalizedEmail },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ message: "Password reset successfully." }, { status: 200 });
  } catch (error) {
    console.error("[reset-password]:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
