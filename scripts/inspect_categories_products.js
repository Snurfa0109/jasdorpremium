const fs = require('fs');

const menuIdData = JSON.parse(fs.readFileSync('temp_menu_id.json', 'utf8'));

console.log('Categories count:', menuIdData.categories ? menuIdData.categories.length : 0);
console.log('Categories:', JSON.stringify(menuIdData.categories, null, 2));

console.log('Products count:', menuIdData.products ? menuIdData.products.length : 0);
if (menuIdData.products && menuIdData.products.length > 0) {
  console.log('Sample product 0:', JSON.stringify(menuIdData.products[0], null, 2));
  console.log('Sample product 1:', JSON.stringify(menuIdData.products[1], null, 2));
}

