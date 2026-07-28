const fs = require('fs');

function showErrorLines(file, linesStr) {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8').split('\n');
  const lines = linesStr.split(',').map(n => parseInt(n));
  console.log('--- ' + file + ' ---');
  lines.forEach(l => {
    if (l > 0 && l <= content.length) {
      console.log(`${l-1}: ${content[l-2]}`);
      console.log(`${l}: ${content[l-1]}`);
      console.log(`${l+1}: ${content[l]}`);
    }
  });
}

showErrorLines('app/api/admin/addresses/route.ts', '18,20');
showErrorLines('app/api/admin/categories/route.ts', '33');
showErrorLines('app/api/admin/orders/route.ts', '14,23,28,35,54');
showErrorLines('app/api/admin/users/route.ts', '35');
showErrorLines('app/api/auth/login/route.ts', '27');
showErrorLines('app/api/auth/register/route.ts', '27,37');
showErrorLines('app/api/products/reviews/route.ts', '13,15,36,53');
showErrorLines('app/api/restock-alert/route.ts', '8,26');
