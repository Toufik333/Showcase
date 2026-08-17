import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const pool = await getPool();

    // Fetch all orders sorted newest first
    const [orderRows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, customer_name, phone, location, email, total_amount, payment_method, status, created_at 
       FROM orders 
       ORDER BY created_at DESC`
    );

    // Fetch all order items with product titles
    const [itemRows] = await pool.execute<RowDataPacket[]>(
      `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price_at_purchase, p.title as product_title
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id`
    );

    // Group items by order_id
    const itemsByOrder: Record<number, any[]> = {};
    for (const item of itemRows) {
      if (!itemsByOrder[item.order_id]) {
        itemsByOrder[item.order_id] = [];
      }
      itemsByOrder[item.order_id].push({
        id: item.id,
        product_id: item.product_id,
        product_title: item.product_title || `Product #${item.product_id}`,
        quantity: item.quantity,
        price_at_purchase: parseFloat(item.price_at_purchase),
      });
    }

    const orders = orderRows.map((o) => ({
      id: o.id,
      customer_name: o.customer_name,
      phone: o.phone,
      location: o.location,
      email: o.email,
      total_amount: parseFloat(o.total_amount),
      payment_method: o.payment_method,
      status: o.status,
      created_at: o.created_at,
      items: itemsByOrder[o.id] || [],
    }));

    return NextResponse.json({
      success: true,
      adminId: session.adminId,
      orders,
    });
  } catch (error: any) {
    console.error("GET /api/shop/admin/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
