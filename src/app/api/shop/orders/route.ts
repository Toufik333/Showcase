import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import type { ResultSetHeader } from "mysql2/promise";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, phone, location, email, items } = body;

    // Validate mandatory fields
    if (!customer_name || typeof customer_name !== "string" || !customer_name.trim()) {
      return NextResponse.json(
        { success: false, error: "Full Name is required." },
        { status: 400 }
      );
    }
    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 }
      );
    }
    if (!location || typeof location !== "string" || !location.trim()) {
      return NextResponse.json(
        { success: false, error: "Address / Location is required." },
        { status: 400 }
      );
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty. Please add items before checking out." },
        { status: 400 }
      );
    }

    // Calculate total amount & sanitize items
    let total_amount = 0;
    const sanitizedItems = [];

    for (const item of items) {
      const productId = Number(item.product_id);
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price_at_purchase) || 0;

      if (!productId || qty <= 0 || price < 0) {
        return NextResponse.json(
          { success: false, error: "Invalid item details in cart." },
          { status: 400 }
        );
      }

      total_amount += price * qty;
      sanitizedItems.push({
        product_id: productId,
        quantity: qty,
        price_at_purchase: price,
      });
    }

    const pool = await getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [orderResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO orders (customer_name, phone, location, email, total_amount, payment_method, status) 
         VALUES (?, ?, ?, ?, ?, 'Cash on Delivery', 'pending')`,
        [
          customer_name.trim(),
          phone.trim(),
          location.trim(),
          email && typeof email === "string" ? email.trim() : null,
          total_amount,
        ]
      );

      const orderId = orderResult.insertId;

      for (const item of sanitizedItems) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price_at_purchase]
        );
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
        orderId,
        total_amount,
        message: "Order placed successfully!",
      });
    } catch (dbErr) {
      await connection.rollback();
      throw dbErr;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("POST /api/shop/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
