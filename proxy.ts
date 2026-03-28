// proxy.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Skip non-protected routes early (optional but safe)
  const PROTECTED_PATHS = [
    "/shareOrEditPrompt",
    "/leaderboard",
    "/pricing",
    "/profile",
    "/explore",
  ];

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // ✅ Get token correctly (fix for production)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
    secureCookie: process.env.NODE_ENV === "production", // 🔥 important
  });

  // 🧪 Debug (remove later)
  console.log("TOKEN:", token);
  console.log("PATH:", pathname);

  // ❌ Not authenticated → redirect
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Authenticated → allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/shareOrEditPrompt/:path*",
    "/forYou/:path*",
    "/profile/:path*",
    "/explore/:path*",
  ],
};