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
  // Wait, line 20: what is it? I will just regex "stmt.all()" to "await query()"
  [/const stmt = db\.prepare\(`([\s\S]*?)`\);\n\s*const addresses = stmt\.all\(\);/, 'const addresses = await query(`$1`);']
]);

// 2. app/api/admin/categories/route.ts
replaceAll("app/api/admin/categories/route.ts", [
  [/function initCategoriesTable\(db: any\) \{/, 'async function initCategoriesTable() {'],
  [/const insert = db\.prepare\(`([\s\S]*?)`\);\n\s*const defaults = \[([\s\S]*?)\];\n\n\s*for \(const item of defaults\) \{\n\s*await query\(`[\s\S]*?`, \[item\[0\], item\[1\], item\[2\], item\[3\], item\[4\]\]\);\n\s*\}/, 
   'const defaults = [$2];\n\n    for (const item of defaults) {\n      await query(`$1`, [item[0], item[1], item[2], item[3], item[4]]);\n    }'],
  [/initCategoriesTable\(db\);/g, 'await initCategoriesTable();']
]);

// 3. app/api/admin/orders/route.ts
replaceAll("app/api/admin/orders/route.ts", [
  [/const stmt = db\.prepare\("SELECT \* FROM orders WHERE id = \? OR order_number = \?"\);\n\s*const order = stmt\.get\(q, q\);/, 'const order = await queryOne("SELECT * FROM orders WHERE id = ? OR order_number = ?", [q, q]);'],
  [/const userStmt = db\.prepare\("SELECT \* FROM users WHERE id = \? OR email = \?"\);\n\s*const user = userStmt\.get\(q, q\);/, 'const user = await queryOne("SELECT * FROM users WHERE id = ? OR email = ?", [q, q]);'],
  [/const stmt = db\.prepare\("SELECT \* FROM orders WHERE user_id = \? ORDER BY created_at DESC"\);\n\s*orders = stmt\.all\(user\.id\);/, 'orders = await query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [user.id]);'],
  [/const stmt = db\.prepare\("SELECT \* FROM orders ORDER BY created_at DESC"\);\n\s*orders = stmt\.all\(\);/, 'orders = await query("SELECT * FROM orders ORDER BY created_at DESC");'],
  [/const stmt = db\.prepare\("UPDATE orders SET status = \? WHERE id = \? OR order_number = \?", \[status\.toUpperCase\(\), id, id\]\);\n\s*stmt\.run\(\);/, 'await query("UPDATE orders SET status = ? WHERE id = ? OR order_number = ?", [status.toUpperCase(), id, id]);']
]);

// 4. app/api/admin/users/route.ts
replaceAll("app/api/admin/users/route.ts", [
  [/users = db\.prepare\(`([\s\S]*?)`\)\.all\(\);/, 'users = await query(`$1`);'],
  [/users\.map\(/, '(await users).map('] // Fix missing await on users if any
]);

// 5. app/api/auth/login/route.ts
replaceAll("app/api/auth/login/route.ts", [
  [/const selectStmt = db\.prepare\("SELECT \* FROM users WHERE email = \?"\);\n\s*const user: any = selectStmt\.get\(email\);/, 'const user: any = await queryOne("SELECT * FROM users WHERE email = ?", [email]);']
]);

// 6. app/api/auth/register/route.ts
replaceAll("app/api/auth/register/route.ts", [
  [/const checkStmt = db\.prepare\("SELECT \* FROM users WHERE email = \?"\);\n\s*const existingUser = checkStmt\.get\(email\);/, 'const existingUser = await queryOne("SELECT * FROM users WHERE email = ?", [email]);'],
  [/const insertStmt = db\.prepare\(`([\s\S]*?)`\);\n\s*insertStmt\.run\(([\s\S]*?)\);/, 'await query(`$1`, [$2]);']
]);

// 7. app/api/products/reviews/route.ts
replaceAll("app/api/products/reviews/route.ts", [
  [/const stmt = db\.prepare\("SELECT \* FROM product_reviews WHERE product_id = \? ORDER BY created_at DESC"\);\n\s*const reviews = stmt\.all\(productId\);/, 'const reviews = await query("SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC", [productId]);'],
  [/const stmt = db\.prepare\("SELECT \* FROM product_reviews ORDER BY created_at DESC"\);\n\s*const reviews = stmt\.all\(\);/, 'const reviews = await query("SELECT * FROM product_reviews ORDER BY created_at DESC");'],
  [/const stmt = db\.prepare\(`([\s\S]*?)`\);\n\s*stmt\.run\(([\s\S]*?)\);/, 'await query(`$1`, [$2]);'],
  [/const getNewStmt = db\.prepare\("SELECT \* FROM product_reviews WHERE id = \?"\);\n\s*const newReview = getNewStmt\.get\(reviewId\);/, 'const newReview = await queryOne("SELECT * FROM product_reviews WHERE id = ?", [reviewId]);']
]);

// 8. app/api/restock-alert/route.ts
replaceAll("app/api/restock-alert/route.ts", [
  [/const stmt = db\.prepare\("SELECT \* FROM restock_alerts ORDER BY created_at DESC"\);\n\s*const alerts = stmt\.all\(\);/, 'const alerts = await query("SELECT * FROM restock_alerts ORDER BY created_at DESC");'],
  [/const stmt = db\.prepare\(`([\s\S]*?)`\);\n\s*stmt\.run\(([\s\S]*?)\);/, 'await query(`$1`, [$2]);']
]);

