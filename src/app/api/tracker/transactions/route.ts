import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

// GET /api/tracker/transactions?month=MM&year=YYYY
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || "");
    const year = parseInt(searchParams.get("year") || "");

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Valid month (1-12) and year are required" },
        { status: 400 }
      );
    }

    const pool = await getPool();

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, type, amount, category, note, transaction_date, created_at
       FROM transactions
       WHERE user_id = ? AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?
       ORDER BY transaction_date DESC, created_at DESC`,
      [session.userId, month, year]
    );

    // Also fetch summary stats
    const [stats] = await pool.execute<RowDataPacket[]>(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END), 0) AS total_income,
         COALESCE(SUM(CASE WHEN type = 'withdraw' THEN amount ELSE 0 END), 0) AS total_expenses
       FROM transactions
       WHERE user_id = ? AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?`,
      [session.userId, month, year]
    );

    // Fetch all-time balance
    const [balanceRows] = await pool.execute<RowDataPacket[]>(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END), 0) -
         COALESCE(SUM(CASE WHEN type = 'withdraw' THEN amount ELSE 0 END), 0) AS total_balance
       FROM transactions
       WHERE user_id = ?`,
      [session.userId]
    );

    return NextResponse.json({
      transactions: rows,
      summary: {
        totalBalance: parseFloat(balanceRows[0].total_balance),
        totalIncome: parseFloat(stats[0].total_income),
        totalExpenses: parseFloat(stats[0].total_expenses),
      },
    });
  } catch (error) {
    console.error("GET transactions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/tracker/transactions
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, amount, category, note, transaction_date } =
      await request.json();

    if (!type || !amount || !category || !transaction_date) {
      return NextResponse.json(
        { error: "Type, amount, category, and date are required" },
        { status: 400 }
      );
    }

    if (!["deposit", "withdraw"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be 'deposit' or 'withdraw'" },
        { status: 400 }
      );
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: "Amount must be positive" },
        { status: 400 }
      );
    }

    const pool = await getPool();

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO transactions (user_id, type, amount, category, note, transaction_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [session.userId, type, amount, category, note || null, transaction_date]
    );

    return NextResponse.json(
      { id: result.insertId, message: "Transaction created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST transaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
