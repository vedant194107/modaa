import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    

    // Check if email already registered
    const existing = await queryOne("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email is already registered. Please sign in." },
        { status: 409 }
      );
    }

    const userId = `usr_${Date.now()}`;
    await query(`
      INSERT INTO users (id, name, email, password, role, member_since)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      userId,
      name.trim(),
      email.toLowerCase().trim(),
      password,
      "VIP Client",
      "JUL 2025"
    ]);

    const user = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: "VIP Client",
      memberSince: "JUL 2025",
      isLoggedIn: true,
    };

    return NextResponse.json({
      success: true,
      user,
      message: "User account created successfully in SQLite database.",
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create user in database." },
      { status: 500 }
    );
  }
}
