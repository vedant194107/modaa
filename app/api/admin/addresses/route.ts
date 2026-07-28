import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export const dynamic = "force-dynamic";

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

    const dbAddresses = await query(sqlQuery, [...params]);
    
    // Map DB fields back to frontend expected fields
    const addresses = dbAddresses.map((a: any) => {
      let line1 = a.street || a.line1 || "";
      let line2 = a.line2 || "";
      if (a.street && a.street.includes("\n")) {
        const parts = a.street.split("\n");
        line1 = parts[0];
        line2 = parts.slice(1).join("\n");
      }
      return {
        ...a,
        line1,
        line2,
        zip: a.pincode || a.zip || "",
        isDefault: a.is_default === 1 || a.is_default === true
      };
    });

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
    const street = [line1, line2].filter(Boolean).join("\n");

    // If setting as default, un-default existing addresses for this user
    if (is_default) {
      await query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [user_id]);
    }

    try {
      await query(`
        INSERT INTO addresses (id, user_id, label, name, street, city, state, pincode, country, phone, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        addrId,
        user_id,
        label || "Home",
        name,
        street,
        city,
        state || "",
        zip || "",
        country || "India",
        phone || "+91 98765 43210",
        is_default ? 1 : 0
      ]);
    } catch (err: any) {
      if (err.message.includes("column") || err.message.includes("NOT NULL")) {
        // Fallback for legacy DB schema that doesn't have street/pincode
        await query(`
          INSERT INTO addresses (id, user_id, label, name, line1, line2, city, state, zip, country, phone, is_default)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          addrId,
          user_id,
          label || "Home",
          name,
          line1 || "",
          line2 || "",
          city,
          state || "",
          zip || "",
          country || "India",
          phone || "+91 98765 43210",
          is_default ? 1 : 0
        ]);
      } else {
        throw err;
      }
    }

    return NextResponse.json({ success: true, message: "Address saved to database successfully.", addressId: addrId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, user_id, label, name, line1, line2, city, state, zip, country, phone, is_default } = body;

    if (!id || !user_id) {
      return NextResponse.json({ success: false, error: "Address ID and User ID required." }, { status: 400 });
    }

    if (is_default) {
      await query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [user_id]);
    }

    const street = [line1, line2].filter(Boolean).join("\n");

    try {
      await query(`
        UPDATE addresses 
        SET label = ?, name = ?, street = ?, city = ?, state = ?, pincode = ?, country = ?, phone = ?, is_default = ?
        WHERE id = ? AND user_id = ?
      `, [
        label || "Home",
        name,
        street,
        city,
        state || "",
        zip || "",
        country || "India",
        phone || "+91 98765 43210",
        is_default ? 1 : 0,
        id,
        user_id
      ]);
    } catch (err: any) {
      if (err.message.includes("column") || err.message.includes("no such")) {
        await query(`
          UPDATE addresses 
          SET label = ?, name = ?, line1 = ?, line2 = ?, city = ?, state = ?, zip = ?, country = ?, phone = ?, is_default = ?
          WHERE id = ? AND user_id = ?
        `, [
          label || "Home",
          name,
          line1 || "",
          line2 || "",
          city,
          state || "",
          zip || "",
          country || "India",
          phone || "+91 98765 43210",
          is_default ? 1 : 0,
          id,
          user_id
        ]);
      } else {
        throw err;
      }
    }

    return NextResponse.json({ success: true, message: "Address updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json({ success: false, error: "Address ID and User ID required." }, { status: 400 });
    }

    await query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [id, userId]);

    // Make oldest remaining address the default if they deleted the default one
    const remaining = await query("SELECT id FROM addresses WHERE user_id = ? ORDER BY created_at ASC", [userId]);
    if (remaining.length > 0) {
      const hasDefault = await queryOne("SELECT id FROM addresses WHERE user_id = ? AND is_default = 1", [userId]);
      if (!hasDefault) {
        await query("UPDATE addresses SET is_default = 1 WHERE id = ?", [remaining[0].id]);
      }
    }

    return NextResponse.json({ success: true, message: "Address deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
