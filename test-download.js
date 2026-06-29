import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

async function downloadImage() {
  const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Hawa_Mahal_2011.jpg/1200px-Hawa_Mahal_2011.jpg';
  const dest = path.join(process.cwd(), 'public', 'images', 'test.jpg');

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });

    if (!res.ok) throw new Error(`Unexpected response ${res.status}`);
    
    // Convert ReadableStream to Node.js stream and pipe to file
    const fileStream = fs.createWriteStream(dest);
    const body = res.body;
    
    if (body) {
      const reader = body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fileStream.write(value);
      }
      fileStream.end();
      console.log('Download successful');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

downloadImage();
