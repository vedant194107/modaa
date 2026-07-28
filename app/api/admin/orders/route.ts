import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");

    

    if (id) {
      const order = await queryOne("SELECT * FROM orders WHERE id = ? OR order_number = ?", [id, id]);
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    if (userId) {
      // Find user by ID or email first
      const user = await queryOne("SELECT * FROM users WHERE id = ? OR email = ?", [userId, userId]) as { id: string } | undefined;

      const targetId = user ? user.id : userId;

      const orders = await query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [targetId]);

      return NextResponse.json({ success: true, orders });
    }

    // Fetch all orders
    const orders = await query("SELECT * FROM orders ORDER BY created_at DESC");

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

    
    await query("UPDATE orders SET status = ? WHERE id = ? OR order_number = ?", [status.toUpperCase(), id, id]);

    return NextResponse.json({ success: true, message: "Order status updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
