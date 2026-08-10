import { NextResponse } from "next/server";
import { deleteSessionCookie } from "@/lib/auth";

export async function POST() {
  const cookie = deleteSessionCookie();
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
  response.cookies.set(cookie);
  return response;
}
