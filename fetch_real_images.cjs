const fs = require('fs');
const https = require('https');

async function getWikiImage(title) {
  return new Promise((resolve) => {
    const overrides = {
      'Srinagar': 'Dal Lake',
      'Leh': 'Pangong Tso',
      'Kashi Vishwanath': 'Kashi Vishwanath Temple',
      'Tirupati': 'Venkateswara Temple, Tirumala',
      'Kashmir': 'Jammu and Kashmir',
      'Ladakh': 'Pangong Tso',
      'Goa': 'Palolem Beach',
      'Kerala': 'Kerala backwaters',
      'Rajasthan': 'Hawa Mahal',
      'Uttarakhand': 'Kedarnath Temple',
      'Hampi': 'Virupaksha Temple',
      'Andaman Islands': 'Havelock Island',
      'Pahalgam': 'Pahalgam',
      'Sonamarg': 'Sonamarg',
      'Alchi Monastery': 'Alchi Monastery',
      'Khardung La': 'Khardung La',
      'Nubra Valley': 'Nubra Valley',
      'Tso Moriri': 'Tso Moriri',
      'Baga Beach': 'Baga Beach',
      'Dudhsagar Falls': 'Dudhsagar Falls',
      'Fort Aguada': 'Fort Aguada',
      'Palolem Beach': 'Palolem Beach',
      'Munnar': 'Munnar',
      'Alleppey': 'Alappuzha',
      'Thekkady': 'Periyar National Park',
      'Varkala': 'Varkala Beach',
      'Jaipur': 'Amber Fort',
      'Udaipur': 'City Palace, Udaipur',
      'Jodhpur': 'Mehrangarh',
      'Jaisalmer': 'Jaisalmer Fort',
      'Rishikesh': 'Lakshman Jhula',
      'Nainital': 'Nainital Lake',
      'Valley of Flowers': 'Valley of Flowers National Park',
      'Auli Meadows': 'Auli',
      'Virupaksha Temple': 'Virupaksha Temple',
      'Stone Chariot Vittala': 'Hazara Rama Temple',
      'Hemakuta Hill Sunset': 'Hemakuta hill temples',
      'Port Blair Port': 'Cellular Jail',
      'Radhanagar Beach': 'Radhanagar Beach',
      'Neil Island Natural Arch': 'Neil Island'
    };

    const searchTitle = overrides[title] || title;
    const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(searchTitle) + '&prop=pageimages&format=json&pithumbsize=800';
    
    https.get(url, { headers: { 'User-Agent': 'VeloraTravelBot/1.0 (velora@example.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            console.log('No image found for', title, 'using fallback');
            resolve('https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80');
          }
        } catch(e) {
          console.error('Error parsing', title);
          resolve('https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80');
        }
      });
    }).on('error', () => {
      resolve('https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80');
    });
  });
}

async function processDb() {
  let seed = fs.readFileSync('src/data/dbSeed.ts', 'utf8');
  
  let blocks = seed.split('{');
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    const nameMatch = block.match(/(?:title|name):\s*'([^']+)'/);
    if (nameMatch) {
      const placeName = nameMatch[1];
      if (block.includes('image:')) {
        const imageUrl = await getWikiImage(placeName);
        console.log('Fetched ' + placeName + ' -> ' + imageUrl.substring(0,60) + '...');
        blocks[i] = block.replace(/image:\s*'[^']+'/, "image: '" + imageUrl + "'");
        blocks[i] = blocks[i].replace(/image:\s*"[^"]+"/, "image: '" + imageUrl + "'");
      }
    }
  }

  const updatedSeed = blocks.join('{');
  fs.writeFileSync('src/data/dbSeed.ts', updatedSeed);
  console.log('dbSeed.ts updated with real Wikipedia images successfully!');
}

processDb();
