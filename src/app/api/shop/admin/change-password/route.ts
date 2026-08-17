import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminSession, comparePassword, hashPassword } from "@/lib/auth";
import type { RowDataPacket } from "mysql2/promise";

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const pool = await getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id, admin_id, password_hash FROM admins WHERE admin_id = ?",
      [session.adminId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Admin account not found." },
        { status: 404 }
      );
    }

    const admin = rows[0];
    const isCurrentValid = await comparePassword(currentPassword, admin.password_hash);

    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect current password." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);

    await pool.execute(
      "UPDATE admins SET password_hash = ? WHERE admin_id = ?",
      [newHash, session.adminId]
    );

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error: any) {
    console.error("POST /api/shop/admin/change-password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to change password." },
      { status: 500 }
    );
  }
}
