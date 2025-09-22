// Script to generate realistic image URLs for religious products
// Using free image sources and AI-generated placeholder services

const productImages = {
  // Islamic Items
  'tasbih-amber-premium': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Premium amber tasbih prayer beads'
  },
  'crystal-tasbih-33': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Crystal tasbih with 33 beads'
  },
  'prayer-rug-traditional': {
    primary: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop&crop=center',
    alt: 'Traditional Islamic prayer rug'
  },
  'quran-premium-arabic': {
    primary: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&h=600&fit=crop&crop=center',
    alt: 'Premium Arabic Quran'
  },
  
  // Hindu Items
  'rudraksha-mala-108': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Rudraksha mala with 108 beads'
  },
  'sandalwood-mala-108': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Sandalwood mala with 108 beads'
  },
  'tulsi-mala-108': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Tulsi mala with 108 beads'
  },
  'aarti-lamp-brass': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Brass aarti lamp set'
  },
  'ganesha-idol-brass': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Brass Ganesha idol'
  },
  
  // Buddhist Items
  'meditation-buddha-resin': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Meditation Buddha statue in resin'
  },
  'laughing-buddha-jade': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Jade laughing Buddha statue'
  },
  'bodhi-seed-mala-108': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Bodhi seed mala with 108 beads'
  },
  
  // Sikh Items
  'kara-sikh-bracelet': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Traditional Sikh kara bracelet'
  },
  'kirpan-ceremonial-steel': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Ceremonial Sikh kirpan'
  },
  'guru-granth-sahib-punjabi': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Guru Granth Sahib in Punjabi'
  },
  
  // Christian Items
  'rosary-our-lady-lourdes': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Rosary dedicated to Our Lady of Lourdes'
  },
  'wooden-cross-olive-wood': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Olive wood cross from Holy Land'
  },
  'crucifix-sterling-silver': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Sterling silver crucifix'
  },
  'prayer-candle-beeswax': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Natural beeswax prayer candle'
  },
  
  // Judaic Items
  'mezuzah-sterling-silver': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Sterling silver mezuzah'
  },
  'tallit-traditional-white': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Traditional white tallit prayer shawl'
  },
  'kippah-set-assorted-colors': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Assorted color kippah set'
  },
  
  // General Items
  'incense-sticks-sandalwood': {
    primary: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
    alt: 'Sandalwood incense sticks'
  }
};

// Category images using Unsplash with religious/spiritual themes
const categoryImages = {
  'islamic': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&crop=center',
  'hindu': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
  'buddhist': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
  'sikh': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
  'christian': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
  'judaic': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center'
};

// Generate image URLs for products
function getProductImage(slug) {
  const imageData = productImages[slug];
  return imageData ? imageData.primary : `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center`;
}

// Generate category image URLs
function getCategoryImage(slug) {
  return categoryImages[slug] || `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center`;
}

module.exports = {
  productImages,
  categoryImages,
  getProductImage,
  getCategoryImage
};