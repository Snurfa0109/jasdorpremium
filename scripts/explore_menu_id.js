const fs = require('fs');

const resolved = JSON.parse(fs.readFileSync('temp_resolved.json', 'utf8'));

const menuIdData = resolved.data['1']['menu-id'];
console.log('menu-id type:', typeof menuIdData, Array.isArray(menuIdData));
if (typeof menuIdData === 'object' && menuIdData !== null) {
  console.log('menu-id keys:', Object.keys(menuIdData));
}

// Let's dump menuIdData structure
fs.writeFileSync('temp_menu_id.json', JSON.stringify(menuIdData, null, 2));
console.log('Written to temp_menu_id.json');

