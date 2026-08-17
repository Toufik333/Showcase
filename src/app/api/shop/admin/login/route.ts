import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { comparePassword, signAdminToken, createAdminSessionCookie } from "@/lib/auth";
import type { RowDataPacket } from "mysql2/promise";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { admin_id, password } = body;

    if (!admin_id || !password) {
      return NextResponse.json(
        { success: false, error: "Admin ID and Password are required." },
        { status: 400 }
      );
    }

    const pool = await getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id, admin_id, password_hash FROM admins WHERE admin_id = ?",
      [admin_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid Admin ID or Password." },
        { status: 401 }
      );
    }

    const admin = rows[0];
    const isValid = await comparePassword(password, admin.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid Admin ID or Password." },
        { status: 401 }
      );
    }

    const token = await signAdminToken(admin.admin_id);
    const cookie = createAdminSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      admin: { admin_id: admin.admin_id },
    });

    response.cookies.set(cookie);
    return response;
  } catch (error: any) {
    console.error("POST /api/shop/admin/login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
