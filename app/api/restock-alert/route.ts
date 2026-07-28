import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function GET() {
  try {
    
    const alerts = await query("SELECT * FROM restock_alerts ORDER BY created_at DESC");
    return NextResponse.json({ success: true, count: alerts.length, alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    
    const body = await request.json();
    const { product_id, email } = body;

    if (!product_id || !email) {
      return NextResponse.json({ success: false, error: "Product ID and Email are required" }, { status: 400 });
    }

    const id = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await query(`
      INSERT INTO restock_alerts (id, product_id, email, status)
      VALUES (?, ?, ?, ?)
    `, [id, product_id, email, "PENDING"]);

    return NextResponse.json({ success: true, message: "Restock alert registered successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
