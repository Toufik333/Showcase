import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  try {
    const pool = await getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id, title, price, image_url, description, created_at FROM products ORDER BY id ASC"
    );

    // Format numerical fields
    const products = rows.map((p) => ({
      ...p,
      price: parseFloat(p.price),
    }));

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("GET /api/shop/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
