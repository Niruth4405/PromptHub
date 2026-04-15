import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/mailer";

const GENERIC_MESSAGE = "If that email exists, we sent a reset code.";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: GENERIC_MESSAGE },
        { status: 200 }
      );
    }

    const recentOtp = await prisma.passwordResetOtp.findFirst({
      where: {
        email: normalizedEmail,
        used: false,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (recentOtp) {
      return NextResponse.json(
        { error: "Please wait 60 seconds before requesting another OTP." },
        { status: 429 }
      );
    }

    await prisma.passwordResetOtp.updateMany({
      where: {
        email: normalizedEmail,
        used: false,
      },
      data: {
        used: true,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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

    return NextResponse.json(
      { message: GENERIC_MESSAGE },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FORGOT_PASSWORD_POST_ERROR]", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}