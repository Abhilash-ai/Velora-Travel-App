import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\9f99277a-ad70-4b79-91f0-75f96943392f';
const publicImagesDir = path.join(process.cwd(), 'public', 'images');

fs.mkdirSync(publicImagesDir, { recursive: true });

// Copy artifacts to public/images
const imagesToCopy = {
  'kashmir_dal_lake_1782629733582.png': 'kashmir.png',
  'ladakh_pangong_1782629744284.png': 'ladakh.png',
  'goa_beach_1782629755400.png': 'goa.png',
  'kerala_backwaters_1782629766504.png': 'kerala.png',
  'rajasthan_fort_1782629777364.png': 'rajasthan.png',
  'uttarakhand_himalayas_1782629788159.png': 'uttarakhand.png',
  'hampi_ruins_1782629802220.png': 'hampi.png',
  'andaman_beach_1782629813258.png': 'andaman.png'
};

for (const [artifact, finalName] of Object.entries(imagesToCopy)) {
  fs.copyFileSync(path.join(artifactsDir, artifact), path.join(publicImagesDir, finalName));
}

// Now replace Wikimedia links in dbSeed.ts, HorizontalShowcase.tsx, TransformativeJourneys.tsx
const localImages = {
  'Kashmir': '/images/kashmir.png',
  'Ladakh': '/images/ladakh.png',
  'Goa': '/images/goa.png',
  'Kerala': '/images/kerala.png',
  'Meghalaya': '/images/uttarakhand.png',
  'Rajasthan': '/images/rajasthan.png',
  'Andaman': '/images/andaman.png',
  'Sikkim': '/images/uttarakhand.png',
  'Uttarakhand': '/images/uttarakhand.png',
  'Hampi': '/images/hampi.png'
};

const mapWikiToLocal = {
  'Dal_Lake_Sunset.jpg': '/images/kashmir.png',
  'Pangong_Tso_Panorama.jpg': '/images/ladakh.png',
  'Palolem_Beach_Goa.jpg': '/images/goa.png',
  'Houseboats_at_Kerala_Backwaters.jpg': '/images/kerala.png',
  'Nohkalikai_Falls_Cherrapunji.jpg': '/images/uttarakhand.png',
  'Hawa_Mahal_2011.jpg': '/images/rajasthan.png',
  'Radhanagar_Beach_Havelock.jpg': '/images/andaman.png',
  'Tsomgo_Lake_Sikkim.jpg': '/images/uttarakhand.png',
  'Kedarnath_Temple_Garhwal_Himalaya.jpg': '/images/uttarakhand.png',
  'Virupaksha_Temple_Hampi.jpg': '/images/hampi.png',
  'Sunset_at_Alleppey.jpg': '/images/kerala.png',
  'Amber_Fort_Jaipur.jpg': '/images/rajasthan.png',
  'Hawa_Mahal_at_night.jpg': '/images/rajasthan.png',
  'Gulmarg_in_winter.jpg': '/images/kashmir.png',
  'Hampi_chariot.jpg': '/images/hampi.png',
  'Pahalgam_Valley.jpg': '/images/kashmir.png',
  'Sonamarg_Valley.jpg': '/images/kashmir.png',
  'Shankaracharya_Temple_Srinagar.jpg': '/images/kashmir.png',
  'Hazratbal_Shrine.jpg': '/images/kashmir.png',
  'Martand_Sun_Temple_Ruins.jpg': '/images/kashmir.png',
  'Kheer_Bhawani.jpg': '/images/kashmir.png',
  'Leh_Palace_from_town.jpg': '/images/ladakh.png',
  'Nubra_Valley_Sand_Dunes.jpg': '/images/ladakh.png',
  'Tso_Moriri_Lake.jpg': '/images/ladakh.png',
  'Thiksey_Monastery_Ladakh.jpg': '/images/ladakh.png',
  'Spituk_Monastery.jpg': '/images/ladakh.png',
  'Hemis_Monastery.jpg': '/images/ladakh.png',
  'Alchi_Monastery.jpg': '/images/ladakh.png',
  'Our_Lady_of_the_Immaculate_Conception_Church%2C_Goa.jpg': '/images/goa.png',
  'Vagator_Beach.jpg': '/images/goa.png',
  'Basilica_of_Bom_Jesus.jpg': '/images/goa.png',
  'Se_Cathedral_Goa.jpg': '/images/goa.png',
  'Church_of_St._Cajetan.jpg': '/images/goa.png',
  'Mangeshi_Temple_Goa.jpg': '/images/goa.png',
  'St._Augustine_Tower_Goa.jpg': '/images/goa.png',
  'Chinese_Fishing_Nets_Kochi.jpg': '/images/kerala.png',
  'Munnar_Tea_Plantation.jpg': '/images/kerala.png',
  'Padmanabhaswamy_Temple.jpg': '/images/kerala.png',
  'Mehrangarh_Fort_Jodhpur.jpg': '/images/rajasthan.png',
  'Lake_Palace_Udaipur.jpg': '/images/rajasthan.png',
  'Chand_Baori.jpg': '/images/rajasthan.png',
  'Pushkar_Lake.jpg': '/images/rajasthan.png',
  'Rishikesh_view.jpg': '/images/uttarakhand.png',
  'Auli_in_Winter.jpg': '/images/uttarakhand.png',
  'Valley_of_Flowers.jpg': '/images/uttarakhand.png',
  'Cellular_Jail_Port_Blair.jpg': '/images/andaman.png'
};

function replaceWikiLinks(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  Object.keys(mapWikiToLocal).forEach(wikiImage => {
    // Replace the entire wikimedia url with the local image path
    const regex = new RegExp(`https:\\/\\/upload\\.wikimedia\\.org\\/wikipedia\\/commons\\/thumb\\/[^\\/]+\\/[^\\/]+\\/${wikiImage.replace(/\\./g, '\\.')}\\/[0-9]+px-${wikiImage.replace(/\\./g, '\\.')}`, 'g');
    content = content.replace(regex, mapWikiToLocal[wikiImage]);
  });
  
  // generic catch-all for any remaining wikimedia
  content = content.replace(/https:\/\/upload\.wikimedia\.org\/[^'"]+/g, '/images/kashmir.png');
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Replaced in ${filePath}`);
}

replaceWikiLinks(path.join(process.cwd(), 'src/data/dbSeed.ts'));
replaceWikiLinks(path.join(process.cwd(), 'src/components/agency/HorizontalShowcase.tsx'));
replaceWikiLinks(path.join(process.cwd(), 'src/components/agency/TransformativeJourneys.tsx'));

const agencyPath = path.join(process.cwd(), 'src/components/agency');
const files = fs.readdirSync(agencyPath).filter(f => f.endsWith('.tsx'));
for (const file of files) {
  replaceWikiLinks(path.join(agencyPath, file));
}
