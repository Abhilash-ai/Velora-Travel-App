const fs = require('fs');
const https = require('https');

const fallbackUnsplashIds = [
  '1506461883276-594a12b11cf3',
  '1476514525535-07fb3b4ed5f1',
  '1514222391305-6bf01140643b',
  '1464817739973-5dd14fc7615b',
  '1530789253388-582c481c54b0',
  '1587595431973-160d0d94add1',
  '1564507592227-8840c94ea128'
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchWikiImage(title) {
  return new Promise((resolve) => {
    let searchTerm = title.replace(/\\(.*?\\)/g, '').trim(); 
    searchTerm += ' India';

    const url = 'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(searchTerm) + '&gsrlimit=1&prop=pageimages&format=json&pithumbsize=800';
    
    https.get(url, { headers: { 'User-Agent': 'VeloraTravelBot/3.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.pages) {
            const pages = json.query.pages;
            const pageId = Object.keys(pages)[0];
            if (pages[pageId].thumbnail) {
              return resolve(pages[pageId].thumbnail.source);
            }
          }
          resolve(null);
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function healDbSeedSlowly() {
  let seed = fs.readFileSync('src/data/dbSeed.ts', 'utf8');
  let blocks = seed.split('{');
  
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    const nameMatch = block.match(/(?:title|name):\s*'([^']+)'/);
    if (nameMatch) {
      const placeName = nameMatch[1];
      if (block.includes('image:')) {
        let imageUrl = await searchWikiImage(placeName);
        if (!imageUrl) {
          console.log('Failed to find real image for ' + placeName);
        } else {
          console.log('Found real image for ' + placeName + ' -> ' + imageUrl.substring(0,60) + '...');
          blocks[i] = block.replace(/image:\s*'[^']+'/, "image: '" + imageUrl + "'");
        }
        await sleep(1500); // Wait 1.5 seconds between requests to avoid Wikipedia rate limits
      }
    }
  }

  fs.writeFileSync('src/data/dbSeed.ts', blocks.join('{'));
  console.log('dbSeed.ts successfully healed with real images slowly!');
}

healDbSeedSlowly();
