import { NextResponse } from "next/server";
import { getNotesSession } from "@/lib/auth";

export async function GET() {
  const session = await getNotesSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      userId: session.userId,
      username: session.username,
    },
  });
}
