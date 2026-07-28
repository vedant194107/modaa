const fs = require('fs');
const path = require('path');

function replaceAll(file, replacements) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (let r of replacements) {
    content = content.replace(r[0], r[1]);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed " + file);
  }
}

// 1. app/api/admin/addresses/route.ts
replaceAll("app/api/admin/addresses/route.ts", [
  [/let query = "SELECT \* FROM addresses WHERE 1=1";/g, 'let sqlQuery = "SELECT * FROM addresses WHERE 1=1";'],
  [/query \+= " AND user_id = \?";/g, 'sqlQuery += " AND user_id = ?";'],
  [/query \+= " ORDER BY is_default DESC, created_at DESC";/g, 'sqlQuery += " ORDER BY is_default DESC, created_at DESC";'],
  [/const addresses = await query\(query,/g, 'const addresses = await query(sqlQuery,'],
  [/const stmt = db\.prepare\(`/g, 'const addresses = await query(`'] // Wait, there's a stmt?
]);

// 2. app/api/admin/categories/route.ts
replaceAll("app/api/admin/categories/route.ts", [
  [/db\.exec\(`/g, 'await query(`'],
  [/const insert = db\.prepare\(`/g, 'await query(`'] // Just in case it's left
]);

// 3. app/api/admin/orders/route.ts
replaceAll("app/api/admin/orders/route.ts", [
  [/const stmt = db\.prepare\("SELECT \* FROM orders WHERE id = \? OR order_number = \?"\);\n\s*const order = stmt\.get\(q, q\);/g, 'const order = await queryOne("SELECT * FROM orders WHERE id = ? OR order_number = ?", [q, q]);'],
  [/const userStmt = db\.prepare\("SELECT \* FROM users WHERE id = \? OR email = \?"\);\n\s*const user = userStmt\.get\(q, q\);/g, 'const user = await queryOne("SELECT * FROM users WHERE id = ? OR email = ?", [q, q]);'],
  [/const stmt = db\.prepare\("SELECT \* FROM orders WHERE user_id = \? ORDER BY created_at DESC"\);\n\s*orders = stmt\.all\(user\.id\);/g, 'orders = await query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [user.id]);'],
  [/const stmt = db\.prepare\("SELECT \* FROM orders ORDER BY created_at DESC"\);\n\s*orders = stmt\.all\(\);/g, 'orders = await query("SELECT * FROM orders ORDER BY created_at DESC");'],
  [/const stmt = db\.prepare\("UPDATE orders SET status = \? WHERE id = \? OR order_number = \?", \[status\.toUpperCase\(\), id, id\]\);\n\s*stmt\.run\(\);/g, 'await query("UPDATE orders SET status = ? WHERE id = ? OR order_number = ?", [status.toUpperCase(), id, id]);']
]);

// 4. app/api/admin/users/route.ts
replaceAll("app/api/admin/users/route.ts", [
  [/users\.map\(/g, '(await users).map(']
]);

// 5. app/api/auth/login/route.ts
replaceAll("app/api/auth/login/route.ts", [
  [/const selectStmt = db\.prepare\("SELECT \* FROM users WHERE email = \?"\);\n\s*const user: any = selectStmt\.get\(email\);/g, 'const user: any = await queryOne("SELECT * FROM users WHERE email = ?", [email]);']
]);

// 6. app/api/auth/register/route.ts
replaceAll("app/api/auth/register/route.ts", [
  [/const checkStmt = db\.prepare\("SELECT \* FROM users WHERE email = \?"\);\n\s*const existingUser = checkStmt\.get\(email\);/g, 'const existingUser = await queryOne("SELECT * FROM users WHERE email = ?", [email]);'],
  [/const insertStmt = db\.prepare\(`([\s\S]*?)`\);\n\s*insertStmt\.run\(([\s\S]*?)\);/g, 'await query(`$1`, [$2]);']
]);

// 7. app/api/products/reviews/route.ts
replaceAll("app/api/products/reviews/route.ts", [
  [/const stmt = db\.prepare\("SELECT \* FROM product_reviews WHERE product_id = \? ORDER BY created_at DESC"\);\n\s*const reviews = stmt\.all\(productId\);/g, 'const reviews = await query("SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC", [productId]);'],
  [/const stmt = db\.prepare\("SELECT \* FROM product_reviews ORDER BY created_at DESC"\);\n\s*const reviews = stmt\.all\(\);/g, 'const reviews = await query("SELECT * FROM product_reviews ORDER BY created_at DESC");'],
  [/const stmt = db\.prepare\(`([\s\S]*?)`\);\n\s*stmt\.run\(([\s\S]*?)\);/g, 'await query(`$1`, [$2]);'],
  [/const getNewStmt = db\.prepare\("SELECT \* FROM product_reviews WHERE id = \?"\);\n\s*const newReview = getNewStmt\.get\(reviewId\);/g, 'const newReview = await queryOne("SELECT * FROM product_reviews WHERE id = ?", [reviewId]);']
]);

// 8. app/api/restock-alert/route.ts
replaceAll("app/api/restock-alert/route.ts", [
  [/const stmt = db\.prepare\("SELECT \* FROM restock_alerts ORDER BY created_at DESC"\);\n\s*const alerts = stmt\.all\(\);/g, 'const alerts = await query("SELECT * FROM restock_alerts ORDER BY created_at DESC");'],
  [/const stmt = db\.prepare\(`([\s\S]*?)`\);\n\s*stmt\.run\(([\s\S]*?)\);/g, 'await query(`$1`, [$2]);']
]);
