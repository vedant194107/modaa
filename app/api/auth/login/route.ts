import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Please enter your password." },
        { status: 400 }
      );
    }

    
    const cleanEmail = email.toLowerCase().trim();

    // Query user strictly from SQLite database
    const userRow = await queryOne("SELECT * FROM users WHERE email = ?", [cleanEmail]) as any;

    // Strict validation 1: User must exist in the database
    if (!userRow) {
      return NextResponse.json(
        { success: false, error: "No account found with this email. Please register first." },
        { status: 404 }
      );
    }

    // Strict validation 2: Password must match
    if (userRow.password !== password) {
      return NextResponse.json(
        { success: false, error: "Incorrect password. Please check your credentials." },
        { status: 401 }
      );
    }

    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role || "VIP Client",
      memberSince: userRow.member_since || "MAR 2024",
      isLoggedIn: true,
    };

    return NextResponse.json({
      success: true,
      user,
      message: "Authenticated successfully.",
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Authentication failed." },
      { status: 500 }
    );
  }
}
