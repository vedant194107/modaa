import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function GET() {
  try {
    

    const userCount = (await queryOne("SELECT COUNT(*) as c FROM users", []) as any).c;
    const prodCount = (await queryOne("SELECT COUNT(*) as c FROM products", []) as any).c;
    const orderCount = (await queryOne("SELECT COUNT(*) as c FROM orders", []) as any).c;
    const revSum = (await queryOne("SELECT SUM(total) as s FROM orders", []) as any).s || 0;

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
