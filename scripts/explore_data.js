const fs = require('fs');

const resolved = JSON.parse(fs.readFileSync('temp_resolved.json', 'utf8'));

console.log('resolved.data keys:', Object.keys(resolved.data || {}));

// Let's print out what data has
for (const key of Object.keys(resolved.data || {})) {
  const val = resolved.data[key];
  console.log(`Key: ${key}, type: ${typeof val}, isArray: ${Array.isArray(val)}`);
  if (typeof val === 'object' && val !== null) {
    console.log(`  Subkeys:`, Object.keys(val).slice(0, 10));
  }
}

