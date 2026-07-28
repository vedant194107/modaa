import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    
    if (id) {
      const product = await queryOne("SELECT * FROM products WHERE id = ?", [id]);
      if (!product) {
        return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, product });
    }

    const products = await query("SELECT * FROM products ORDER BY created_at DESC", []);
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      category,
      price,
      image1,
      image2,
      description,
      stock,
      materials,
      fit_guide,
      shipping_info,
      sustainability,
    } = body;

    if (!title || !category || price === undefined || !image1) {
      return NextResponse.json({ success: false, error: "Title, category, price, and primary image are required." }, { status: 400 });
    }

    
    const prodId = `prod_${Date.now()}`;
    await query(`
      INSERT INTO products (id, title, category, price, image1, image2, description, stock, status, materials, fit_guide, shipping_info, sustainability)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?, ?)
    `, [
      prodId,
      title.trim(),
      category.trim(),
      parseFloat(price),
      image1.trim(),
      image2 ? image2.trim() : image1.trim(),
      description ? description.trim() : "",
      stock ? parseInt(stock) : 50,
      materials ? materials.trim() : "",
      fit_guide ? fit_guide.trim() : "",
      shipping_info ? shipping_info.trim() : "",
      sustainability ? sustainability.trim() : ""
    ]);

    return NextResponse.json({ success: true, message: "Product created successfully in SQLite database.", id: prodId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      category,
      price,
      image1,
      image2,
      description,
      stock,
      status,
      materials,
      fit_guide,
      shipping_info,
      sustainability,
    } = body;

    if (!id || !title || !category || price === undefined || !image1) {
      return NextResponse.json({ success: false, error: "Product ID, title, category, price, and primary image are required." }, { status: 400 });
    }

    
    await query(`
      UPDATE products 
      SET title = ?, category = ?, price = ?, image1 = ?, image2 = ?, description = ?, stock = ?, status = ?, materials = ?, fit_guide = ?, shipping_info = ?, sustainability = ?
      WHERE id = ?
    `, [
      title.trim(),
      category.trim(),
      parseFloat(price),
      image1.trim(),
      image2 ? image2.trim() : image1.trim(),
      description ? description.trim() : "",
      stock !== undefined ? parseInt(stock) : 50,
      status || "ACTIVE",
      materials ? materials.trim() : "",
      fit_guide ? fit_guide.trim() : "",
      shipping_info ? shipping_info.trim() : "",
      sustainability ? sustainability.trim() : "",
      id
    ]);

    return NextResponse.json({ success: true, message: "Product updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stock } = body;

    if (!id || stock === undefined) {
      return NextResponse.json({ success: false, error: "Product ID and stock count are required." }, { status: 400 });
    }

    
    const newStock = Math.max(0, parseInt(stock));
    await query("UPDATE products SET stock = ? WHERE id = ?", [newStock, id]);

    return NextResponse.json({ success: true, message: "Live stock updated successfully.", stock: newStock });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required." }, { status: 400 });
    }

    
    await query("DELETE FROM products WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Product deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
