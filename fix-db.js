const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'lib/db.ts');
let content = fs.readFileSync(dbPath, 'utf8');

content = content.replace(/\\`/g, '`');

fs.writeFileSync(dbPath, content, 'utf8');
console.log("Fixed db.ts");
