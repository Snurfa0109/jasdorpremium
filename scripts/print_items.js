const fs = require('fs');

const items = JSON.parse(fs.readFileSync('temp_regular_products.json', 'utf8'));
console.log('Total items:', items.length);

const order = ['signature', 'coffee', 'non-coffee', 'tea', 'food'];
const grouped = {};
for (const o of order) grouped[o] = [];

for (const item of items) {
  if (grouped[item.category]) {
    grouped[item.category].push(item);
  } else {
    grouped['coffee'].push(item);
  }
}

for (const cat of order) {
  console.log(`\n=== Category: ${cat.toUpperCase()} (${grouped[cat].length} items) ===`);
  grouped[cat].forEach(i => {
    console.log(`  - ${i.name} (Rp ${i.originalPrice.toLocaleString('id-ID')} -> Rp ${i.discountPrice.toLocaleString('id-ID')})`);
  });
}

