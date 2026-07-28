import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();

    const userCount = (db.prepare("SELECT COUNT(*) as c FROM users").get() as any).c;
    const prodCount = (db.prepare("SELECT COUNT(*) as c FROM products").get() as any).c;
    const orderCount = (db.prepare("SELECT COUNT(*) as c FROM orders").get() as any).c;
    const revSum = (db.prepare("SELECT SUM(total) as s FROM orders").get() as any).s || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalProducts: prodCount,
        totalOrders: orderCount,
        totalRevenue: revSum,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch stats." },
      { status: 500 }
    );
  }
}
