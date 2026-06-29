const fs = require('fs');
let file = fs.readFileSync('src/data/dbSeed.ts', 'utf-8');

// Add galleryImages to interface
if (!file.includes('galleryImages?: string[];')) {
  file = file.replace(/image: string;/, "image: string;\n  galleryImages?: string[];");
}

const galleries = {
  kashmir: ["https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1571401835393-8b5e917711d9?auto=format&fit=crop&q=80"],
  ladakh: ["https://images.unsplash.com/photo-1626014903702-0c91ebcfbd7e?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1581793745862-99f50821dfbb?auto=format&fit=crop&q=80"],
  goa: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&q=80"],
  kerala: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1593693397690-362cb9666c6b?auto=format&fit=crop&q=80"],
  rajasthan: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80"],
  uttarakhand: ["https://images.unsplash.com/photo-1610715936287-6c2ab208cbab?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1626025424563-7c09363a0336?auto=format&fit=crop&q=80"],
  meghalaya: ["https://images.unsplash.com/photo-1588693723321-1b9195b05a63?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1594065620986-13a89e472be3?auto=format&fit=crop&q=80"],
  hampi: ["https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&q=80"],
  andaman: ["https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80"],
  sikkim: ["https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1582490786960-e79e618cb0d7?auto=format&fit=crop&q=80"]
};

for (const [id, images] of Object.entries(galleries)) {
  const str = `id: '${id}',`;
  if (file.includes(str) && !file.includes(`galleryImages: ['${images[0]}'`)) {
    file = file.replace(str, `${str}\n    galleryImages: ['${images[0]}', '${images[1]}'],`);
  }
}

fs.writeFileSync('src/data/dbSeed.ts', file);
