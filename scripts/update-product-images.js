// Script to update all product images in seed.ts with real URLs

const fs = require('fs');
const path = require('path');

const seedFilePath = path.join(__dirname, '../prisma/seed.ts');

// Read the seed file
let seedContent = fs.readFileSync(seedFilePath, 'utf8');

// Product slug to image key mapping
const productImageMapping = {
  'premium-amber-tasbih-99-beads': 'tasbih-amber-premium',
  'crystal-tasbih-33-beads': 'crystal-tasbih-33',
  'traditional-prayer-rug-blue': 'prayer-rug-traditional',
  'premium-quran-arabic': 'quran-premium-arabic',
  'rudraksha-mala-108-beads': 'rudraksha-mala-108',
  'sandalwood-mala-108-beads': 'sandalwood-mala-108',
  'tulsi-mala-108-beads': 'tulsi-mala-108',
  'brass-aarti-lamp-set': 'aarti-lamp-brass',
  'ganesha-idol-brass': 'ganesha-idol-brass',
  'sikh-kirpan-traditional-steel': 'kirpan-ceremonial-steel',
  'sikh-kara-steel-bracelet': 'kara-sikh-bracelet',
  'guru-granth-sahib-punjabi': 'guru-granth-sahib-punjabi',
  'rosary-our-lady-lourdes': 'rosary-our-lady-lourdes',
  'wooden-cross-olive-wood': 'wooden-cross-olive-wood',
  'crucifix-sterling-silver': 'crucifix-sterling-silver',
  'bodhi-seed-mala-108-beads': 'bodhi-seed-mala-108',
  'meditation-buddha-resin': 'meditation-buddha-resin',
  'laughing-buddha-jade': 'laughing-buddha-jade',
  'mezuzah-sterling-silver': 'mezuzah-sterling-silver',
  'tallit-traditional-white': 'tallit-traditional-white',
  'kippah-set-assorted-colors': 'kippah-set-assorted-colors',
  'incense-sticks-sandalwood': 'incense-sticks-sandalwood',
  'prayer-candle-beeswax': 'prayer-candle-beeswax'
};

// Update each product's images
Object.entries(productImageMapping).forEach(([slug, imageKey]) => {
  // Find the product by slug and update its images
  const productRegex = new RegExp(
    `(name: '[^']*',\\s*slug: '${slug}',[\\s\\S]*?images: )'[^']*'`,
    'g'
  );
  
  seedContent = seedContent.replace(productRegex, `$1getProductImage('${imageKey}')`);
});

// Write the updated content back to the file
fs.writeFileSync(seedFilePath, seedContent);

console.log('✅ Updated all product images in seed.ts');
console.log('📝 Updated products:');
Object.keys(productImageMapping).forEach(slug => {
  console.log(`   - ${slug}`);
});
