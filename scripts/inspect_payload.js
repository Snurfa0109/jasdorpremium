const fs = require('fs');

const payload = JSON.parse(fs.readFileSync('temp_payload.json', 'utf8'));

// Nuxt 3 de-serialization helper
function devalue(data) {
  if (!Array.isArray(data)) return data;
  
  // Recursively resolve references
  const cache = new Map();
  function resolve(index) {
    if (typeof index !== 'number' || index < 0 || index >= data.length) return index;
    if (cache.has(index)) return cache.get(index);

    const val = data[index];
    if (val === null || typeof val !== 'object') {
      return val;
    }

    if (Array.isArray(val)) {
      const arr = [];
      cache.set(index, arr);
      for (const item of val) {
        arr.push(resolve(item));
      }
      return arr;
    }

    const obj = {};
    cache.set(index, obj);
    for (const key in val) {
      obj[key] = resolve(val[key]);
    }
    return obj;
  }

  return resolve(0);
}

// Check strings in payload to find categories or menu items
const strings = payload.filter(x => typeof x === 'string');
console.log('Total strings:', strings.length);

const menuRelated = strings.filter(s => 
  s.toLowerCase().includes('kopi') || 
  s.toLowerCase().includes('roti') || 
  s.toLowerCase().includes('toast') ||
  s.toLowerCase().includes('promo') ||
  s.toLowerCase().includes('latte') ||
  s.toLowerCase().includes('cokelat')
);
console.log('Sample menu strings (first 30):', menuRelated.slice(0, 30));

// Also let's inspect the resolved root object
try {
  const resolved = devalue(payload);
  fs.writeFileSync('temp_resolved.json', JSON.stringify(resolved, null, 2));
  console.log('Resolved root keys:', Object.keys(resolved || {}));
} catch (e) {
  console.log('Devalue error:', e.message);
}

