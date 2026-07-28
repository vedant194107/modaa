import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const stmt = db.prepare("SELECT id, name, email, role, member_since, created_at FROM users ORDER BY created_at DESC");
    const users = stmt.all();

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users from database." },
      { status: 500 }
    );
  }
}
