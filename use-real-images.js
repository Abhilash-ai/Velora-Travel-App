import fs from 'fs';
import path from 'path';

// Reliable, real Wikipedia/Wikimedia images for Indian tourist spots
const realImages = {
  // Main destinations
  'Kashmir': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dal_Lake_Sunset.jpg/1200px-Dal_Lake_Sunset.jpg',
  'Ladakh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Pangong_Tso_Panorama.jpg/1200px-Pangong_Tso_Panorama.jpg',
  'Goa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Palolem_Beach_Goa.jpg/1200px-Palolem_Beach_Goa.jpg',
  'Kerala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Houseboats_at_Kerala_Backwaters.jpg/1200px-Houseboats_at_Kerala_Backwaters.jpg',
  'Meghalaya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Nohkalikai_Falls_Cherrapunji.jpg/1200px-Nohkalikai_Falls_Cherrapunji.jpg',
  'Rajasthan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Hawa_Mahal_2011.jpg/1200px-Hawa_Mahal_2011.jpg',
  'Andaman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Radhanagar_Beach_Havelock.jpg/1200px-Radhanagar_Beach_Havelock.jpg',
  'Sikkim': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Tsomgo_Lake_Sikkim.jpg/1200px-Tsomgo_Lake_Sikkim.jpg',
  'Uttarakhand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Kedarnath_Temple_Garhwal_Himalaya.jpg/1200px-Kedarnath_Temple_Garhwal_Himalaya.jpg',
  'Hampi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Virupaksha_Temple_Hampi.jpg/1200px-Virupaksha_Temple_Hampi.jpg',
  
  // Transformative Journeys
  'Kerala (Day)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Houseboats_at_Kerala_Backwaters.jpg/1200px-Houseboats_at_Kerala_Backwaters.jpg',
  'Kerala (Sunset)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Sunset_at_Alleppey.jpg/1200px-Sunset_at_Alleppey.jpg',
  'Jaipur (Day)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Amber_Fort_Jaipur.jpg/1200px-Amber_Fort_Jaipur.jpg',
  'Jaipur (Night)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Hawa_Mahal_at_night.jpg/1200px-Hawa_Mahal_at_night.jpg',
  'Kashmir (Summer)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dal_Lake_Sunset.jpg/1200px-Dal_Lake_Sunset.jpg',
  'Kashmir (Winter)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Gulmarg_in_winter.jpg/1200px-Gulmarg_in_winter.jpg',
  'Hampi (Ancient)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hampi_chariot.jpg/1200px-Hampi_chariot.jpg',
  'Hampi (Modern)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Virupaksha_Temple_Hampi.jpg/1200px-Virupaksha_Temple_Hampi.jpg',
  
  // Specific Stops
  'Srinagar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dal_Lake_Sunset.jpg/800px-Dal_Lake_Sunset.jpg',
  'Gulmarg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Gulmarg_in_winter.jpg/800px-Gulmarg_in_winter.jpg',
  'Pahalgam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pahalgam_Valley.jpg/800px-Pahalgam_Valley.jpg',
  'Sonamarg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Sonamarg_Valley.jpg/800px-Sonamarg_Valley.jpg',
  'Aru Valley Meadow': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pahalgam_Valley.jpg/800px-Pahalgam_Valley.jpg',
  'Nigeen Lake Shikara tracks': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dal_Lake_Sunset.jpg/800px-Dal_Lake_Sunset.jpg',
  'Shankaracharya Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Shankaracharya_Temple_Srinagar.jpg/800px-Shankaracharya_Temple_Srinagar.jpg',
  'Hazratbal Shrine': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Hazratbal_Shrine.jpg/800px-Hazratbal_Shrine.jpg',
  'Martand Sun Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Martand_Sun_Temple_Ruins.jpg/800px-Martand_Sun_Temple_Ruins.jpg',
  'Khir Bhawani Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Kheer_Bhawani.jpg/800px-Kheer_Bhawani.jpg',
  'Tulmulla Sacred Spring': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Kheer_Bhawani.jpg/800px-Kheer_Bhawani.jpg',
  
  'Leh Palace Hub': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Leh_Palace_from_town.jpg/800px-Leh_Palace_from_town.jpg',
  'Nubra Valley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Nubra_Valley_Sand_Dunes.jpg/800px-Nubra_Valley_Sand_Dunes.jpg',
  'Pangong Lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Pangong_Tso_Panorama.jpg/800px-Pangong_Tso_Panorama.jpg',
  'Tso Moriri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Tso_Moriri_Lake.jpg/800px-Tso_Moriri_Lake.jpg',
  'Turtuk Village': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Nubra_Valley_Sand_Dunes.jpg/800px-Nubra_Valley_Sand_Dunes.jpg',
  'Stakna Monastery Peak': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Thiksey_Monastery_Ladakh.jpg/800px-Thiksey_Monastery_Ladakh.jpg',
  'Spituk Monastery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Spituk_Monastery.jpg/800px-Spituk_Monastery.jpg',
  'Thiksey Monastery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Thiksey_Monastery_Ladakh.jpg/800px-Thiksey_Monastery_Ladakh.jpg',
  'Hemis Monastery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Hemis_Monastery.jpg/800px-Hemis_Monastery.jpg',
  'Alchi Monastery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Alchi_Monastery.jpg/800px-Alchi_Monastery.jpg',
  'Alchi Carved Assembly Hall': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Alchi_Monastery.jpg/800px-Alchi_Monastery.jpg',

  'Panaji': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Our_Lady_of_the_Immaculate_Conception_Church%2C_Goa.jpg/800px-Our_Lady_of_the_Immaculate_Conception_Church%2C_Goa.jpg',
  'Anjuna & Vagator': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Vagator_Beach.jpg/800px-Vagator_Beach.jpg',
  'Palolem Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Palolem_Beach_Goa.jpg/800px-Palolem_Beach_Goa.jpg',
  'Cola Beach Lagoon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Palolem_Beach_Goa.jpg/800px-Palolem_Beach_Goa.jpg',
  'Fontainhas Streets': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Our_Lady_of_the_Immaculate_Conception_Church%2C_Goa.jpg/800px-Our_Lady_of_the_Immaculate_Conception_Church%2C_Goa.jpg',
  'Basilica of Bom Jesus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Basilica_of_Bom_Jesus.jpg/800px-Basilica_of_Bom_Jesus.jpg',
  'Se Cathedral': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Se_Cathedral_Goa.jpg/800px-Se_Cathedral_Goa.jpg',
  'Church of St. Cajetan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Church_of_St._Cajetan.jpg/800px-Church_of_St._Cajetan.jpg',
  'Mangeshi Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Mangeshi_Temple_Goa.jpg/800px-Mangeshi_Temple_Goa.jpg',
  'St. Augustine Ruin Tower': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/St._Augustine_Tower_Goa.jpg/800px-St._Augustine_Tower_Goa.jpg',

  'Kochi Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Chinese_Fishing_Nets_Kochi.jpg/800px-Chinese_Fishing_Nets_Kochi.jpg',
  'Munnar Hills': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Munnar_Tea_Plantation.jpg/800px-Munnar_Tea_Plantation.jpg',
  'Alappuzha (Alleppey)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Houseboats_at_Kerala_Backwaters.jpg/800px-Houseboats_at_Kerala_Backwaters.jpg',
  'Munroe Island Channels': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Houseboats_at_Kerala_Backwaters.jpg/800px-Houseboats_at_Kerala_Backwaters.jpg',
  'Sree Padmanabhaswamy Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Padmanabhaswamy_Temple.jpg/800px-Padmanabhaswamy_Temple.jpg',
  'Aranmula Parthasarathy Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Houseboats_at_Kerala_Backwaters.jpg/800px-Houseboats_at_Kerala_Backwaters.jpg',
  "St. Mary's Forane Church": 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Chinese_Fishing_Nets_Kochi.jpg/800px-Chinese_Fishing_Nets_Kochi.jpg',
  'Guruvayur Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Padmanabhaswamy_Temple.jpg/800px-Padmanabhaswamy_Temple.jpg',
  'Aranmula Mirror Workshop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Padmanabhaswamy_Temple.jpg/800px-Padmanabhaswamy_Temple.jpg',

  'Jaipur (Pink City)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Hawa_Mahal_2011.jpg/800px-Hawa_Mahal_2011.jpg',
  'Jodhpur (Blue City)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Mehrangarh_Fort_Jodhpur.jpg/800px-Mehrangarh_Fort_Jodhpur.jpg',
  'Udaipur (Lake City)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Lake_Palace_Udaipur.jpg/800px-Lake_Palace_Udaipur.jpg',
  'Abhaneri Stepwell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Chand_Baori.jpg/800px-Chand_Baori.jpg',
  'Brahma Temple Pushkar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Pushkar_Lake.jpg/800px-Pushkar_Lake.jpg',
  'Ajmer Sharif Dargah': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Pushkar_Lake.jpg/800px-Pushkar_Lake.jpg',
  'Dilwara Jain Temples': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Lake_Palace_Udaipur.jpg/800px-Lake_Palace_Udaipur.jpg',
  'Karni Mata Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Mehrangarh_Fort_Jodhpur.jpg/800px-Mehrangarh_Fort_Jodhpur.jpg',
  'Savitri Temple Hilltop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Pushkar_Lake.jpg/800px-Pushkar_Lake.jpg',

  'Rishikesh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Rishikesh_view.jpg/800px-Rishikesh_view.jpg',
  'Auli Meadows': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Auli_in_Winter.jpg/800px-Auli_in_Winter.jpg',
  'Valley of Flowers Trail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Valley_of_Flowers.jpg/800px-Valley_of_Flowers.jpg',
  'Yamunotri Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Kedarnath_Temple_Garhwal_Himalaya.jpg/800px-Kedarnath_Temple_Garhwal_Himalaya.jpg',
  'Gangotri Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Kedarnath_Temple_Garhwal_Himalaya.jpg/800px-Kedarnath_Temple_Garhwal_Himalaya.jpg',
  'Kedarnath Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Kedarnath_Temple_Garhwal_Himalaya.jpg/800px-Kedarnath_Temple_Garhwal_Himalaya.jpg',
  'Badrinath Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Kedarnath_Temple_Garhwal_Himalaya.jpg/800px-Kedarnath_Temple_Garhwal_Himalaya.jpg',
  'Mana Village Border Post': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Auli_in_Winter.jpg/800px-Auli_in_Winter.jpg',

  'Virupaksha Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Virupaksha_Temple_Hampi.jpg/800px-Virupaksha_Temple_Hampi.jpg',
  'Stone Chariot Vittala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hampi_chariot.jpg/800px-Hampi_chariot.jpg',
  'Hemakuta Hill Sunset': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Virupaksha_Temple_Hampi.jpg/800px-Virupaksha_Temple_Hampi.jpg',
  'Anegundi Village Outpost': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Virupaksha_Temple_Hampi.jpg/800px-Virupaksha_Temple_Hampi.jpg',
  'Kodandarama Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Virupaksha_Temple_Hampi.jpg/800px-Virupaksha_Temple_Hampi.jpg',
  'Achyutaraya Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hampi_chariot.jpg/800px-Hampi_chariot.jpg',
  'Hazara Rama Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Virupaksha_Temple_Hampi.jpg/800px-Virupaksha_Temple_Hampi.jpg',
  "Sugriva's Cave": 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hampi_chariot.jpg/800px-Hampi_chariot.jpg',

  'Port Blair Port': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Cellular_Jail_Port_Blair.jpg/800px-Cellular_Jail_Port_Blair.jpg',
  'Radhanagar Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Radhanagar_Beach_Havelock.jpg/800px-Radhanagar_Beach_Havelock.jpg',
  'Neil Island Natural Arch': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Radhanagar_Beach_Havelock.jpg/800px-Radhanagar_Beach_Havelock.jpg',
  'Lalaji Bay Beach (Long Island)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Radhanagar_Beach_Havelock.jpg/800px-Radhanagar_Beach_Havelock.jpg',
  'Cellular Jail': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Cellular_Jail_Port_Blair.jpg/800px-Cellular_Jail_Port_Blair.jpg',
  'Netaji Subhash Chandra Bose Island': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Cellular_Jail_Port_Blair.jpg/800px-Cellular_Jail_Port_Blair.jpg',
  'Viper Island Gallows': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Cellular_Jail_Port_Blair.jpg/800px-Cellular_Jail_Port_Blair.jpg',
  'Ross Island Cemetery Ruins': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Cellular_Jail_Port_Blair.jpg/800px-Cellular_Jail_Port_Blair.jpg',
};

// Also generic nice Indian landscape fallback
const genericIndianLandscape = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Hawa_Mahal_2011.jpg/1200px-Hawa_Mahal_2011.jpg';

// Now we need to parse dbSeed.ts, HorizontalShowcase.tsx, TransformativeJourneys.tsx, etc.
// and replace any image link with the mapped real image based on its context object or name.
// Since we blindly replaced with picsum, let's use AST or regex to find the name of the object.

const dbSeedPath = path.join(process.cwd(), 'src/data/dbSeed.ts');
let dbSeedContent = fs.readFileSync(dbSeedPath, 'utf-8');

// Using regex to find blocks of data and replace their image property.
Object.keys(realImages).forEach(key => {
  const url = realImages[key];
  
  // Replace in stops or hiddenGems: { name: 'Key', ..., image: '...' }
  const regex = new RegExp(`name:\\s*['"]${key.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}['"][^}]+?image:\\s*['"][^'"]+['"]`, 'g');
  dbSeedContent = dbSeedContent.replace(regex, (match) => {
    return match.replace(/image:\s*['"][^'"]+['"]/, `image: '${url}'`);
  });

  // Replace top-level destinations: id: 'kashmir', title: 'Kashmir', ..., image: '...'
  const topLevelRegex = new RegExp(`title:\\s*['"]${key.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}['"][\\s\\S]+?image:\\s*['"][^'"]+['"]`, 'g');
  dbSeedContent = dbSeedContent.replace(topLevelRegex, (match) => {
    return match.replace(/image:\s*['"][^'"]+['"]/, `image: '${url}'`);
  });
});

fs.writeFileSync(dbSeedPath, dbSeedContent, 'utf-8');
console.log('Fixed dbSeed.ts');

const showcasePath = path.join(process.cwd(), 'src/components/agency/HorizontalShowcase.tsx');
let showcaseContent = fs.readFileSync(showcasePath, 'utf-8');

Object.keys(realImages).forEach(key => {
  const url = realImages[key];
  // Replace in showcaseDestinations: name: 'Kashmir', ..., img: '...'
  const regex = new RegExp(`name:\\s*['"]${key.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}['"][^}]+?img:\\s*['"][^'"]+['"]`, 'g');
  showcaseContent = showcaseContent.replace(regex, (match) => {
    return match.replace(/img:\s*['"][^'"]+['"]/, `img: '${url}'`);
  });
});
fs.writeFileSync(showcasePath, showcaseContent, 'utf-8');
console.log('Fixed HorizontalShowcase.tsx');

const transformativePath = path.join(process.cwd(), 'src/components/agency/TransformativeJourneys.tsx');
let transformativeContent = fs.readFileSync(transformativePath, 'utf-8');

Object.keys(realImages).forEach(key => {
  const url = realImages[key];
  // the labels in BeforeAfterSlider look like: labelBefore="Kerala (Day)" 
  // We need to replace beforeImage="..." or afterImage="..." depending on the label.
  
  const regexBefore = new RegExp(`beforeImage=["'][^"']+["'][\\s\\S]*?labelBefore=["']${key.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}["']`, 'g');
  transformativeContent = transformativeContent.replace(regexBefore, (match) => {
    return match.replace(/beforeImage=["'][^"']+["']/, `beforeImage="${url}"`);
  });

  const regexAfter = new RegExp(`afterImage=["'][^"']+["'][\\s\\S]*?labelAfter=["']${key.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}["']`, 'g');
  transformativeContent = transformativeContent.replace(regexAfter, (match) => {
    return match.replace(/afterImage=["'][^"']+["']/, `afterImage="${url}"`);
  });
});
fs.writeFileSync(transformativePath, transformativeContent, 'utf-8');
console.log('Fixed TransformativeJourneys.tsx');


// Finally, any remaining picsum links across src/components/agency, let's replace with generic landscape just in case
const agencyPath = path.join(process.cwd(), 'src/components/agency');
const files = fs.readdirSync(agencyPath).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(agencyPath, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('picsum.photos')) {
    content = content.replace(/https:\/\/picsum\.photos\/seed\/[^'"]+/g, genericIndianLandscape);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Replaced remaining picsum links in ${file}`);
  }
}
