import fs from 'fs';
import path from 'path';

const agencyDir = path.join(process.cwd(), 'src/components/agency');
const files = fs.readdirSync(agencyDir).filter(f => f.endsWith('.tsx'));

const images = [
  '/images/kashmir.png',
  '/images/ladakh.png',
  '/images/goa.png',
  '/images/kerala.png',
  '/images/uttarakhand.png',
  '/images/hampi.png',
  '/images/andaman.png'
];

let imageIndex = 0;

function getNextImage() {
  const img = images[imageIndex];
  imageIndex = (imageIndex + 1) % images.length;
  return img;
}

for (const file of files) {
  if (file === 'TransformativeJourneys.tsx' || file === 'HorizontalShowcase.tsx') {
    continue; // Already mapped perfectly or handled manually
  }
  
  const fullPath = path.join(agencyDir, file);
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Replace each occurrence of /images/rajasthan.png with a different image to add variety,
  // EXCEPT we should keep rajasthan in the rotation, so let's include it in getNextImage?
  // Sure, let's add it to the list of images to rotate.
  
  const imagesWithRajasthan = [...images, '/images/rajasthan.png'];
  
  // We need to use a replacer function to replace one by one
  let changed = false;
  content = content.replace(/\/images\/rajasthan\.png/g, (match) => {
    changed = true;
    const img = imagesWithRajasthan[imageIndex];
    imageIndex = (imageIndex + 1) % imagesWithRajasthan.length;
    return img;
  });
  
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`Varied images in ${file}`);
  }
}
