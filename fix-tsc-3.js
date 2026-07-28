const fs = require('fs');
const path = require('path');

function replaceStr(file, target, replacement) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Fixed " + file);
}

// 1. addresses
replaceStr('app/api/admin/addresses/route.ts', 'let query = "SELECT * FROM addresses";', 'let sqlQuery = "SELECT * FROM addresses";');
replaceStr('app/api/admin/addresses/route.ts', 'query += " WHERE user_id = ?";', 'sqlQuery += " WHERE user_id = ?";');

// 2. categories
replaceStr('app/api/admin/categories/route.ts', 'insert.run(item[0], item[1], item[2], item[3], item[4]);', 'await query(`INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)`, [item[0], item[1], item[2], item[3], item[4]]);');

// 3. orders
replaceStr('app/api/admin/orders/route.ts', 'await query("SELECT * FROM orders WHERE id = ? OR order_number = ?");\n      const order = stmt.get(id, id);', 'const order = await queryOne("SELECT * FROM orders WHERE id = ? OR order_number = ?", [id, id]);');
replaceStr('app/api/admin/orders/route.ts', 'const userStmt = db.prepare("SELECT * FROM users WHERE id = ? OR email = ?");\n      const user = userStmt.get(userId, userId) as { id: string } | undefined;', 'const user = await queryOne("SELECT * FROM users WHERE id = ? OR email = ?", [userId, userId]) as { id: string } | undefined;');
replaceStr('app/api/admin/orders/route.ts', 'const stmt = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");\n      const orders = stmt.all(targetId);', 'const orders = await query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [targetId]);');
replaceStr('app/api/admin/orders/route.ts', 'const stmt = db.prepare("SELECT * FROM orders ORDER BY created_at DESC");\n    const orders = stmt.all();', 'const orders = await query("SELECT * FROM orders ORDER BY created_at DESC");');
replaceStr('app/api/admin/orders/route.ts', 'const stmt = db.prepare("UPDATE orders SET status = ? WHERE id = ? OR order_number = ?", [status.toUpperCase(), id, id]);\n\n    return NextResponse.json({ success: true, message: "Order status updated." });', 'await query("UPDATE orders SET status = ? WHERE id = ? OR order_number = ?", [status.toUpperCase(), id, id]);\n\n    return NextResponse.json({ success: true, message: "Order status updated." });');

// 4. users (admin)
replaceStr('app/api/admin/users/route.ts', 'users = await query("SELECT id, name, email, role, member_since, created_at FROM users ORDER BY created_at ASC", []).map((u: any) => ({', 'users = (await query("SELECT id, name, email, role, member_since, created_at FROM users ORDER BY created_at ASC", [])).map((u: any) => ({');

// 5. login
replaceStr('app/api/auth/login/route.ts', 'const selectStmt = db.prepare("SELECT * FROM users WHERE email = ?");\n    const userRow = selectStmt.get(cleanEmail) as any;', 'const userRow = await queryOne("SELECT * FROM users WHERE email = ?", [cleanEmail]) as any;');

// 6. register
replaceStr('app/api/auth/register/route.ts', 'await query("SELECT * FROM users WHERE email = ?");\n    const existing = checkStmt.get(email.toLowerCase().trim());', 'const existing = await queryOne("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);');
replaceStr('app/api/auth/register/route.ts', 'const insertStmt = db.prepare(`\n      INSERT INTO users (id, name, email, password, role, member_since)\n      VALUES (?, ?, ?, ?, ?, ?)\n    `);\n    await query(`\n      INSERT INTO users (id, name, email, password, role, member_since)\n      VALUES (?, ?, ?, ?, ?, ?)\n    `, [userId, name.trim(), email.toLowerCase().trim(), hashedPassword, "VIP Client", memberSince]);', 'await query(`\n      INSERT INTO users (id, name, email, password, role, member_since)\n      VALUES (?, ?, ?, ?, ?, ?)\n    `, [userId, name.trim(), email.toLowerCase().trim(), hashedPassword, "VIP Client", memberSince]);');

// 7. products reviews
replaceStr('app/api/products/reviews/route.ts', 'await query("SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC");\n      reviews = stmt.all(productId);', 'reviews = await query("SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC", [productId]);');
replaceStr('app/api/products/reviews/route.ts', 'const stmt = db.prepare("SELECT * FROM product_reviews ORDER BY created_at DESC");\n      reviews = stmt.all();', 'reviews = await query("SELECT * FROM product_reviews ORDER BY created_at DESC");');
replaceStr('app/api/products/reviews/route.ts', 'const stmt = db.prepare(`\n      INSERT INTO product_reviews (id, product_id, author, rating, title, body, image_url, size, color, verified, helpful)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    `);\n    await query(`\n      INSERT INTO product_reviews (id, product_id, author, rating, title, body, image_url, size, color, verified, helpful)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    `, [id, product_id, author, rating || 5, title, body, image_url || null, size || "M", color || "Milano Red", 1, 0]);', 'await query(`\n      INSERT INTO product_reviews (id, product_id, author, rating, title, body, image_url, size, color, verified, helpful)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    `, [id, product_id, author, rating || 5, title, body, image_url || null, size || "M", color || "Milano Red", 1, 0]);');
replaceStr('app/api/products/reviews/route.ts', 'const getNewStmt = db.prepare("SELECT * FROM product_reviews WHERE id = ?");\n    const createdReview = getNewStmt.get(id);', 'const createdReview = await queryOne("SELECT * FROM product_reviews WHERE id = ?", [id]);');

// 8. restock alerts
replaceStr('app/api/restock-alert/route.ts', 'await query("SELECT * FROM restock_alerts ORDER BY created_at DESC");\n    const alerts = stmt.all();', 'const alerts = await query("SELECT * FROM restock_alerts ORDER BY created_at DESC");');
replaceStr('app/api/restock-alert/route.ts', 'const stmt = db.prepare(`\n      INSERT INTO restock_alerts (id, product_id, email, status)\n      VALUES (?, ?, ?, ?)\n    `);\n    await query(`\n      INSERT INTO restock_alerts (id, product_id, email, status)\n      VALUES (?, ?, ?, ?)\n    `, [id, product_id, email, "PENDING"]);', 'await query(`\n      INSERT INTO restock_alerts (id, product_id, email, status)\n      VALUES (?, ?, ?, ?)\n    `, [id, product_id, email, "PENDING"]);');

