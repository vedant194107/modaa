import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const db = getDb();
    let query = "SELECT * FROM addresses";
    let params: any[] = [];

    if (userId) {
      query += " WHERE user_id = ?";
      params.push(userId);
    }

    query += " ORDER BY is_default DESC, created_at DESC";

    const addresses = db.prepare(query).all(...params);
    return NextResponse.json({ success: true, addresses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, label, name, line1, line2, city, state, zip, country, phone, is_default } = body;

    if (!user_id || !name || !line1 || !city) {
      return NextResponse.json({ success: false, error: "Missing required address fields." }, { status: 400 });
    }

    const db = getDb();
    const addrId = `addr_${Date.now()}`;

    // If setting as default, un-default existing addresses for this user
    if (is_default) {
      db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").run(user_id);
    }

    const stmt = db.prepare(`
      INSERT INTO addresses (id, user_id, label, name, line1, line2, city, state, zip, country, phone, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      addrId,
      user_id,
      label || "Home",
      name,
      line1,
      line2 || "",
      city,
      state || "",
      zip || "",
      country || "India",
      phone || "+91 98765 43210",
      is_default ? 1 : 0
    );

    return NextResponse.json({ success: true, message: "Address saved to database successfully.", addressId: addrId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
