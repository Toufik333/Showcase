import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { comparePassword, signToken, createSessionCookie } from "@/lib/auth";
import type { RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const pool = await getPool();

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id, password_hash FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const user = rows[0];
    const valid = await comparePassword(password, user.password_hash);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await signToken(user.id);
    const cookie = createSessionCookie(token);

    const response = NextResponse.json(
      { message: "Logged in successfully" },
      { status: 200 }
    );
    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
