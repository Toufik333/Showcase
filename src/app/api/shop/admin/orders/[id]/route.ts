import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2/promise";

const VALID_STATUSES = ["pending", "shipped", "done", "cancelled"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const orderId = Number(id);
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Invalid Order ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const pool = await getPool();
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order #${orderId} status updated to '${status}'`,
    });
  } catch (error: any) {
    console.error("PATCH /api/shop/admin/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status." },
      { status: 500 }
    );
  }
}
