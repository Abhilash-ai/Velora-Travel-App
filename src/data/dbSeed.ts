export interface SpiritualTrail {
  name: string;
  desc: string;
  stops: { name: string; desc: string; time: string; distance: string; lat: number; lng: number; image: string }[];
  hiddenGems?: { name: string; desc: string; lat: number; lng: number; photoScore?: number; crowdLevel: 'Low' | 'Moderate'; bestTime?: string; image: string }[];
  emergencyContacts: {
    hospitalName: string;
    hospitalPhone: string;
    hospitalDistance: string;
    policeName: string;
    policePhone: string;
  };
}

export interface SeedDestination {
  id: string;
  title: string;
  country: string;
  lat: number;
  lng: number;
  image: string;
  galleryImages?: string[];
  rating: number;
  reviewsCount?: number;
  description: string;
  price: string;
  beautyScore?: number;
  photoScore: number;
  serenityScore: number;
  crowdLevel: 'Low' | 'Moderate' | 'High';
  bestTime: string;
  tags: string[];
  localFood: { name: string; desc: string; cost: string }[];
  culture: string;
  weather: string;
  reviewsList: { user: string; text: string; rating: number }[];
  stops: { name: string; desc: string; time: string; distance: string; lat: number; lng: number; image: string }[];
  hiddenGems: { name: string; desc: string; lat: number; lng: number; photoScore: number; crowdLevel: 'Low' | 'Moderate'; bestTime: string; image: string }[];
  spiritualTrails?: SpiritualTrail[];
  emergencyContacts: {
    hospitalName: string;
    hospitalPhone: string;
    hospitalDistance: string;
    policeName: string;
    policePhone: string;
  };
}

export const seedDestinations: SeedDestination[] = [
  {
    id: 'kashmir',
    galleryImages: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1571401835393-8b5e917711d9?auto=format&fit=crop&q=80'],
    title: 'Kashmir',
    country: 'India',
    lat: 34.0837,
    lng: 74.7973,
    image: '/images/kashmir.png',
    rating: 4.95,
    reviewsCount: 1240,
    description: 'Known as Heaven on Earth, Kashmir is an alpine paradise of emerald lakes, glowing golden chinars, towering snow peaks, and peaceful valleys where storybook shikaras drift through quiet morning mist.',
    price: '18500',
    beautyScore: 99,
    photoScore: 98,
    serenityScore: 97,
    crowdLevel: 'Moderate',
    bestTime: 'March to October (Spring/Autumn)',
    tags: ['Mountains', 'Adventure', 'Nature'],
    localFood: [
      { name: 'Kashmiri Wazwan', desc: 'A multi-course aromatic lamb banquet cooked overnight.', cost: '$$$' },
      { name: 'Kahwa Tea', desc: 'Traditional green tea brewed with saffron, almonds, and cardamom.', cost: '$' }
    ],
    culture: 'A rich blend of Sufi traditions, Kashmiri craftsmanship in wood and Pashmina shawls, and peaceful lake communities.',
    weather: 'Cool summers (15°C to 25°C) and freezing winters (-5°C to 5°C) with heavy snowfall.',
    reviewsList: [
      { user: 'Aman V.', text: 'Riding a shikara on Dal Lake in early morning is an emotional experience.', rating: 5 },
      { user: 'Sonia K.', text: 'The absolute best scenery. Highly recommend Sonamarg valleys.', rating: 5 }
    ],
    stops: [
      { name: 'Srinagar', desc: 'The summer capital, famous for Dal Lake houseboats and Mughal Gardens.', time: 'Day 1', distance: '0 km', lat: 34.0837, lng: 74.7973, image: '/images/kashmir.png' },
      { name: 'Gulmarg', desc: 'Meadow of Flowers, home to one of the world\'s highest cable car gondolas.', time: 'Day 2', distance: '51 km', lat: 34.0489, lng: 74.3804, image: '/images/kashmir.png' },
      { name: 'Pahalgam', desc: 'Lidder Valley scenic path, surrounded by pine forests and glacial streams.', time: 'Day 3', distance: '95 km', lat: 34.0161, lng: 75.3149, image: '/images/kashmir.png' },
      { name: 'Sonamarg', desc: 'Meadow of Gold, starting point for high alpine treks and glacier walks.', time: 'Day 4', distance: '80 km', lat: 34.3012, lng: 75.2915, image: '/images/kashmir.png' }
    ],
    hiddenGems: [
      { name: 'Aru Valley Meadow', desc: 'A serene mountain village grassland tucked behind Pahalgam hills, untouched by commercial shops.', lat: 34.0886, lng: 75.2638, photoScore: 95, crowdLevel: 'Low', bestTime: 'Sunrise', image: '/images/kashmir.png' },
      { name: 'Nigeen Lake Shikara tracks', desc: 'A quiet, vegetation-framed waterway route offering ultimate sunset mirrors away from Dal Lake.', lat: 34.1121, lng: 74.8239, photoScore: 92, crowdLevel: 'Low', bestTime: 'Golden Hour', image: '/images/kashmir.png' }
    ],
    spiritualTrails: [
      {
        name: 'Kashmir Sufi & Temple Trail',
        desc: 'A sacred journey visiting ancient stone temples and peaceful Sufi shrines nestled in the valley.',
        stops: [
          { name: 'Shankaracharya Temple', desc: 'An ancient Shiva temple perched on top of Shankaracharya Hill, offering panoramic views of Srinagar.', time: 'Day 1', distance: '0 km', lat: 34.0722, lng: 74.8431, image: '/images/kashmir.png' },
          { name: 'Hazratbal Shrine', desc: 'A white marble shrine on the banks of Dal Lake housing a sacred relic of Prophet Muhammad.', time: 'Day 2', distance: '12 km', lat: 34.1206, lng: 74.8398, image: '/images/kashmir.png' },
          { name: 'Martand Sun Temple', desc: 'Majestic stone ruins of an 8th-century temple dedicated to the Sun God Surya, built by King Lalitaditya.', time: 'Day 3', distance: '64 km', lat: 33.7461, lng: 75.2014, image: '/images/kashmir.png' },
          { name: 'Khir Bhawani Temple', desc: 'A highly revered temple in Tulmulla dedicated to Goddess Ragnya Devi, featuring a sacred changing-color spring.', time: 'Day 4', distance: '82 km', lat: 34.2259, lng: 74.7436, image: '/images/kashmir.png' }
        ],
        hiddenGems: [
          { name: 'Tulmulla Sacred Spring', desc: 'The mystical spring inside Khir Bhawani temple complex that historically shifts colors during festivals.', lat: 34.2265, lng: 74.7441, photoScore: 90, crowdLevel: 'Low', bestTime: 'Sunrise', image: '/images/kashmir.png' }
        ],
        emergencyContacts: {
          hospitalName: 'Anantnag District Hospital',
          hospitalPhone: '+911932222123',
          hospitalDistance: '4.5 km',
          policeName: 'Anantnag Police Station',
          policePhone: '+911932222822'
        }
      }
    ],
    emergencyContacts: {
      hospitalName: 'Srinagar SMHS Hospital',
      hospitalPhone: '+911942501254',
      hospitalDistance: '3.5 km',
      policeName: 'Srinagar Central Police Station',
      policePhone: '+911942452222'
    }
  },
  {
    id: 'ladakh',
    galleryImages: ['https://images.unsplash.com/photo-1626014903702-0c91ebcfbd7e?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1581793745862-99f50821dfbb?auto=format&fit=crop&q=80'],
    title: 'Ladakh',
    country: 'India',
    lat: 34.1526,
    lng: 77.5771,
    image: '/images/ladakh.png',
    rating: 4.97,
    reviewsCount: 1450,
    description: 'A high-altitude cold desert where bare brown valleys frame deep azure lakes, and fluttering prayer flags guard ancient Buddhist monasteries perched precariously on dramatic mountain ridges.',
    price: '24500',
    beautyScore: 98,
    photoScore: 99,
    serenityScore: 99,
    crowdLevel: 'Low',
    bestTime: 'June to September',
    tags: ['Adventure', 'Mountains', 'Spiritual'],
    localFood: [
      { name: 'Thukpa', desc: 'A hearty noodle soup flavored with local mountain herbs and vegetables.', cost: '$' },
      { name: 'Momos & Yak Cheese', desc: 'Steamed dumplings paired with rich, salty yak milk cheese.', cost: '$' }
    ],
    culture: 'Tibetan Buddhist monasteries, monastic festivals, and eco-friendly mountain village heritage.',
    weather: 'Mild sunlit summers (15°C to 20°C) and sub-zero, stark winters (-20°C to -10°C).',
    reviewsList: [
      { user: 'Vikram S.', text: 'Riding a bike through Khardung La is a milestone every adventurer needs.', rating: 5 },
      { user: 'Rohan D.', text: 'Pangong Tso looks completely unreal, colors shift from green to deep blue.', rating: 5 }
    ],
    stops: [
      { name: 'Leh Palace Hub', desc: 'Base town built around the historic 17th-century nine-story Leh Palace.', time: 'Day 1', distance: '0 km', lat: 34.1526, lng: 77.5771, image: '/images/ladakh.png' },
      { name: 'Nubra Valley', desc: 'Cross Khardung La pass to ride Bactrian camels in cold desert sand dunes.', time: 'Day 2', distance: '125 km', lat: 34.4259, lng: 77.5315, image: '/images/ladakh.png' },
      { name: 'Pangong Lake', desc: 'Endorheic lake shared with Tibet, changing shades under changing cloud cover.', time: 'Day 3', distance: '150 km', lat: 33.7380, lng: 78.9184, image: '/images/ladakh.png' },
      { name: 'Tso Moriri', desc: 'A remote, high-altitude sanctuary reflecting stark snow-capped peak outlines.', time: 'Day 4', distance: '220 km', lat: 32.9038, lng: 78.3184, image: '/images/ladakh.png' }
    ],
    hiddenGems: [
      { name: 'Turtuk Village', desc: 'A remote Baltic village on the India-Pakistan border loaded with apricot orchards.', lat: 34.8428, lng: 76.8335, photoScore: 97, crowdLevel: 'Low', bestTime: 'Midday', image: '/images/ladakh.png' },
      { name: 'Stakna Monastery Peak', desc: 'A tiger-nose shaped mountain monastery offering the ultimate view of the Indus River.', lat: 34.0048, lng: 77.6853, photoScore: 94, crowdLevel: 'Low', bestTime: 'Sunrise', image: '/images/ladakh.png' }
    ],
    spiritualTrails: [
      {
        name: 'Indus Valley Monastery Trail',
        desc: 'A high-altitude pilgrimage visiting the most historic and stunning Buddhist monasteries of Ladakh.',
        stops: [
          { name: 'Spituk Monastery', desc: 'An 11th-century fortress monastery overlooking the Indus River, housing a giant image of Palden Lhamo.', time: 'Day 1', distance: '0 km', lat: 34.1264, lng: 77.5250, image: '/images/ladakh.png' },
          { name: 'Thiksey Monastery', desc: 'A spectacular twelve-story complex built on a rocky hill, bearing a striking resemblance to Lhasa\'s Potala Palace.', time: 'Day 2', distance: '19 km', lat: 34.0560, lng: 77.6667, image: '/images/ladakh.png' },
          { name: 'Hemis Monastery', desc: 'Hidden inside a deep mountain gorge, this is the largest and wealthiest monastery in Ladakh, famous for its annual festival.', time: 'Day 3', distance: '24 km', lat: 33.9128, lng: 77.7019, image: '/images/ladakh.png' },
          { name: 'Alchi Monastery', desc: 'A unique riverside monastery complex famous for its ancient, well-preserved Indo-Kashmiri wall paintings.', time: 'Day 4', distance: '66 km', lat: 34.2237, lng: 77.1752, image: '/images/ladakh.png' }
        ],
        hiddenGems: [
          { name: 'Alchi Carved Assembly Hall', desc: 'An ancient temple chamber inside Alchi with spectacular, detailed wooden pillars from the 11th century.', lat: 34.2242, lng: 77.1758, photoScore: 95, crowdLevel: 'Low', bestTime: 'Morning', image: '/images/ladakh.png' }
        ],
        emergencyContacts: {
          hospitalName: 'Kharu Sub-District Clinic',
          hospitalPhone: '+911982240101',
          hospitalDistance: '8.2 km',
          policeName: 'Kharu Police Outpost',
          policePhone: '+911982240100'
        }
      }
    ],
    emergencyContacts: {
      hospitalName: 'SNM Hospital Leh',
      hospitalPhone: '+911982252014',
      hospitalDistance: '1.8 km',
      policeName: 'Leh District Police Station',
      policePhone: '+911982252200'
    }
  },
  {
    id: 'goa',
    galleryImages: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&q=80'],
    title: 'Goa',
    country: 'India',
    lat: 15.2993,
    lng: 74.1240,
    image: '/images/goa.png',
    rating: 4.8,
    reviewsCount: 2200,
    description: 'A coastal retreat of swaying palms, warm golden sands, historic Portuguese architecture, spice plantations, and slow, relaxing beach sunsets.',
    price: '12500',
    beautyScore: 90,
    photoScore: 92,
    serenityScore: 85,
    crowdLevel: 'High',
    bestTime: 'November to February',
    tags: ['Coastal', 'Gastronomy', 'Relaxing'],
    localFood: [
      { name: 'Fish Curry Rice', desc: 'A spicy coconut-based curry loaded with fresh catch of the day.', cost: '$$' },
      { name: 'Bebinca', desc: 'A rich multi-layered traditional Goan dessert made with coconut milk.', cost: '$' }
    ],
    culture: 'A unique blend of Indo-Portuguese history, baroque churches, and traditional fishing music.',
    weather: 'Warm and humid year-round (24°C to 32°C) with massive monsoon downpours.',
    reviewsList: [
      { user: 'Clara M.', text: 'The churches in Old Goa feel like stepping back in time.', rating: 4 },
      { user: 'Priya R.', text: 'South Goa beaches are so quiet compared to the north.', rating: 5 }
    ],
    stops: [
      { name: 'Panaji', desc: 'State capital, featuring the Latin Quarter (Fontainhas) and river cruises.', time: 'Day 1', distance: '0 km', lat: 15.4909, lng: 73.8567, image: '/images/goa.png' },
      { name: 'Anjuna & Vagator', desc: 'Red rock cliffs, famous beaches, and vibrant open-air flea markets.', time: 'Day 2', distance: '22 km', lat: 15.5925, lng: 73.7431, image: '/images/goa.png' },
      { name: 'Palolem Beach', desc: 'A crescent-shaped quiet bay in south Goa lined with colorful beach shacks.', time: 'Day 3', distance: '70 km', lat: 15.0100, lng: 74.0200, image: '/images/goa.png' }
    ],
    hiddenGems: [
      { name: 'Cola Beach Lagoon', desc: 'A fresh-water emerald lagoon meeting the ocean wave front directly.', lat: 15.0543, lng: 73.9712, photoScore: 96, crowdLevel: 'Low', bestTime: 'Golden Hour', image: '/images/goa.png' },
      { name: 'Fontainhas Streets', desc: 'Charming Portuguese houses painted in bright yellows, blues, and reds.', lat: 15.4950, lng: 73.8600, photoScore: 91, crowdLevel: 'Moderate', bestTime: 'Early Morning', image: '/images/goa.png' }
    ],
    spiritualTrails: [
      {
        name: 'Old Goa Baroque Church & Temple Trail',
        desc: 'Explore the majestic 16th-century cathedrals and sanctuaries of old Portuguese Goa, combined with ancient inland shrines.',
        stops: [
          { name: 'Basilica of Bom Jesus', desc: 'UNESCO World Heritage site housing the sacred, preserved mortal remains of St. Francis Xavier.', time: 'Day 1', distance: '0 km', lat: 15.5009, lng: 73.9116, image: '/images/goa.png' },
          { name: 'Se Cathedral', desc: 'One of the largest churches in Asia, built in Portuguese-Gothic style with a famous Golden Bell.', time: 'Day 2', distance: '0.8 km', lat: 15.5034, lng: 73.9123, image: '/images/goa.png' },
          { name: 'Church of St. Cajetan', desc: 'A beautiful white church built by Italian friars, architecturally modeled after St. Peter\'s Basilica in Rome.', time: 'Day 3', distance: '1.2 km', lat: 15.5039, lng: 73.9175, image: '/images/goa.png' },
          { name: 'Mangeshi Temple', desc: 'A historic, grand temple dedicated to Lord Shiva, featuring a beautiful seven-story octagonal lamp tower (Deepastambha).', time: 'Day 4', distance: '21 km', lat: 15.4439, lng: 73.9686, image: '/images/goa.png' }
        ],
        hiddenGems: [
          { name: 'St. Augustine Ruin Tower', desc: 'A towering 46-meter high brick structure, the sole surviving component of a grand 1602 monastery.', lat: 15.4988, lng: 73.9056, photoScore: 93, crowdLevel: 'Low', bestTime: 'Sunset', image: '/images/goa.png' }
        ],
        emergencyContacts: {
          hospitalName: 'Ponda Sub-District Hospital',
          hospitalPhone: '+918322312115',
          hospitalDistance: '5.4 km',
          policeName: 'Ponda Police Station',
          policePhone: '+918322312214'
        }
      }
    ],
    emergencyContacts: {
      hospitalName: 'Manipal Hospital Goa',
      hospitalPhone: '+918323048800',
      hospitalDistance: '6.2 km',
      policeName: 'Panaji Police Station',
      policePhone: '+918322420876'
    }
  },
  {
    id: 'kerala',
    galleryImages: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1593693397690-362cb9666c6b?auto=format&fit=crop&q=80'],
    title: 'Kerala',
    country: 'India',
    lat: 10.8505,
    lng: 76.2711,
    image: '/images/kerala.png',
    rating: 4.9,
    reviewsCount: 1650,
    description: 'God\'s Own Country. A tropical labyrinth of green coconut backwaters, foggy mountain tea fields, wildlife reserves, and ancient Ayurvedic spas.',
    price: '16500',
    beautyScore: 95,
    photoScore: 94,
    serenityScore: 96,
    crowdLevel: 'Moderate',
    bestTime: 'September to March',
    tags: ['Nature', 'Relaxing', 'Culture'],
    localFood: [
      { name: 'Karimeen Pollichathu', desc: 'Pearl spot fish marinated in spices, wrapped and baked in a banana leaf.', cost: '$$' },
      { name: 'Appam with Stew', desc: 'Fermented rice pancakes served with a mild, aromatic coconut stew.', cost: '$' }
    ],
    culture: 'Traditional Kathakali classical dance, Kalaripayattu martial arts, and Ayurvedic healing.',
    weather: 'Humid tropical coastal weather, cooling significantly in Munnar mountains (12°C to 18°C).',
    reviewsList: [
      { user: 'Diana B.', text: 'Sleeping on an Alleppey houseboat while floating past village shores was magic.', rating: 5 }
    ],
    stops: [
      { name: 'Kochi Fort', desc: 'Historic port town showing Chinese fishing nets and colonial spice warehouses.', time: 'Day 1', distance: '0 km', lat: 9.9667, lng: 76.2417, image: '/images/kerala.png' },
      { name: 'Munnar Hills', desc: 'Vast, rolling emerald green tea estates carpeted in low mountain clouds.', time: 'Day 2', distance: '130 km', lat: 10.0889, lng: 77.0595, image: '/images/kerala.png' },
      { name: 'Alappuzha (Alleppey)', desc: 'The hub of houseboats, floating through silent canal systems and coconut lagoons.', time: 'Day 3', distance: '140 km', lat: 9.4981, lng: 76.3388, image: '/images/kerala.png' }
    ],
    hiddenGems: [
      { name: 'Munroe Island Channels', desc: 'A tiny backwater island village containing narrow channels arching with canopy greens.', lat: 8.9833, lng: 76.6083, photoScore: 95, crowdLevel: 'Low', bestTime: 'Sunrise', image: '/images/kerala.png' }
    ],
    spiritualTrails: [
      {
        name: 'Sopanam Temple & Church Trail',
        desc: 'A serene trail through ancient spice-route churches and towering golden temple arches in southern Kerala.',
        stops: [
          { name: 'Sree Padmanabhaswamy Temple', desc: 'The wealthiest temple in the world, displaying stunning Dravidian stone architecture and housing the deity in Anantha Sayanam posture.', time: 'Day 1', distance: '0 km', lat: 8.4830, lng: 76.9436, image: '/images/kerala.png' },
          { name: 'Aranmula Parthasarathy Temple', desc: 'A historic Krishna temple on the Pamba River, famous for metal alloy mirrors (Aranmula Kannadi) and classical boat races.', time: 'Day 2', distance: '115 km', lat: 9.3294, lng: 76.6853, image: '/images/kerala.png' },
          { name: 'St. Mary\'s Forane Church', desc: 'An ancient church in Kuravilangad founded in 105 AD, rich in historical Christian bells and stone cross artifacts.', time: 'Day 3', distance: '55 km', lat: 9.7547, lng: 76.5647, image: '/images/kerala.png' },
          { name: 'Guruvayur Temple', desc: 'The Dwaraka of the South, one of the most sacred pilgrimage centers in India, dedicated to Lord Krishna.', time: 'Day 4', distance: '110 km', lat: 10.5947, lng: 76.0378, image: '/images/kerala.png' }
        ],
        hiddenGems: [
          { name: 'Aranmula Mirror Workshop', desc: 'A tiny traditional smith family workspace where the secret polished metal alloy mirrors are hand-cast.', lat: 9.3302, lng: 76.6859, photoScore: 92, crowdLevel: 'Low', bestTime: 'Midday', image: '/images/kerala.png' }
        ],
        emergencyContacts: {
          hospitalName: 'Guruvayur Medical Centre',
          hospitalPhone: '+914872556636',
          hospitalDistance: '1.2 km',
          policeName: 'Guruvayur Police Station',
          policePhone: '+914872556339'
        }
      }
    ],
    emergencyContacts: {
      hospitalName: 'Munnar General Hospital',
      hospitalPhone: '+914865230303',
      hospitalDistance: '2.5 km',
      policeName: 'Munnar Police Station',
      policePhone: '+914865230321'
    }
  },
  {
    id: 'rajasthan',
    galleryImages: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80'],
    title: 'Rajasthan',
    country: 'India',
    lat: 27.0238,
    lng: 74.2179,
    image: '/images/rajasthan.png',
    rating: 4.88,
    reviewsCount: 2100,
    description: 'The Land of Kings. A golden expanse of sand deserts, grand sandstone fortresses, colorful bazaars, and beautiful lakeside palaces.',
    price: '21500',
    beautyScore: 94,
    photoScore: 96,
    serenityScore: 84,
    crowdLevel: 'High',
    bestTime: 'October to March',
    tags: ['Culture', 'Luxury', 'History'],
    localFood: [
      { name: 'Dal Baati Churma', desc: 'Baked wheat balls served with a spicy lentil curry and sweet crushed wheat.', cost: '$$' },
      { name: 'Laal Maas', desc: 'A fiery, slow-cooked royal mutton curry flavored with local dry red chilies.', cost: '$$$' }
    ],
    culture: 'Colorful folk music, puppet shows, block printing, and royal Rajput heritage history.',
    weather: 'Dry and hot in summer (35°C to 45°C), cool and pleasant in winter (10°C to 22°C).',
    reviewsList: [
      { user: 'Steve L.', text: 'Jaisalmer fort looks like a giant sandcastle rising from the desert.', rating: 5 }
    ],
    stops: [
      { name: 'Jaipur (Pink City)', desc: 'State capital, featuring Hawa Mahal, Amer Fort, and historic bazaars.', time: 'Day 1', distance: '0 km', lat: 26.9124, lng: 75.7873, image: '/images/rajasthan.png' },
      { name: 'Jodhpur (Blue City)', desc: 'Houses blue-painted lanes leading to the massive cliffside Mehrangarh Fort.', time: 'Day 2', distance: '335 km', lat: 26.2389, lng: 73.0243, image: '/images/rajasthan.png' },
      { name: 'Udaipur (Lake City)', desc: 'A romantic valley holding the marble Lake Palace afloat on Lake Pichola.', time: 'Day 3', distance: '250 km', lat: 24.5854, lng: 73.7125, image: '/images/rajasthan.png' }
    ],
    hiddenGems: [
      { name: 'Abhaneri Stepwell', desc: 'A massive 13-story symmetric geometric underground well containing 3,500 steps.', lat: 27.0075, lng: 76.6064, photoScore: 96, crowdLevel: 'Low', bestTime: 'Early Morning', image: '/images/rajasthan.png' }
    ],
    spiritualTrails: [
      {
        name: 'Royal Rajput Devotion Trail',
        desc: 'A pilgrim loop covering the sacred temple cities and shrines embedded in the desert sand of Rajasthan.',
        stops: [
          { name: 'Brahma Temple Pushkar', desc: 'One of the extremely rare temples in the world dedicated to Lord Brahma, situated near the holy Pushkar Lake.', time: 'Day 1', distance: '0 km', lat: 26.4883, lng: 74.5492, image: '/images/rajasthan.png' },
          { name: 'Ajmer Sharif Dargah', desc: 'The revered Sufi shrine of Saint Moinuddin Chishti, visited by millions of pilgrims of all faiths.', time: 'Day 2', distance: '15 km', lat: 26.4561, lng: 74.6284, image: '/images/rajasthan.png' },
          { name: 'Dilwara Jain Temples', desc: 'Incredibly intricate white marble Jain temples carved between the 11th and 13th centuries on Mount Abu.', time: 'Day 3', distance: '360 km', lat: 24.5972, lng: 72.7119, image: '/images/rajasthan.png' },
          { name: 'Karni Mata Temple', desc: 'The famous Temple of Rats in Deshnoke, where over 25,000 black rats are protected and revered as holy deities.', time: 'Day 4', distance: '220 km', lat: 27.7903, lng: 73.3408, image: '/images/rajasthan.png' }
        ],
        hiddenGems: [
          { name: 'Savitri Temple Hilltop', desc: 'A ropeway hilltop temple overlooking the complete Pushkar lake valley, spectacular at sunrise.', lat: 26.4875, lng: 74.5385, photoScore: 94, crowdLevel: 'Low', bestTime: 'Sunrise', image: '/images/rajasthan.png' }
        ],
        emergencyContacts: {
          hospitalName: 'Mount Abu Global Hospital',
          hospitalPhone: '+912974238347',
          hospitalDistance: '3.8 km',
          policeName: 'Mount Abu Police Station',
          policePhone: '+912974235414'
        }
      }
    ],
    emergencyContacts: {
      hospitalName: 'SMS Hospital Jaipur',
      hospitalPhone: '+911412560291',
      hospitalDistance: '4.0 km',
      policeName: 'Jaipur Police Station',
      policePhone: '+911412608444'
    }
  },
  {
    id: 'uttarakhand',
    galleryImages: ['https://images.unsplash.com/photo-1610715936287-6c2ab208cbab?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1626025424563-7c09363a0336?auto=format&fit=crop&q=80'],
    title: 'Uttarakhand',
    country: 'India',
    lat: 30.0668,
    lng: 79.0193,
    image: '/images/uttarakhand.png',
    rating: 4.92,
    reviewsCount: 1350,
    description: 'Devbhumi (Land of the Gods). A grand territory of holy rivers, massive Himalayan peaks, serene pine forests, and ancient spiritual pilgrimage circuits.',
    price: '$650',
    beautyScore: 96,
    photoScore: 95,
    serenityScore: 98,
    crowdLevel: 'Moderate',
    bestTime: 'April to June & September to November',
    tags: ['Mountains', 'Spiritual', 'Nature'],
    localFood: [
      { name: 'Aloo Ke Gutke', desc: 'Spiced baby potatoes seasoned with local mountain herbs.', cost: '$' },
      { name: 'Kafuli', desc: 'A rich green spinach and fenugreek gravy prepared in iron woks.', cost: '$' }
    ],
    culture: 'Ganga Aarti ceremonies, ashrams, sacred temples, and peaceful mountain village lifestyles.',
    weather: 'Pleasant summers (15°C to 25°C) and heavy winter snowfall (-5°C to 10°C) in high altitudes.',
    reviewsList: [
      { user: 'Neha P.', text: 'Watching the Ganga Aarti in Rishikesh is incredibly peaceful.', rating: 5 }
    ],
    stops: [
      { name: 'Rishikesh', desc: 'The world capital of yoga, located along the shores of the green Ganges.', time: 'Day 1', distance: '0 km', lat: 30.0869, lng: 78.2676, image: '/images/uttarakhand.png' },
      { name: 'Auli Meadows', desc: 'A high-altitude ski resort framing vast views of the Nanda Devi peak.', time: 'Day 2', distance: '240 km', lat: 30.5284, lng: 79.5694, image: '/images/uttarakhand.png' }
    ],
    hiddenGems: [
      { name: 'Valley of Flowers Trail', desc: 'A high alpine valley containing hundreds of varieties of wild flora.', lat: 30.7281, lng: 79.6053, photoScore: 98, crowdLevel: 'Low', bestTime: 'Golden Hour', image: '/images/uttarakhand.png' }
    ],
    spiritualTrails: [
      {
        name: 'Chhota Char Dham Pilgrimage Route',
        desc: 'The holy pilgrimage circuit weaving through high glacier origins, visiting the source shrines of major sacred rivers.',
        stops: [
          { name: 'Yamunotri Temple', desc: 'The sacred birthplace of River Yamuna, surrounded by hot springs and snowy peaks.', time: 'Day 1', distance: '0 km', lat: 31.0142, lng: 78.4497, image: '/images/uttarakhand.png' },
          { name: 'Gangotri Temple', desc: 'The origin shrine of the holy Ganges, situated amidst spectacular granite peaks and deodar forests.', time: 'Day 2', distance: '220 km', lat: 30.9947, lng: 78.9398, image: '/images/uttarakhand.png' },
          { name: 'Kedarnath Temple', desc: 'One of the twelve sacred Shiva Jyotirlingas, standing at 3,584m elevation in a dramatic glacial basin.', time: 'Day 3', distance: '320 km', lat: 30.7352, lng: 79.0669, image: '/images/uttarakhand.png' },
          { name: 'Badrinath Temple', desc: 'The highly revered ancient colorful abode of Lord Vishnu, nestled along the Alaknanda riverbed.', time: 'Day 4', distance: '240 km', lat: 30.7447, lng: 79.4912, image: '/images/uttarakhand.png' }
        ],
        hiddenGems: [
          { name: 'Mana Village Border Post', desc: 'The last Indian village on the Tibet-China border, holding the Vyas Cave where Mahabharata was transcribed.', lat: 30.7681, lng: 79.4953, photoScore: 96, crowdLevel: 'Low', bestTime: 'Midday', image: '/images/uttarakhand.png' }
        ],
        emergencyContacts: {
          hospitalName: 'Joshimath Army Hospital',
          hospitalPhone: '+911389222238',
          hospitalDistance: '3.2 km',
          policeName: 'Joshimath Kotwali',
          policePhone: '+911389222100'
        }
      }
    ],
    emergencyContacts: {
      hospitalName: 'AIIMS Rishikesh',
      hospitalPhone: '+911352462927',
      hospitalDistance: '5.1 km',
      policeName: 'Rishikesh Kotwali Police Station',
      policePhone: '+911352430114'
    }
  },
  {
    id: 'hampi',
    galleryImages: ['https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&q=80'],
    title: 'Hampi',
    country: 'India',
    lat: 15.3350,
    lng: 76.4600,
    image: '/images/hampi.png',
    rating: 4.94,
    reviewsCount: 1820,
    description: 'A grand open-air ruins museum of the 14th-century Vijayanagara Empire. Wander through massive boulder-strewn landscapes, carved stone chariot temples, and tranquil banana plantations along the Tungabhadra River.',
    price: '8500',
    beautyScore: 97,
    photoScore: 98,
    serenityScore: 93,
    crowdLevel: 'Low',
    bestTime: 'October to March',
    tags: ['Culture', 'History', 'Spiritual'],
    localFood: [
      { name: 'South Indian Filter Coffee', desc: 'Strong, frothy chicory-blended coffee poured in brass cups.', cost: '$' },
      { name: 'Traditional Banana Leaf Thali', desc: 'Unlimited rice, sambar, rasam, and local vegetable stir-fries.', cost: '$' }
    ],
    culture: 'Ancient architecture, Virupaksha classical festivals, local Coracle boat rowers, and epic ruins history.',
    weather: 'Hot summers (28°C to 40°C) and pleasant, breezy winters (18°C to 28°C).',
    reviewsList: [
      { user: 'Siddharth M.', text: 'Watching the sunset from Matanga Hill is a spiritual experience. The view of ruins is breathtaking.', rating: 5 }
    ],
    stops: [
      { name: 'Virupaksha Temple', desc: 'Active 7th-century historic stone shrine dedicated to Lord Shiva.', time: 'Day 1', distance: '0 km', lat: 15.3350, lng: 76.4600, image: '/images/hampi.png' },
      { name: 'Stone Chariot Vittala', desc: 'Famous stone chariot structure featuring musical stone pillars.', time: 'Day 2', distance: '3.5 km', lat: 15.3428, lng: 76.4772, image: '/images/hampi.png' },
      { name: 'Hemakuta Hill Sunset', desc: 'A boulder ridge holding monolithic Ganesha carvings and sunset vistas.', time: 'Day 3', distance: '1.2 km', lat: 15.3320, lng: 76.4585, image: '/images/hampi.png' }
    ],
    hiddenGems: [
      { name: 'Anegundi Village Outpost', desc: 'Ancient Kishkindha forest village offering slow coracle river rides and cave viewpoints.', lat: 15.3486, lng: 76.4912, photoScore: 96, crowdLevel: 'Low', bestTime: 'Sunrise', image: '/images/hampi.png' }
    ],
    spiritualTrails: [
      {
        name: 'Vijayanagara Sacred Center Path',
        desc: 'Walk the historic and mythological timeline of Hampi, visiting shrines connected with the epic Ramayana.',
        stops: [
          { name: 'Virupaksha Temple', desc: 'The active 7th-century spiritual heart of Hampi dedicated to Lord Shiva as Virupaksha.', time: 'Day 1', distance: '0 km', lat: 15.3350, lng: 76.4600, image: '/images/hampi.png' },
          { name: 'Kodandarama Temple', desc: 'A sacred riverside temple where Rama crowned Sugriva as king of Kishkindha.', time: 'Day 2', distance: '1.5 km', lat: 15.3384, lng: 76.4658, image: '/images/hampi.png' },
          { name: 'Achyutaraya Temple', desc: 'A grand temple complex lying in a valley between Matanga and Gandhamadana hills, famous for its carved stone pillars.', time: 'Day 3', distance: '1.8 km', lat: 15.3392, lng: 76.4714, image: '/images/hampi.png' },
          { name: 'Hazara Rama Temple', desc: 'The royal family temple carved with highly detailed bas-reliefs illustrating the complete narrative of the Ramayana.', time: 'Day 4', distance: '2.5 km', lat: 15.3328, lng: 76.4632, image: '/images/hampi.png' }
        ],
        hiddenGems: [
          { name: 'Sugriva\'s Cave', desc: 'A natural boulder cleft along the river shore said to be the mythical storage of Sita\'s ornaments.', lat: 15.3390, lng: 76.4670, photoScore: 91, crowdLevel: 'Low', bestTime: 'Early Morning', image: '/images/hampi.png' }
        ],
        emergencyContacts: {
          hospitalName: 'Kamalapura Primary Clinic',
          hospitalPhone: '+918394241333',
          hospitalDistance: '4.2 km',
          policeName: 'Kamalapura Police Station',
          policePhone: '+918394241258'
        }
      }
    ],
    emergencyContacts: {
      hospitalName: 'Hospet Government Hospital',
      hospitalPhone: '+918394220033',
      hospitalDistance: '13 km',
      policeName: 'Hampi Outpost Police Outpost',
      policePhone: '+918394241241'
    }
  },
  {
    id: 'andaman',
    galleryImages: ['https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80'],
    title: 'Andaman Islands',
    country: 'India',
    lat: 11.9761,
    lng: 92.9876,
    image: '/images/andaman.png',
    rating: 4.96,
    reviewsCount: 1120,
    description: 'An emerald archipelago in the Bay of Bengal, famous for Radhanagar Beach (consistently voted Asia\'s best), pristine marine reserves, coral reefs, and tranquil deep-sea diving nodes.',
    price: '32500',
    beautyScore: 99,
    photoScore: 97,
    serenityScore: 98,
    crowdLevel: 'Low',
    bestTime: 'October to May',
    tags: ['Coastal', 'Relaxing', 'Nature'],
    localFood: [
      { name: 'Lobster Thermidor', desc: 'Creamy local catch baked with cheese and island herbs.', cost: '$$$$' },
      { name: 'Coconut Water & Seafood Platters', desc: 'Freshly harvested tender coconuts paired with grilled island fish.', cost: '$$' }
    ],
    culture: 'Island heritage, diving and marine conservation communities, and historic Cellular Jail landmarks.',
    weather: 'Humid, pleasant tropical breeze year-round (22°C to 30°C).',
    reviewsList: [
      { user: 'Maya K.', text: 'Radhanagar Beach literally looks like a painting. Soft white sand and crystal clear waves.', rating: 5 }
    ],
    stops: [
      { name: 'Port Blair Port', desc: 'Capital port city, home to historic landmarks and the airport.', time: 'Day 1', distance: '0 km', lat: 11.6234, lng: 92.7265, image: '/images/andaman.png' },
      { name: 'Radhanagar Beach', desc: 'Asia\'s top beach, featuring clean white sand and tropical forest backdrops.', time: 'Day 2', distance: '45 km (ferry)', lat: 11.9761, lng: 92.9876, image: '/images/andaman.png' },
      { name: 'Neil Island Natural Arch', desc: 'A serene coral island featuring a natural limestone archway.', time: 'Day 3', distance: '18 km', lat: 11.8322, lng: 93.0456, image: '/images/andaman.png' }
    ],
    hiddenGems: [
      { name: 'Lalaji Bay Beach (Long Island)', desc: 'A completely isolated wild cove accessible only by a trek through mangrove creeks.', lat: 12.4418, lng: 92.9242, photoScore: 98, crowdLevel: 'Low', bestTime: 'Sunrise', image: '/images/andaman.png' }
    ],
    spiritualTrails: [
      {
        name: 'Island Freedom & Memorial Trail',
        desc: 'A heritage route tracing the historic colonial penal settlements and Indian independence monuments in Andaman.',
        stops: [
          { name: 'Cellular Jail', desc: 'The historic colonial panopticon prison where prominent Indian freedom fighters were exiled under Kala Pani sentences.', time: 'Day 1', distance: '0 km', lat: 11.6739, lng: 92.7478, image: '/images/andaman.png' },
          { name: 'Netaji Subhash Chandra Bose Island', desc: 'Formally Ross Island, featuring colonial administrative ruins beautifully overgrown by massive banyan roots.', time: 'Day 2', distance: '3 km (ferry)', lat: 11.6708, lng: 92.7681, image: '/images/andaman.png' },
          { name: 'Viper Island Gallows', desc: 'The historical penal island outpost where early independence fighters were executed, hosting brick jailhouse remnants.', time: 'Day 3', distance: '8 km (ferry)', lat: 11.6669, lng: 92.7011, image: '/images/andaman.png' }
        ],
        hiddenGems: [
          { name: 'Ross Island Cemetery Ruins', desc: 'A serene, moss-covered colonial forest graveyard tucked away in Netaji Subhash Chandra Bose Island woodlands.', lat: 11.6705, lng: 92.7685, photoScore: 92, crowdLevel: 'Low', bestTime: 'Afternoon', image: '/images/andaman.png' }
        ],
        emergencyContacts: {
          hospitalName: 'Port Blair Navy Clinic',
          hospitalPhone: '+913192233076',
          hospitalDistance: '3.1 km',
          policeName: 'Aberdeen Police HQ',
          policePhone: '+913192232400'
        }
      }
    ],
    emergencyContacts: {
      hospitalName: 'G.B. Pant Hospital Port Blair',
      hospitalPhone: '+913192232102',
      hospitalDistance: '12.5 km',
      policeName: 'Havelock Police Outpost',
      policePhone: '+913192282405'
    }
  }
];


