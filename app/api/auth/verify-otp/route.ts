import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
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

    if (record.attempts >= MAX_ATTEMPTS) {
      await prisma.passwordResetOtp.update({
        where: { id: record.id },
        data: { used: true },
      });
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    const isMatch = await bcrypt.compare(otp.toString(), record.otpHash);

    if (!isMatch) {
      await prisma.passwordResetOtp.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      const remaining = MAX_ATTEMPTS - record.attempts - 1;
      return NextResponse.json(
        { error: `Incorrect OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` },
        { status: 400 }
      );
    }

    // OTP is valid — do NOT mark used yet, let reset-password route do that
    return NextResponse.json({ message: "OTP verified successfully." }, { status: 200 });
  } catch (error) {
    console.error("[verify-otp]:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
