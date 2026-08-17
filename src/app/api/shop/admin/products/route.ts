import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2/promise";

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
    const { title, price, image_url, description } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Product title is required." },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { success: false, error: "Valid product price is required." },
        { status: 400 }
      );
    }

    if (!image_url || typeof image_url !== "string" || !image_url.trim()) {
      return NextResponse.json(
        { success: false, error: "Image URL is required." },
        { status: 400 }
      );
    }

    const pool = await getPool();
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO products (title, price, image_url, description) VALUES (?, ?, ?, ?)`,
      [
        title.trim(),
        numericPrice,
        image_url.trim(),
        description && typeof description === "string" ? description.trim() : "",
      ]
    );

    return NextResponse.json({
      success: true,
      productId: result.insertId,
      message: "Product created successfully.",
    });
  } catch (error: any) {
    console.error("POST /api/shop/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product." },
      { status: 500 }
    );
  }
}
