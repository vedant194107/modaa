import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");

    const db = getDb();

    if (id) {
      const stmt = db.prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?");
      const order = stmt.get(id, id);
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    if (userId) {
      // Find user by ID or email first
      const userStmt = db.prepare("SELECT * FROM users WHERE id = ? OR email = ?");
      const user = userStmt.get(userId, userId) as { id: string } | undefined;

      const targetId = user ? user.id : userId;

      const stmt = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
      const orders = stmt.all(targetId);

      return NextResponse.json({ success: true, orders });
    }

    // Fetch all orders
    const stmt = db.prepare("SELECT * FROM orders ORDER BY created_at DESC");
    const orders = stmt.all();

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Order ID and status are required." }, { status: 400 });
    }

    const db = getDb();
    const stmt = db.prepare("UPDATE orders SET status = ? WHERE id = ? OR order_number = ?");
    stmt.run(status.toUpperCase(), id, id);

    return NextResponse.json({ success: true, message: "Order status updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
