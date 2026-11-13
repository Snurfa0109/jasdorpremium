const fs = require('fs');

const menuIdData = JSON.parse(fs.readFileSync('temp_menu_id.json', 'utf8'));

const catMap = {};
for (const c of menuIdData.categories) {
  catMap[c.id] = c.name;
}

const byCat = {};
for (const p of menuIdData.products) {
  const catName = catMap[p.categoryId] || p.categoryId;
  if (!byCat[catName]) byCat[catName] = [];
  byCat[catName].push(p);
}

for (const [cat, prods] of Object.entries(byCat)) {
  console.log(`\n=== Category: ${cat} (${prods.length} items) ===`);
  prods.forEach(p => {
    console.log(`- [${p.id}] ${p.name} | Rp ${p.startingPrice?.toLocaleString('id-ID')} | Badges: ${p.badges?.join(', ') || '-'}`);
  });
}

