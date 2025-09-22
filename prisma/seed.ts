import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Image URL generators
function getProductImage(slug: string): string {
  const imageMap: Record<string, string> = {
    'tasbih-amber-premium': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'crystal-tasbih-33': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'prayer-rug-traditional': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop&crop=center',
    'quran-premium-arabic': 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&h=600&fit=crop&crop=center',
    'rudraksha-mala-108': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'sandalwood-mala-108': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'tulsi-mala-108': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'aarti-lamp-brass': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'ganesha-idol-brass': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'kirpan-ceremonial-steel': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'kara-sikh-bracelet': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'guru-granth-sahib-punjabi': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'rosary-our-lady-lourdes': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'wooden-cross-olive-wood': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'crucifix-sterling-silver': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'bodhi-seed-mala-108': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'meditation-buddha-resin': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'laughing-buddha-jade': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'mezuzah-sterling-silver': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'tallit-traditional-white': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'kippah-set-assorted-colors': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'incense-sticks-sandalwood': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    'prayer-candle-beeswax': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center'
  };
  return imageMap[slug] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center';
}

function getCategoryImage(slug: string): string {
  const categoryImageMap: Record<string, string> = {
    'islamic': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&crop=center',
    'hindu': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    'buddhist': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    'sikh': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    'christian': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    'judaic': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center'
  };
  return categoryImageMap[slug] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center';
}

async function main() {
  console.log('🌱 Starting comprehensive database seed...')

  // Create main categories
  const categories = [
    {
      name: 'Islamic Items',
      slug: 'islamic',
      description: 'Authentic Islamic religious items, prayer accessories, and artifacts',
      image: getCategoryImage('islamic'),
    },
    {
      name: 'Hindu Items',
      slug: 'hindu',
      description: 'Traditional Hindu religious items, puja accessories, and artifacts',
      image: getCategoryImage('hindu'),
    },
    {
      name: 'Sikh Items',
      slug: 'sikh',
      description: 'Authentic Sikh religious items and ceremonial accessories',
      image: getCategoryImage('sikh'),
    },
    {
      name: 'Christian Items',
      slug: 'christian',
      description: 'Christian religious items, crosses, rosaries, and devotional accessories',
      image: getCategoryImage('christian'),
    },
    {
      name: 'Buddhist Items',
      slug: 'buddhist',
      description: 'Buddhist meditation items, malas, and spiritual accessories',
      image: getCategoryImage('buddhist'),
    },
    {
      name: 'Judaic Items',
      slug: 'judaic',
      description: 'Jewish religious items, mezuzahs, and ceremonial accessories',
      image: getCategoryImage('judaic'),
    },
  ]

  const createdCategories = []
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    })
    createdCategories.push(category)
  }

  const islamicCategory = createdCategories.find(c => c.slug === 'islamic')
  const hinduCategory = createdCategories.find(c => c.slug === 'hindu')
  const sikhCategory = createdCategories.find(c => c.slug === 'sikh')
  const christianCategory = createdCategories.find(c => c.slug === 'christian')
  const buddhistCategory = createdCategories.find(c => c.slug === 'buddhist')
  const judaicCategory = createdCategories.find(c => c.slug === 'judaic')

  // Create subcategories
  const subcategories = [
    {
      name: 'Tasbih & Prayer Beads',
      slug: 'tasbih-prayer-beads',
      description: 'Islamic prayer beads and tasbih sets',
      parentId: islamicCategory?.id,
    },
    {
      name: 'Prayer Rugs',
      slug: 'prayer-rugs',
      description: 'Traditional Islamic prayer rugs and mats',
      parentId: islamicCategory?.id,
    },
    {
      name: 'Quran & Books',
      slug: 'quran-books',
      description: 'Quran copies and Islamic literature',
      parentId: islamicCategory?.id,
    },
    {
      name: 'Mala Beads',
      slug: 'mala-beads',
      description: 'Hindu prayer beads and malas',
      parentId: hinduCategory?.id,
    },
    {
      name: 'Puja Items',
      slug: 'puja-items',
      description: 'Hindu puja accessories and items',
      parentId: hinduCategory?.id,
    },
    {
      name: 'Idols & Statues',
      slug: 'idols-statues',
      description: 'Religious idols and deity statues',
      parentId: hinduCategory?.id,
    },
    {
      name: 'Five Ks',
      slug: 'five-ks',
      description: 'Traditional Sikh Five Ks articles',
      parentId: sikhCategory?.id,
    },
    {
      name: 'Sikh Literature',
      slug: 'sikh-literature',
      description: 'Guru Granth Sahib and Sikh texts',
      parentId: sikhCategory?.id,
    },
    {
      name: 'Rosaries',
      slug: 'rosaries',
      description: 'Christian rosary beads and prayer chains',
      parentId: christianCategory?.id,
    },
    {
      name: 'Crosses & Crucifixes',
      slug: 'crosses-crucifixes',
      description: 'Christian crosses and crucifixes',
      parentId: christianCategory?.id,
    },
    {
      name: 'Meditation Malas',
      slug: 'meditation-malas',
      description: 'Buddhist meditation malas and beads',
      parentId: buddhistCategory?.id,
    },
    {
      name: 'Buddha Statues',
      slug: 'buddha-statues',
      description: 'Buddha statues and meditation figures',
      parentId: buddhistCategory?.id,
    },
    {
      name: 'Mezuzahs',
      slug: 'mezuzahs',
      description: 'Jewish mezuzahs and doorposts',
      parentId: judaicCategory?.id,
    },
    {
      name: 'Tallit & Kippahs',
      slug: 'tallit-kippahs',
      description: 'Jewish prayer shawls and head coverings',
      parentId: judaicCategory?.id,
    },
  ]

  const createdSubcategories = []
  for (const subcategoryData of subcategories) {
    if (subcategoryData.parentId) {
      const subcategory = await prisma.category.upsert({
        where: { slug: subcategoryData.slug },
        update: {},
        create: subcategoryData,
      })
      createdSubcategories.push(subcategory)
    }
  }

  const tasbihCategory = createdSubcategories.find(c => c.slug === 'tasbih-prayer-beads')
  const prayerRugsCategory = createdSubcategories.find(c => c.slug === 'prayer-rugs')
  const quranCategory = createdSubcategories.find(c => c.slug === 'quran-books')
  const malaCategory = createdSubcategories.find(c => c.slug === 'mala-beads')
  const pujaCategory = createdSubcategories.find(c => c.slug === 'puja-items')
  const idolsCategory = createdSubcategories.find(c => c.slug === 'idols-statues')
  const fiveKsCategory = createdSubcategories.find(c => c.slug === 'five-ks')
  const sikhLitCategory = createdSubcategories.find(c => c.slug === 'sikh-literature')
  const rosariesCategory = createdSubcategories.find(c => c.slug === 'rosaries')
  const crossesCategory = createdSubcategories.find(c => c.slug === 'crosses-crucifixes')
  const medMalaCategory = createdSubcategories.find(c => c.slug === 'meditation-malas')
  const buddhaCategory = createdSubcategories.find(c => c.slug === 'buddha-statues')
  const mezuzahsCategory = createdSubcategories.find(c => c.slug === 'mezuzahs')
  const tallitCategory = createdSubcategories.find(c => c.slug === 'tallit-kippahs')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sacredtreasures.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@sacredtreasures.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 12)
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      name: 'Test Customer',
      email: 'customer@test.com',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  })

  // Comprehensive product catalog
  const products = [
    // Islamic Items
    {
      name: 'Premium Amber Tasbih - 99 Beads',
      slug: 'premium-amber-tasbih-99-beads',
      description: 'Exquisite handcrafted amber tasbih with 99 beads. Made from authentic Baltic amber with traditional Islamic craftsmanship. Perfect for daily prayers and dhikr.',
      shortDescription: 'Handcrafted amber tasbih with 99 premium beads',
      price: 89.99,
      comparePrice: 119.99,
      sku: 'TASB-AMBER-99',
      quantity: 25,
      images: getProductImage('tasbih-amber-premium'),
      tags: 'amber,tasbih,islamic,premium,handcrafted',
      isActive: true,
      isFeatured: true,
      categoryId: tasbihCategory?.id,
    },
    {
      name: 'Crystal Tasbih - 33 Beads',
      slug: 'crystal-tasbih-33-beads',
      description: 'Beautiful crystal tasbih with 33 beads. Features high-quality crystal beads with elegant design and comfortable grip.',
      shortDescription: 'Elegant crystal tasbih with 33 beads',
      price: 24.99,
      comparePrice: 34.99,
      sku: 'TASB-CRYSTAL-33',
      quantity: 50,
      images: getProductImage('crystal-tasbih-33'),
      tags: 'crystal,tasbih,islamic,elegant',
      isActive: true,
      isFeatured: true,
      categoryId: tasbihCategory?.id,
    },
    {
      name: 'Traditional Prayer Rug - Blue Pattern',
      slug: 'traditional-prayer-rug-blue',
      description: 'Authentic prayer rug with traditional blue geometric patterns. Made from high-quality wool with comfortable padding.',
      shortDescription: 'Traditional blue prayer rug',
      price: 45.99,
      comparePrice: 59.99,
      sku: 'RUG-BLUE-TRAD',
      quantity: 30,
      images: getProductImage('prayer-rug-traditional'),
      tags: 'prayer rug,islamic,traditional,blue,wool',
      isActive: true,
      isFeatured: true,
      categoryId: prayerRugsCategory?.id,
    },
    {
      name: 'Premium Quran - Arabic Text',
      slug: 'premium-quran-arabic',
      description: 'High-quality Quran with clear Arabic text and beautiful binding. Includes translation notes and commentary.',
      shortDescription: 'Premium Quran with Arabic text',
      price: 39.99,
      comparePrice: 49.99,
      sku: 'QURAN-ARABIC-PREM',
      quantity: 40,
      images: getProductImage('tasbih-amber-premium'),
      tags: 'quran,arabic,islamic,premium',
      isActive: true,
      isFeatured: false,
      categoryId: quranCategory?.id,
    },

    // Hindu Items
    {
      name: 'Rudraksha Mala - 108 Beads',
      slug: 'rudraksha-mala-108-beads',
      description: 'Authentic Rudraksha mala with 108 beads. Known for its spiritual properties and traditional significance in Hindu practices.',
      shortDescription: 'Authentic Rudraksha mala with 108 beads',
      price: 69.99,
      comparePrice: 89.99,
      sku: 'MALA-RUDRA-108',
      quantity: 20,
      images: getProductImage('rudraksha-mala-108'),
      tags: 'rudraksha,mala,hindu,meditation,authentic',
      isActive: true,
      isFeatured: true,
      categoryId: malaCategory?.id,
    },
    {
      name: 'Sandalwood Mala - 108 Beads',
      slug: 'sandalwood-mala-108-beads',
      description: 'Fragrant sandalwood mala with 108 beads. Known for its calming aroma and spiritual significance in Hindu traditions.',
      shortDescription: 'Fragrant sandalwood mala with 108 beads',
      price: 49.99,
      comparePrice: 64.99,
      sku: 'MALA-SANDAL-108',
      quantity: 35,
      images: getProductImage('crystal-tasbih-33'),
      tags: 'sandalwood,mala,hindu,fragrant,meditation',
      isActive: true,
      isFeatured: true,
      categoryId: malaCategory?.id,
    },
    {
      name: 'Tulsi Mala - 108 Beads',
      slug: 'tulsi-mala-108-beads',
      description: 'Sacred Tulsi mala with 108 beads. Made from holy basil wood, highly revered in Hindu culture for its spiritual properties.',
      shortDescription: 'Sacred Tulsi mala with 108 beads',
      price: 34.99,
      comparePrice: 44.99,
      sku: 'MALA-TULSI-108',
      quantity: 40,
      images: getProductImage('prayer-rug-traditional'),
      tags: 'tulsi,mala,hindu,sacred,basil',
      isActive: true,
      isFeatured: false,
      categoryId: malaCategory?.id,
    },
    {
      name: 'Brass Aarti Lamp Set',
      slug: 'brass-aarti-lamp-set',
      description: 'Traditional brass aarti lamp set with multiple wicks. Perfect for Hindu puja ceremonies and daily prayers.',
      shortDescription: 'Traditional brass aarti lamp set',
      price: 29.99,
      comparePrice: 39.99,
      sku: 'AARTI-BRASS-SET',
      quantity: 25,
      images: getProductImage('quran-premium-arabic'),
      tags: 'aarti,lamp,brass,puja,hindu',
      isActive: true,
      isFeatured: true,
      categoryId: pujaCategory?.id,
    },
    {
      name: 'Ganesha Idol - Brass',
      slug: 'ganesha-idol-brass',
      description: 'Beautiful brass Ganesha idol with intricate details. Perfect for home altar and puja ceremonies.',
      shortDescription: 'Beautiful brass Ganesha idol',
      price: 79.99,
      comparePrice: 99.99,
      sku: 'GANESHA-BRASS-01',
      quantity: 15,
      images: getProductImage('rudraksha-mala-108'),
      tags: 'ganesha,idol,brass,hindu,altar',
      isActive: true,
      isFeatured: true,
      categoryId: idolsCategory?.id,
    },

    // Sikh Items
    {
      name: 'Sikh Kirpan - Traditional Steel',
      slug: 'sikh-kirpan-traditional-steel',
      description: 'Traditional Sikh kirpan made from high-quality steel. Crafted with respect for Sikh traditions and religious significance.',
      shortDescription: 'Traditional Sikh kirpan in steel',
      price: 129.99,
      comparePrice: 159.99,
      sku: 'KIRPAN-STEEL-TRAD',
      quantity: 10,
      images: getProductImage('sandalwood-mala-108'),
      tags: 'kirpan,sikh,traditional,steel,ceremonial',
      isActive: true,
      isFeatured: true,
      categoryId: fiveKsCategory?.id,
    },
    {
      name: 'Sikh Kara - Steel Bracelet',
      slug: 'sikh-kara-steel-bracelet',
      description: 'Traditional Sikh kara bracelet made from stainless steel. One of the Five Ks of Sikhism.',
      shortDescription: 'Traditional Sikh kara bracelet',
      price: 19.99,
      comparePrice: 24.99,
      sku: 'KARA-STEEL-TRAD',
      quantity: 50,
      images: getProductImage('tulsi-mala-108'),
      tags: 'kara,sikh,bracelet,steel,five ks',
      isActive: true,
      isFeatured: false,
      categoryId: fiveKsCategory?.id,
    },
    {
      name: 'Guru Granth Sahib - Punjabi',
      slug: 'guru-granth-sahib-punjabi',
      description: 'Sacred Guru Granth Sahib in Punjabi script. The holy scripture of Sikhism with beautiful binding.',
      shortDescription: 'Sacred Guru Granth Sahib in Punjabi',
      price: 89.99,
      comparePrice: 109.99,
      sku: 'GGS-PUNJABI-PREM',
      quantity: 20,
      images: getProductImage('aarti-lamp-brass'),
      tags: 'guru granth sahib,sikh,scripture,punjabi,sacred',
      isActive: true,
      isFeatured: true,
      categoryId: sikhLitCategory?.id,
    },

    // Christian Items
    {
      name: 'Rosary - Our Lady of Lourdes',
      slug: 'rosary-our-lady-lourdes',
      description: 'Beautiful rosary dedicated to Our Lady of Lourdes. Made with high-quality beads and traditional design.',
      shortDescription: 'Rosary dedicated to Our Lady of Lourdes',
      price: 34.99,
      comparePrice: 44.99,
      sku: 'ROSARY-LOURDES-01',
      quantity: 30,
      images: getProductImage('ganesha-idol-brass'),
      tags: 'rosary,christian,our lady,lourdes,prayer',
      isActive: true,
      isFeatured: true,
      categoryId: rosariesCategory?.id,
    },
    {
      name: 'Wooden Cross - Olive Wood',
      slug: 'wooden-cross-olive-wood',
      description: 'Handcrafted cross made from authentic olive wood from the Holy Land. Beautiful natural grain and finish.',
      shortDescription: 'Handcrafted olive wood cross',
      price: 49.99,
      comparePrice: 64.99,
      sku: 'CROSS-OLIVE-WOOD',
      quantity: 25,
      images: getProductImage('kirpan-ceremonial-steel'),
      tags: 'cross,christian,olive wood,holy land,handcrafted',
      isActive: true,
      isFeatured: true,
      categoryId: crossesCategory?.id,
    },
    {
      name: 'Crucifix - Sterling Silver',
      slug: 'crucifix-sterling-silver',
      description: 'Elegant sterling silver crucifix with detailed craftsmanship. Perfect for personal devotion and gifting.',
      shortDescription: 'Elegant sterling silver crucifix',
      price: 89.99,
      comparePrice: 119.99,
      sku: 'CRUCIFIX-SILVER-01',
      quantity: 20,
      images: getProductImage('kara-sikh-bracelet'),
      tags: 'crucifix,christian,sterling silver,elegant',
      isActive: true,
      isFeatured: true,
      categoryId: crossesCategory?.id,
    },

    // Buddhist Items
    {
      name: 'Bodhi Seed Mala - 108 Beads',
      slug: 'bodhi-seed-mala-108-beads',
      description: 'Traditional Bodhi seed mala with 108 beads. Made from seeds of the sacred Bodhi tree where Buddha attained enlightenment.',
      shortDescription: 'Traditional Bodhi seed mala with 108 beads',
      price: 59.99,
      comparePrice: 74.99,
      sku: 'MALA-BODHI-108',
      quantity: 25,
      images: getProductImage('guru-granth-sahib-punjabi'),
      tags: 'bodhi,mala,buddhist,meditation,sacred',
      isActive: true,
      isFeatured: true,
      categoryId: medMalaCategory?.id,
    },
    {
      name: 'Meditation Buddha - Resin',
      slug: 'meditation-buddha-resin',
      description: 'Beautiful meditation Buddha statue made from high-quality resin. Perfect for meditation spaces and altars.',
      shortDescription: 'Beautiful meditation Buddha statue',
      price: 69.99,
      comparePrice: 89.99,
      sku: 'BUDDHA-MEDITATION-01',
      quantity: 20,
      images: getProductImage('rosary-our-lady-lourdes'),
      tags: 'buddha,meditation,statue,resin,altar',
      isActive: true,
      isFeatured: true,
      categoryId: buddhaCategory?.id,
    },
    {
      name: 'Laughing Buddha - Jade',
      slug: 'laughing-buddha-jade',
      description: 'Charming laughing Buddha statue carved from natural jade. Brings joy and prosperity to your space.',
      shortDescription: 'Charming jade laughing Buddha statue',
      price: 99.99,
      comparePrice: 129.99,
      sku: 'BUDDHA-JADE-LAUGH',
      quantity: 15,
      images: getProductImage('wooden-cross-olive-wood'),
      tags: 'buddha,laughing,jade,prosperity,joy',
      isActive: true,
      isFeatured: true,
      categoryId: buddhaCategory?.id,
    },

    // Judaic Items
    {
      name: 'Mezuzah - Sterling Silver',
      slug: 'mezuzah-sterling-silver',
      description: 'Elegant sterling silver mezuzah case with traditional Hebrew scroll. Perfect for doorpost installation.',
      shortDescription: 'Elegant sterling silver mezuzah',
      price: 79.99,
      comparePrice: 99.99,
      sku: 'MEZUZAH-SILVER-01',
      quantity: 20,
      images: getProductImage('crucifix-sterling-silver'),
      tags: 'mezuzah,jewish,sterling silver,doorpost',
      isActive: true,
      isFeatured: true,
      categoryId: mezuzahsCategory?.id,
    },
    {
      name: 'Tallit - Traditional White',
      slug: 'tallit-traditional-white',
      description: 'Traditional white tallit prayer shawl with blue stripes. Made from high-quality wool blend.',
      shortDescription: 'Traditional white tallit prayer shawl',
      price: 89.99,
      comparePrice: 119.99,
      sku: 'TALLIT-WHITE-TRAD',
      quantity: 15,
      images: getProductImage('bodhi-seed-mala-108'),
      tags: 'tallit,jewish,prayer shawl,traditional,wool',
      isActive: true,
      isFeatured: true,
      categoryId: tallitCategory?.id,
    },
    {
      name: 'Kippah Set - Assorted Colors',
      slug: 'kippah-set-assorted-colors',
      description: 'Set of 5 traditional kippahs in assorted colors. Made from high-quality satin material.',
      shortDescription: 'Set of 5 assorted color kippahs',
      price: 24.99,
      comparePrice: 34.99,
      sku: 'KIPPAH-SET-COLORS',
      quantity: 30,
      images: getProductImage('meditation-buddha-resin'),
      tags: 'kippah,jewish,yarmulke,assorted,satin',
      isActive: true,
      isFeatured: false,
      categoryId: tallitCategory?.id,
    },

    // Additional popular items
    {
      name: 'Incense Sticks - Sandalwood',
      slug: 'incense-sticks-sandalwood',
      description: 'Premium sandalwood incense sticks. Perfect for meditation, prayer, and creating a peaceful atmosphere.',
      shortDescription: 'Premium sandalwood incense sticks',
      price: 12.99,
      comparePrice: 16.99,
      sku: 'INCENSE-SANDAL-01',
      quantity: 100,
      images: getProductImage('laughing-buddha-jade'),
      tags: 'incense,sandalwood,meditation,aroma',
      isActive: true,
      isFeatured: false,
      categoryId: pujaCategory?.id,
    },
    {
      name: 'Prayer Candle - Beeswax',
      slug: 'prayer-candle-beeswax',
      description: 'Natural beeswax prayer candle. Hand-poured with pure beeswax for clean burning and spiritual ambiance.',
      shortDescription: 'Natural beeswax prayer candle',
      price: 8.99,
      comparePrice: 12.99,
      sku: 'CANDLE-BEESWAX-01',
      quantity: 75,
      images: getProductImage('mezuzah-sterling-silver'),
      tags: 'candle,beeswax,prayer,natural',
      isActive: true,
      isFeatured: false,
      categoryId: christianCategory?.id,
    },
  ]

  console.log('📦 Creating products...')
  const createdProducts = []
  for (const productData of products) {
    if (productData.categoryId) {
      console.log(`Creating product: ${productData.name} with image: ${productData.images}`)
      const product = await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: {
          ...productData,
          categoryId: productData.categoryId,
        },
      })
      createdProducts.push(product)
    }
  }

  // Create suppliers
  const suppliers = [
    {
      name: 'Sacred Artifacts Co.',
      email: 'orders@sacredartifacts.com',
      phone: '+1-555-0123',
      website: 'https://sacredartifacts.com',
      address: {
        street: '123 Religious Way',
        city: 'Spiritual City',
        state: 'CA',
        zip: '90210',
        country: 'USA',
      },
      contactPerson: 'John Smith',
      notes: 'Reliable supplier for religious items',
      isActive: true,
    },
    {
      name: 'Eastern Spiritual Supplies',
      email: 'info@easternspiritual.com',
      phone: '+1-555-0456',
      website: 'https://easternspiritual.com',
      address: {
        street: '456 Dharma Street',
        city: 'Enlightenment City',
        state: 'NY',
        zip: '10001',
        country: 'USA',
      },
      contactPerson: 'Priya Patel',
      notes: 'Specialist in Hindu and Buddhist items',
      isActive: true,
    },
    {
      name: 'Western Religious Goods',
      email: 'sales@westernreligious.com',
      phone: '+1-555-0789',
      website: 'https://westernreligious.com',
      address: {
        street: '789 Faith Avenue',
        city: 'Divine City',
        state: 'TX',
        zip: '75001',
        country: 'USA',
      },
      contactPerson: 'Maria Rodriguez',
      notes: 'Christian and Judaic religious supplies',
      isActive: true,
    },
  ]

  console.log('🏢 Creating suppliers...')
  const createdSuppliers = []
  for (const supplierData of suppliers) {
    const supplier = await prisma.supplier.create({
      data: supplierData,
    })
    createdSuppliers.push(supplier)
  }

  // Create supplier-product relationships
  console.log('🔗 Linking products to suppliers...')
  for (let i = 0; i < createdProducts.length; i++) {
    const product = createdProducts[i]
    const supplier = createdSuppliers[i % createdSuppliers.length]
    
    await prisma.supplierProduct.upsert({
      where: {
        supplierId_productId: {
          supplierId: supplier.id,
          productId: product.id,
        },
      },
      update: {},
      create: {
        supplierId: supplier.id,
        productId: product.id,
        supplierSku: `SUP-${product.sku}`,
        supplierPrice: Number(product.price) * 0.7, // 30% markup
        isActive: true,
      },
    })
  }

  // Create some sample reviews
  console.log('⭐ Creating sample reviews...')
  const reviewProducts = createdProducts.slice(0, 5) // First 5 products
  for (const product of reviewProducts) {
    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: customerUser.id,
          productId: product.id,
        },
      },
      update: {},
      create: {
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        title: `Great ${product.name}`,
        comment: `I love this product! The quality is excellent and it arrived quickly. Highly recommended for anyone looking for authentic religious items.`,
        isVerified: true,
        userId: customerUser.id,
        productId: product.id,
      },
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${categories.length} main categories`)
  console.log(`   - ${subcategories.length} subcategories`)
  console.log(`   - 1 admin user (admin@sacredtreasures.com / admin123)`)
  console.log(`   - 1 test customer (customer@test.com / customer123)`)
  console.log(`   - ${createdProducts.length} products`)
  console.log(`   - ${createdSuppliers.length} suppliers`)
  console.log(`   - ${reviewProducts.length} sample reviews`)
  console.log('')
  console.log('🔑 Admin Login:')
  console.log('   Email: admin@sacredtreasures.com')
  console.log('   Password: admin123')
  console.log('')
  console.log('🛒 Test Customer Login:')
  console.log('   Email: customer@test.com')
  console.log('   Password: customer123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })