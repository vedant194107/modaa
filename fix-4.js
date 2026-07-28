const fs = require('fs');

function cleanFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;
  
  // Clean up any stray db.prepare that we missed because of newlines or whatever
  content = content.replace(/const stmt = db\.prepare\(`([\s\S]*?)`\);\n\s*stmt\.run\(([\s\S]*?)\);/g, 'await query(`$1`, [$2]);');
  content = content.replace(/const insertStmt = db\.prepare\(`([\s\S]*?)`\);\n\s*insertStmt\.run\(([\s\S]*?)\);/g, 'await query(`$1`, [$2]);');
  
  // For update in orders
  content = content.replace(/const stmt = db\.prepare\("UPDATE orders SET status = \? WHERE id = \? OR order_number = \?", \[status\.toUpperCase\(\), id, id\]\);/g, 'await query("UPDATE orders SET status = ? WHERE id = ? OR order_number = ?", [status.toUpperCase(), id, id]);');

  if (orig !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log("Cleaned " + file);
  }
}

cleanFile('app/api/admin/orders/route.ts');
cleanFile('app/api/auth/register/route.ts');
cleanFile('app/api/products/reviews/route.ts');
cleanFile('app/api/restock-alert/route.ts');
