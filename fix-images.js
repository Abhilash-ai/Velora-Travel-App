import fs from 'fs';
import path from 'path';

const agencyPath = path.join(process.cwd(), 'src/components/agency');

const files = fs.readdirSync(agencyPath).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(agencyPath, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find unsplash URLs and replace them with picsum URLs using the photo ID as a seed
  const regex = /https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9-]+)\?[^'"]+/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, (match, photoId) => {
      // Use the photo ID as a seed for consistent placeholder images
      return `https://picsum.photos/seed/${photoId}/1600/900`;
    });
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated images in ${file}`);
  }
}
