import { NextResponse } from "next/server";
import { deleteNotesSessionCookie } from "@/lib/auth";

export async function POST() {
  const cookie = deleteNotesSessionCookie();
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );
  response.cookies.set(cookie);
  return response;
}
