import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");

    let reviews;
    if (productId) {
      const stmt = db.prepare("SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC");
      reviews = stmt.all(productId);
    } else {
      const stmt = db.prepare("SELECT * FROM product_reviews ORDER BY created_at DESC");
      reviews = stmt.all();
    }

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { product_id, author, rating, title, body: reviewBody, image_url, size, color } = body;

    if (!product_id || !author || !rating || !title || !reviewBody) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const id = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const stmt = db.prepare(`
      INSERT INTO product_reviews (id, product_id, author, rating, title, body, image_url, size, color, verified, helpful)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      product_id,
      author,
      Number(rating),
      title,
      reviewBody,
      image_url || null,
      size || "M",
      color || "Milano Red",
      1,
      0
    );

    const getNewStmt = db.prepare("SELECT * FROM product_reviews WHERE id = ?");
    const createdReview = getNewStmt.get(id);

    return NextResponse.json({ success: true, review: createdReview });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
