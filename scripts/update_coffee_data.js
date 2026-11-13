const fs = require('fs');

const items = JSON.parse(fs.readFileSync('temp_regular_products.json', 'utf8'));

// Order: signature, coffee, non-coffee, tea, food
const orderMap = { signature: 1, coffee: 2, 'non-coffee': 3, tea: 4, food: 5 };

// Sort items: signature first, then by category order, then popular/famous items at the top of each category
items.sort((a, b) => {
  const catDiff = (orderMap[a.category] || 99) - (orderMap[b.category] || 99);
  if (catDiff !== 0) return catDiff;
  // prioritize items with badges
  if (a.badge && !b.badge) return -1;
  if (!a.badge && b.badge) return 1;
  return a.name.localeCompare(b.name);
});

// Put Kopi Kenangan Mantan first in signature
const kkmIndex = items.findIndex(i => i.name === 'Kopi Kenangan Mantan');
if (kkmIndex > -1) {
  const [kkm] = items.splice(kkmIndex, 1);
  items.unshift(kkm);
}

// Read current coffee.ts
const coffeeTs = fs.readFileSync('src/data/coffee.ts', 'utf8');

// Find where tomoro brand starts
const tomoroStart = coffeeTs.indexOf("    id: 'tomoro',");
if (tomoroStart === -1) {
  console.error("Could not find tomoro brand");
  process.exit(1);
}

// Find header part up to `items: [` under `kopken`
const kopkenItemsStart = coffeeTs.indexOf('    items: [');
if (kopkenItemsStart === -1) {
  console.error("Could not find kopken items start");
  process.exit(1);
}

// The part from beginning up to items: [
const header = coffeeTs.substring(0, kopkenItemsStart + '    items: ['.length);

// The tomoro part: find the `{` right before `id: 'tomoro'`
const tomoroBrandIdx = coffeeTs.lastIndexOf('  {', tomoroStart);
const tomoroPart = coffeeTs.substring(tomoroBrandIdx);

const newContent = `${header}
${items.map(i => `      ${JSON.stringify(i, null, 8).replace(/\n/g, '\n      ')}`).join(',\n')},
    ],
  },
${tomoroPart}`;

fs.writeFileSync('src/data/coffee.ts', newContent);
console.log('Successfully updated src/data/coffee.ts with', items.length, 'Kopi Kenangan items!');

