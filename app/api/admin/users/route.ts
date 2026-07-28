import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    const db = getDb();
    if (userId) {
      const u: any = db.prepare(`
        SELECT u.id, u.name, u.email, u.role, COALESCE(u.status, 'active') as status, u.member_since, u.created_at,
               COALESCE(a.phone, '+91 98765 43210') as phone
        FROM users u
        LEFT JOIN addresses a ON a.user_id = u.id AND a.is_default = 1
        WHERE u.id = ?
      `).get(userId);

      if (!u) {
        return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, user: u });
    }

    let users: any[] = [];
    try {
      users = db.prepare(`
        SELECT u.id, u.name, u.email, u.role, COALESCE(u.status, 'active') as status, u.member_since, u.created_at,
               COALESCE(a.phone, '+91 98765 43210') as phone
        FROM users u
        LEFT JOIN addresses a ON a.user_id = u.id AND a.is_default = 1
        ORDER BY u.created_at ASC
      `).all();
    } catch (e) {
      users = db.prepare("SELECT id, name, email, role, member_since, created_at FROM users ORDER BY created_at ASC").all().map((u: any) => ({
        ...u,
        status: "active",
        phone: "+91 98765 43210"
      }));
    }
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email, and password required." }, { status: 400 });
    }

    const db = getDb();
    const userId = `usr_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const monthYear = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();

    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role, status, member_since, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(userId, name.trim(), email.toLowerCase().trim(), password, role || "VIP Client", "active", monthYear, nowIso);

    return NextResponse.json({ success: true, message: "User added successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, role, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required." }, { status: 400 });
    }

    const db = getDb();
    if (role !== undefined) {
      db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);
    }
    if (status !== undefined) {
      db.prepare("UPDATE users SET status = ? WHERE id = ?").run(status, id);
    }

    return NextResponse.json({ success: true, message: `User record updated in database.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID required." }, { status: 400 });
    }

    const db = getDb();
    db.prepare("DELETE FROM users WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
