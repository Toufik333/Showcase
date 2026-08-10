import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { hashPassword, signToken, createSessionCookie } from "@/lib/auth";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { error: "Username must be between 3 and 50 characters" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const pool = await getPool();

    // Check if username already exists
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [username, passwordHash]
    );

    const token = await signToken(result.insertId);
    const cookie = createSessionCookie(token);

    const response = NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
