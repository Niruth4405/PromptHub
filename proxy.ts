// proxy.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = [
  "/shareOrEditPrompt",
  "/leaderboard",
  "/pricing",
  "/profile",
  "/explore",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isProtected) return NextResponse.next();

  console.log("SECRET:", process.env.NEXTAUTH_SECRET);
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
 

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/shareOrEditPrompt/:path*",
    "/leaderboard/:path*",
    "/pricing/:path*",
    "/profile/:path*",
    "/explore/:path*",
  ],
};