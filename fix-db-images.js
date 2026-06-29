import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data');

const files = fs.readdirSync(dataPath).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(dataPath, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const regex = /https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9-]+)\?[^'"]+/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, (match, photoId) => {
      return `https://picsum.photos/seed/${photoId}/1600/900`;
    });
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated images in ${file}`);
  }
}
