import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    
    let sqlQuery = "SELECT * FROM addresses";
    let params: any[] = [];

    if (userId) {
      sqlQuery += " WHERE user_id = ?";
      params.push(userId);
    }

    sqlQuery += " ORDER BY is_default DESC, created_at DESC";

    const addresses = await query(sqlQuery, [...params]);
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

    
    const addrId = `addr_${Date.now()}`;

    // If setting as default, un-default existing addresses for this user
    if (is_default) {
      await query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [user_id]);
    }

    await query(`
      INSERT INTO addresses (id, user_id, label, name, line1, line2, city, state, zip, country, phone, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
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
    ]);

    return NextResponse.json({ success: true, message: "Address saved to database successfully.", addressId: addrId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
