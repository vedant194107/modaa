import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

// Helper to ensure categories table exists
async function initCategoriesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const check = await queryOne("SELECT COUNT(*) as count FROM categories", []) as { count: number };
  if (check.count === 0) {
    await query(`
      INSERT INTO categories (id, name, slug, description, image)
      VALUES (?, ?, ?, ?, ?)
    `);

    const defaults = [
      ["cat_denim", "Denim", "denim", "Hand-finished raw and distressed heavyweight denim jackets and jeans.", "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M"],
      ["cat_outerwear", "Outerwear", "outerwear", "Technical utility vests, architectural jackets, and waterproof outer layers.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCrsfzMMAc4AsPLC2kiQ-KJsQQhq2LtlUPizDxjwYMq4JjUnOmN4Z0sEFBGU96ZHttvj7wO2v6PwVByUKqaIaIC-AScypD1VxHeaZZr_shSJHWbVKL0qnVPguPxkZUZOpaGSRTgpfcCb_X3JIN1NlYBJHPdXwaDj92yaTzwOal-RNCYTiytmJHxL97b2VrMocPVblMBZerunLeiSh8NqrYfoOx-Nhv95q18Tak4hhQuey_LyWpSuWwYQnEP18eoFvyhLlbu_a_5lok"],
      ["cat_tops", "Tops", "tops", "Ultra-heavyweight 500GSM hoodies, boxy graphic tees, and luxury knits.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBmM3dFYFdmbfG8iyYU1FdgUgiWIXoAbojb-UTfat8oLcmGbNgbwKoAgxqjMQUdZRMT-EPGAjtIo27Ze6dnms3MQv8cqNqVYimWK8aEmEJwBxqnQeMej_Ks-hdp4AIrPXhNjp6W9dRCvDWNF5Qwjkyqqbj8bQrU9ENQZxP7LbibxLP4kAWs8tCOiZO5ldpUsGjs9ycmLt-glI-0aZusmDv6BWypRdxLicFBsRQmHbhVtd8g6mXb-w57CSm2Kf5osP7PYARA83fRE7M"],
      ["cat_pants", "Pants", "pants", "Articulated cargo systems and split-hem tailored trousers.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCqi2F8P9NDi5gTUY3VeIUxDLfmsVXF6QAwZVYSg5cLwYd9FGDs4CMLAc8f-KxMulLbfwOUsA7GDnWNsBkX7pl7855UQKwDPmd-buyjMkewMW6kUtQUrTymR5LAJOYe9rdcxAkK3P8jh1rScRKr88naZGd6KcM8nIm-i6bVF1m-S6NgvKNJTRY592ihZf4Y46mUh6bGSYjYEF90Sfd3T2BjVN2nWDNUkW8-LAfIQbRxH3PjVBwkMO8mbVrezAqAa5x0BY8_cbQyUGU"],
      ["cat_accessories", "Accessories", "accessories", "Stainless steel curb chains, industrial key rings, and archive leather goods.", "https://lh3.googleusercontent.com/aida-public/AB6AXuDtRttUHNJwG3jTta8xDbbwd8on5fhcQKRrq3Vzdepg3IpN86xFjP2u-kSCioo0Dk-M-YydHB4cc19r-lOKLOnRJTmeM1BZLvqK_wYiqY5YzqMClY7R9wS6Q-KKO8X6h8A6bFeEwTzb1z8gdd_fIFDuTbtUkMV9sGzVZwTxtYVTGmTzZGPruMKVJSLKIQfX_D8D1mSZx4KKpsVRdQj5YRxzdXDjo2yjJtcR_iQ4Of8ciacywnsORNBMxr40MxNR7MQ8SEdGgN5VeHw"],
    ];

    for (const item of defaults) {
      await query(`INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)`, [item[0], item[1], item[2], item[3], item[4]]);
    }
  }
}

export async function GET(request: Request) {
  try {
    
    await initCategoriesTable();

    const categories = await query("SELECT * FROM categories ORDER BY name ASC", []);
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, image } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Category name is required." }, { status: 400 });
    }

    
    await initCategoriesTable();

    const cleanName = name.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const catId = `cat_${Date.now()}`;

    await query(`
      INSERT INTO categories (id, name, slug, description, image)
      VALUES (?, ?, ?, ?, ?)
    `, [
      catId,
      cleanName,
      slug,
      description ? description.trim() : "",
      image ? image.trim() : "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M"
    ]);

    return NextResponse.json({ success: true, message: "Category created successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, image } = body;

    if (!id || !name) {
      return NextResponse.json({ success: false, error: "Category ID and name are required." }, { status: 400 });
    }

    
    await initCategoriesTable();

    const cleanName = name.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    await query(`
      UPDATE categories
      SET name = ?, slug = ?, description = ?, image = ?
      WHERE id = ?
    `, [cleanName, slug, description ? description.trim() : "", image ? image.trim() : "", id]);

    return NextResponse.json({ success: true, message: "Category updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID is required." }, { status: 400 });
    }

    
    await initCategoriesTable();

    await query("DELETE FROM categories WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Category deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
