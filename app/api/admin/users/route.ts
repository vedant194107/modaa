import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    
    if (userId) {
      const u: any = await queryOne(`
        SELECT u.id, u.name, u.email, u.role, COALESCE(u.status, 'active') as status, u.member_since, u.created_at,
               COALESCE(a.phone, '+91 98765 43210') as phone
        FROM users u
        LEFT JOIN addresses a ON a.user_id = u.id AND a.is_default = 1
        WHERE u.id = ?
      `, [userId]);

      if (!u) {
        return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, user: u });
    }

    let users: any[] = [];
    try {
      users = await query(`
        SELECT u.id, u.name, u.email, u.role, COALESCE(u.status, 'active') as status, u.member_since, u.created_at,
               COALESCE(a.phone, '+91 98765 43210') as phone
        FROM users u
        LEFT JOIN addresses a ON a.user_id = u.id AND a.is_default = 1
        ORDER BY u.created_at ASC
      `);
    } catch (e) {
      users = (await query("SELECT id, name, email, role, member_since, created_at FROM users ORDER BY created_at ASC", [])).map((u: any) => ({
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

    
    const userId = `usr_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const monthYear = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();

    await query(`
      INSERT INTO users (id, name, email, password, role, status, member_since, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, name.trim(), email.toLowerCase().trim(), password, role || "VIP Client", "active", monthYear, nowIso]);

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

    
    if (role !== undefined) {
      await query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    }
    if (status !== undefined) {
      await query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
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

    
    await query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
