const fs = require('fs');
const path = require('path');

const files = [
  "app/api/admin/categories/route.ts",
  "app/api/admin/orders/route.ts",
  "app/api/admin/users/route.ts",
  "app/api/auth/login/route.ts",
  "app/api/auth/register/route.ts",
  "app/api/products/reviews/route.ts",
  "app/api/restock-alert/route.ts",
  "app/api/users/route.ts"
];

files.forEach(f => {
  const filePath = path.join(process.cwd(), f);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Simple string replacements for remaining patterns
  
  // categories
  content = content.replace(
    /const insert = db\.prepare\(`([\s\S]*?)`\);\n\s*insert\.run\(([\s\S]*?)\);/,
    'await query(`$1`, [$2]);'
  );

  // orders
  content = content.replace(
    /const userStmt = db\.prepare\("SELECT \* FROM users WHERE id = \? OR email = \?"\);\n\s*const user = userStmt\.get\(q, q\);/,
    'const user = await queryOne("SELECT * FROM users WHERE id = ? OR email = ?", [q, q]);'
  );
  content = content.replace(
    /const stmt = db\.prepare\("SELECT \* FROM orders WHERE user_id = \? ORDER BY created_at DESC"\);\n\s*orders = stmt\.all\(user\.id\);/,
    'orders = await query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [user.id]);'
  );
  content = content.replace(
    /const stmt = db\.prepare\("SELECT \* FROM orders ORDER BY created_at DESC"\);\n\s*orders = stmt\.all\(\);/,
    'orders = await query("SELECT * FROM orders ORDER BY created_at DESC");'
  );
  content = content.replace(
    /const stmt = db\.prepare\("UPDATE orders SET status = \? WHERE id = \? OR order_number = \?", \[status\.toUpperCase\(\), id, id\]\);\n\s*stmt\.run\(\);/,
    'await query("UPDATE orders SET status = ? WHERE id = ? OR order_number = ?", [status.toUpperCase(), id, id]);'
  );

  // users
  content = content.replace(
    /const u: any = db\.prepare\(`([\s\S]*?)`\)\.get\(userId\);/,
    'const u: any = await queryOne(`$1`, [userId]);'
  );
  content = content.replace(
    /users = db\.prepare\(`([\s\S]*?)`\)\.all\(\);/,
    'users = await query(`$1`);'
  );

  // login
  content = content.replace(
    /const selectStmt = db\.prepare\("SELECT \* FROM users WHERE email = \?"\);\n\s*const user: any = selectStmt\.get\(email\);/,
    'const user: any = await queryOne("SELECT * FROM users WHERE email = ?", [email]);'
  );

  // register
  content = content.replace(
    /const insertStmt = db\.prepare\(`([\s\S]*?)`\);\n\s*insertStmt\.run\(([\s\S]*?)\);/,
    'await query(`$1`, [$2]);'
  );
  content = content.replace(
    /const checkStmt = db\.prepare\("SELECT \* FROM users WHERE email = \?"\);\n\s*const existingUser = checkStmt\.get\(email\);/,
    'const existingUser = await queryOne("SELECT * FROM users WHERE email = ?", [email]);'
  );

  // products reviews
  content = content.replace(
    /const stmt = db\.prepare\("SELECT \* FROM product_reviews ORDER BY created_at DESC"\);\n\s*const reviews = stmt\.all\(\);/,
    'const reviews = await query("SELECT * FROM product_reviews ORDER BY created_at DESC");'
  );
  content = content.replace(
    /const stmt = db\.prepare\(`([\s\S]*?)`\);\n\s*stmt\.run\(([\s\S]*?)\);/,
    'await query(`$1`, [$2]);'
  );
  content = content.replace(
    /const getNewStmt = db\.prepare\("SELECT \* FROM product_reviews WHERE id = \?"\);\n\s*const newReview = getNewStmt\.get\(reviewId\);/,
    'const newReview = await queryOne("SELECT * FROM product_reviews WHERE id = ?", [reviewId]);'
  );
  content = content.replace(
    /const stmt = db\.prepare\("SELECT \* FROM product_reviews WHERE product_id = \? ORDER BY created_at DESC"\);\n\s*const reviews = stmt\.all\(productId\);/,
    'const reviews = await query("SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC", [productId]);'
  );

  // restock alert
  content = content.replace(
    /const stmt = db\.prepare\(`([\s\S]*?)`\);\n\s*stmt\.run\(([\s\S]*?)\);/,
    'await query(`$1`, [$2]);'
  );

  // users list
  content = content.replace(
    /const stmt = db\.prepare\("SELECT id, name, email, role, member_since, created_at FROM users ORDER BY created_at DESC"\);\n\s*const users = stmt\.all\(\);/,
    'const users = await query("SELECT id, name, email, role, member_since, created_at FROM users ORDER BY created_at DESC");'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed: " + filePath);
  }
});
