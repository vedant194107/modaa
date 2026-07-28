import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    

    if (code) {
      const cleanCode = code.trim().toUpperCase();
      const coupon = await queryOne("SELECT * FROM coupons WHERE code = ? AND status = 'ACTIVE'", [cleanCode]) as any;

      if (!coupon) {
        return NextResponse.json({ success: false, error: "Invalid or expired promo code." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: Number(coupon.value),
          minSpend: Number(coupon.min_spend),
          status: coupon.status,
        },
      });
    }

    const coupons = await query("SELECT * FROM coupons ORDER BY created_at DESC", []);
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, type, value, minSpend } = body;

    if (!code || !code.trim() || value === undefined) {
      return NextResponse.json({ success: false, error: "Promo code and discount value are required." }, { status: 400 });
    }

    
    const cleanCode = code.trim().toUpperCase();
    const couponId = `c_${Date.now()}`;

    await query(`
      INSERT INTO coupons (id, code, type, value, min_spend, status)
      VALUES (?, ?, ?, ?, ?, 'ACTIVE')
    `, [
      couponId,
      cleanCode,
      type === "FLAT" ? "FLAT" : "PERCENTAGE",
      parseFloat(value),
      minSpend ? parseFloat(minSpend) : 0
    ]);

    return NextResponse.json({ success: true, message: "Promo coupon created successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Coupon ID is required." }, { status: 400 });
    }

    
    await query("DELETE FROM coupons WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Promo coupon deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
