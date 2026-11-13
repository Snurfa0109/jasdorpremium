const fs = require('fs');

async function scrape() {
  try {
    const html = fs.readFileSync('temp_menu.html', 'utf8');
    const payloadMatch = html.match(/"([^"]*\/_payload\.json[^"]*)"/);
    if (!payloadMatch) {
      console.log('No payload match');
      return;
    }
    const payloadUrl = 'https://kenanganglobal.com' + payloadMatch[1];
    console.log('Fetching payload:', payloadUrl);
    const res = await fetch(payloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const data = await res.json();
    console.log('Payload data type:', typeof data, Array.isArray(data) ? `Array len ${data.length}` : 'Object');
    fs.writeFileSync('temp_payload.json', JSON.stringify(data, null, 2));
    console.log('Saved temp_payload.json');
  } catch (err) {
    console.error('Error fetching payload:', err);
  }
}

scrape();
