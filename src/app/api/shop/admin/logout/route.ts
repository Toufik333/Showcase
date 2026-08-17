import { NextResponse } from "next/server";
import { deleteAdminSessionCookie } from "@/lib/auth";

export async function POST() {
  const cookie = deleteAdminSessionCookie();
  const response = NextResponse.json({ success: true });
  response.cookies.set(cookie);
  return response;
}
