import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2/promise";

export async function PUT(
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
    const productId = Number(id);
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID." },
        { status: 400 }
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
      `UPDATE products SET title = ?, price = ?, image_url = ?, description = ? WHERE id = ?`,
      [
        title.trim(),
        numericPrice,
        image_url.trim(),
        description && typeof description === "string" ? description.trim() : "",
        productId,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
    });
  } catch (error: any) {
    console.error("PUT /api/shop/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const productId = Number(id);
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const pool = await getPool();
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [productId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE /api/shop/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
