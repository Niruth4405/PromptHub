import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// 🔥 Generate UNIQUE username
async function generateUsername(email: string) {
  let username;
  let exists = true;

  while (exists) {
    username =
      email.split("@")[0] +
      "_" +
      Math.floor(1000 + Math.random() * 9000);

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) exists = false;
  }

  return username!;
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // ✅ Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // ✅ Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Generate username (CRITICAL FIX)
    const username = await generateUsername(email);

    // ✅ Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        username, // ✅ REQUIRED
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("SIGNUP ERROR:", error); // 👈 ALWAYS KEEP THIS
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}