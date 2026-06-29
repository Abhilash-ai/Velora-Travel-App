import fs from 'fs';
import path from 'path';

function fixAllExternalImages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      fixAllExternalImages(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      
      const regexes = [
        /https:\/\/images\.unsplash\.com\/[^'"]+/g,
        /https:\/\/picsum\.photos\/[^'"]+/g,
        /https:\/\/upload\.wikimedia\.org\/[^'"]+/g
      ];
      
      for (const regex of regexes) {
        if (regex.test(content)) {
          content = content.replace(regex, '/images/kashmir.png');
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Replaced all external images in ${fullPath}`);
      }
    }
  }
}

fixAllExternalImages(path.join(process.cwd(), 'src'));
