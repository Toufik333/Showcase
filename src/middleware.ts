import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-money-tracker-2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /tracker/dashboard routes
  if (pathname.startsWith("/tracker/dashboard")) {
    const token = request.cookies.get("tracker_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/tracker/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/tracker/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tracker/dashboard/:path*"],
};
