import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is not set. " +
    "Please set a strong random secret (64+ characters) in your .env file or cPanel environment variables."
  );
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /shop/admin/dashboard routes
  if (pathname.startsWith("/shop/admin/dashboard")) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/shop/admin/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (!payload.adminId) {
        return NextResponse.redirect(new URL("/shop/admin/login", request.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/shop/admin/login", request.url));
    }
  }

  // Protect /tracker/dashboard routes
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
  matcher: ["/tracker/dashboard/:path*", "/shop/admin/dashboard/:path*"],
};
