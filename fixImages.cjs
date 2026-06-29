const fs = require('fs');
let file = fs.readFileSync('src/data/dbSeed.ts', 'utf-8');

// Fix Andaman main image
file = file.replace(/title: 'Andaman Islands',\n    country: 'India',\n    lat: 11.9761,\n    lng: 92.9876,\n    image: '\/images\/kashmir.png',/, "title: 'Andaman Islands',\n    country: 'India',\n    lat: 11.9761,\n    lng: 92.9876,\n    image: '/images/andaman.png',");

// Fix stray kashmir images in Rajasthan
file = file.replace(/name: 'Jodhpur \(Blue City\)', (.*?) image: '\/images\/kashmir.png'/g, "name: 'Jodhpur (Blue City)', $1 image: '/images/rajasthan.png'");
file = file.replace(/name: 'Udaipur \(Lake City\)', (.*?) image: '\/images\/kashmir.png'/g, "name: 'Udaipur (Lake City)', $1 image: '/images/rajasthan.png'");

// Fix stray kashmir image in Hampi
file = file.replace(/name: 'Sugriva\\'s Cave', (.*?) image: '\/images\/kashmir.png'/g, "name: 'Sugriva\\'s Cave', $1 image: '/images/hampi.png'");

// Fix stray kashmir image in Andaman
file = file.replace(/name: 'Lalaji Bay Beach \(Long Island\)', (.*?) image: '\/images\/kashmir.png'/g, "name: 'Lalaji Bay Beach (Long Island)', $1 image: '/images/andaman.png'");

fs.writeFileSync('src/data/dbSeed.ts', file);
