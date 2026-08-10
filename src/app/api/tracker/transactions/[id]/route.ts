import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

// PUT /api/tracker/transactions/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const transactionId = parseInt(id);
    const { type, amount, category, note, transaction_date } =
      await request.json();

    const pool = await getPool();

    // Verify ownership
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM transactions WHERE id = ? AND user_id = ?",
      [transactionId, session.userId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    await pool.execute<ResultSetHeader>(
      `UPDATE transactions
       SET type = ?, amount = ?, category = ?, note = ?, transaction_date = ?
       WHERE id = ? AND user_id = ?`,
      [
        type,
        amount,
        category,
        note || null,
        transaction_date,
        transactionId,
        session.userId,
      ]
    );

    return NextResponse.json({ message: "Transaction updated" });
  } catch (error) {
    console.error("PUT transaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/tracker/transactions/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const transactionId = parseInt(id);

    const pool = await getPool();

    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM transactions WHERE id = ? AND user_id = ?",
      [transactionId, session.userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("DELETE transaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
