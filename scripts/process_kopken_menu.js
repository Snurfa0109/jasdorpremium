const fs = require('fs');

const menuIdData = JSON.parse(fs.readFileSync('temp_menu_id.json', 'utf8'));

const catMap = {};
for (const c of menuIdData.categories) {
  catMap[c.id] = c.name;
}

// Filter out "menu0005" (Promo & Combo) and "Special Merchandise" (tumblers)
const EXCLUDED_CATEGORIES = ['menu0005', 'appmerchandise'];

// Track unique products by name or id
const seenNames = new Set();
const regularProducts = [];

for (const p of menuIdData.products) {
  if (EXCLUDED_CATEGORIES.includes(p.categoryId)) continue;
  
  // Check if name or description hints at promo / combo / bundle
  const isPromo = p.badges?.some(b => /promo|diskon|gratis|cashback/i.test(b)) ||
    /promo|diskon|beli \d|bundl|pahe|peka/i.test(p.name);
  if (isPromo) continue;

  // Deduplicate
  const cleanName = p.name.trim();
  if (seenNames.has(cleanName)) continue;
  seenNames.add(cleanName);

  const catName = catMap[p.categoryId] || p.categoryId;

  // Classify into our category system:
  // 'signature' | 'coffee' | 'non-coffee' | 'tea' | 'food'
  let appCategory = 'coffee';
  let categoryLabel = 'Kopi & Espresso';

  const nameLower = cleanName.toLowerCase();
  const descLower = (p.description || '').toLowerCase();

  if (catName === 'Kenangan Toast' || catName === 'Food' || /toast|bread|panini|bagel|croissant|donut|cookie|choux|roti/i.test(nameLower)) {
    appCategory = 'food';
    categoryLabel = catName === 'Kenangan Toast' ? 'Kenangan Toast' : 'Roti & Bakery';
  } else if (/mantan|avocado coffee|butterscotch/i.test(nameLower)) {
    appCategory = 'signature';
    categoryLabel = 'Kenangan Mantan & Signature';
  } else if (catName === 'Kenangan Frappe' || /frappe/i.test(nameLower)) {
    appCategory = 'non-coffee'; // or frappe
    categoryLabel = 'Kenangan Frappe';
  } else if (/tea|hibiscus/i.test(nameLower) && !/latte/i.test(nameLower)) {
    appCategory = 'tea';
    categoryLabel = 'Kenangan Tea';
  } else if (catName === 'Non Coffee' || /cokelat|chocolate|milo|taro|matcha|oreo|mineral/i.test(nameLower)) {
    appCategory = 'non-coffee';
    categoryLabel = 'Non Coffee & Cokelat';
  } else {
    appCategory = 'coffee';
    categoryLabel = 'Kopi Kenangan';
  }

  // Calculate prices
  const originalPrice = p.startingPrice || 20000;
  const discountPrice = Math.round(originalPrice * 0.5);

  // Badge
  let badge = undefined;
  if (/mantan/i.test(nameLower)) badge = 'PALING LARIS';
  else if (/taro|bagel|panini/i.test(nameLower)) badge = 'BARU';
  else if (/butterscotch|black aren|avocado/i.test(nameLower)) badge = 'FAVORIT';

  // Options
  const isDrink = appCategory !== 'food';
  const sizeOptions = isDrink ? (nameLower.includes('seliter') ? ['1 Liter (Kemasan Botol)'] : ['Regular', 'Large (+4.000)']) : ['Single Serving'];
  const sugarOptions = isDrink && !nameLower.includes('seliter') && !nameLower.includes('mineral') ? 
    ['Normal Sugar (100%)', 'Less Sugar (50%)', 'No Sugar (0%)'] : [];
  const iceOptions = isDrink && !nameLower.includes('seliter') && !nameLower.includes('mineral') ? 
    ['Normal Ice', 'Less Ice', 'No Ice'] : [];

  const toppingOptions = isDrink && !nameLower.includes('seliter') && !nameLower.includes('mineral') ? [
    { name: 'Grass Jelly (Cincau)', price: 4000 },
    { name: 'Boba Kenangan', price: 4000 },
    { name: 'Coffee Jelly', price: 4000 },
  ] : [];

  regularProducts.push({
    id: `kk-${p.id}`,
    brand: 'kopken',
    name: cleanName,
    category: appCategory,
    categoryLabel,
    description: p.description || `${cleanName} resmi Kopi Kenangan rasa autentik segar.`,
    originalPrice,
    discountPrice,
    discountPercent: 50,
    badge,
    image: p.imageUrl,
    sizeOptions,
    sugarOptions,
    iceOptions,
    toppingOptions
  });
}

console.log(`Extracted ${regularProducts.length} regular non-promo products:`);
const counts = {};
regularProducts.forEach(p => {
  counts[p.category] = (counts[p.category] || 0) + 1;
});
console.log('Category distribution:', counts);
fs.writeFileSync('temp_regular_products.json', JSON.stringify(regularProducts, null, 2));

