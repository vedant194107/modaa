import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const stmt = db.prepare("SELECT * FROM restock_alerts ORDER BY created_at DESC");
    const alerts = stmt.all();
    return NextResponse.json({ success: true, count: alerts.length, alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { product_id, email } = body;

    if (!product_id || !email) {
      return NextResponse.json({ success: false, error: "Product ID and Email are required" }, { status: 400 });
    }

    const id = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const stmt = db.prepare(`
      INSERT INTO restock_alerts (id, product_id, email, status)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, product_id, email, "PENDING");

    return NextResponse.json({ success: true, message: "Restock alert registered successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
