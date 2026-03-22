// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PATHS = ["/shareOrEditPrompt", "/leaderboard", "/pricing", "/profile", "/explore"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // only guard configured paths
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!isProtected) return NextResponse.next();

  // check authjs session cookie (Auth.js / NextAuth style)
  const sessionToken =
    req.cookies.get("authjs.session-token") ??
    req.cookies.get("__Secure-authjs.session-token");

  if (!sessionToken) {
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
