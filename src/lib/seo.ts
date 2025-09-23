import { Metadata } from "next"

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article" | "product"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  siteName?: string
  locale?: string
  noindex?: boolean
  nofollow?: boolean
}

export const defaultSEO = {
  title: "Sacred Treasures - Religious Items Store",
  description: "Discover authentic religious items for Muslim, Hindu, Sikh, Christian, Buddhist, and Judaic communities. Quality products with fast shipping and excellent customer service.",
  keywords: [
    "religious items",
    "muslim",
    "hindu", 
    "sikh",
    "christian",
    "buddhist",
    "judaic",
    "prayer beads",
    "tasbih",
    "rosary",
    "religious artifacts",
    "spiritual items",
    "religious gifts"
  ],
  image: "/images/og-image.jpg",
  url: "https://sacredtreasures.com",
  siteName: "Sacred Treasures",
  locale: "en_US",
  type: "website" as const,
}

export function generateMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
  nofollow = false,
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.title
  const fullDescription = description || defaultSEO.description
  const fullKeywords = keywords ? [...defaultSEO.keywords, ...keywords] : defaultSEO.keywords
  const fullImage = image || defaultSEO.image
  const fullUrl = url || defaultSEO.url

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    authors: author ? [{ name: author }] : undefined,
    creator: author,
    publisher: defaultSEO.siteName,
    
    // Open Graph
    openGraph: {
      type,
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: defaultSEO.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: defaultSEO.locale,
      publishedTime,
      modifiedTime,
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: "@sacredtreasures",
    },

    // Robots
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Additional
    alternates: {
      canonical: fullUrl,
    },

    // Verification
    verification: {
      google: process.env.GOOGLE_VERIFICATION_ID,
      yandex: process.env.YANDEX_VERIFICATION_ID,
      yahoo: process.env.YAHOO_VERIFICATION_ID,
    },
  }

  return metadata
}

// Product-specific SEO
export function generateProductMetadata(product: {
  name: string
  description: string
  price: number
  images: string[]
  category: { name: string }
  slug: string
}): Metadata {
  const title = `${product.name} - ${product.category.name}`
  const description = `${product.description.slice(0, 155)}...`
  const image = product.images[0] || defaultSEO.image
  const url = `${defaultSEO.url}/products/${product.slug}`

  return generateMetadata({
    title,
    description,
    keywords: [
      product.name,
      product.category.name,
      "religious items",
      "spiritual products"
    ],
    image,
    url,
    type: "product",
  })
}

// Category-specific SEO
export function generateCategoryMetadata(category: {
  name: string
  description?: string
  slug: string
}): Metadata {
  const title = `${category.name} - Religious Items`
  const description = category.description || `Discover authentic ${category.name.toLowerCase()} religious items and spiritual products.`
  const url = `${defaultSEO.url}/categories/${category.slug}`

  return generateMetadata({
    title,
    description,
    keywords: [
      category.name,
      "religious items",
      "spiritual products"
    ],
    url,
  })
}

// JSON-LD structured data generators
export function generateProductStructuredData(product: {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: { name: string }
  slug: string
  averageRating?: number
  reviewCount?: number
  availability?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${defaultSEO.url}/products/${product.slug}`,
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category.name,
    brand: {
      "@type": "Brand",
      name: "Sacred Treasures"
    },
    offers: {
      "@type": "Offer",
      url: `${defaultSEO.url}/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability: product.availability || "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Sacred Treasures"
      }
    },
    aggregateRating: product.averageRating && product.reviewCount ? {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1
    } : undefined
  }
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${defaultSEO.url}#organization`,
    name: "Sacred Treasures",
    url: defaultSEO.url,
    logo: `${defaultSEO.url}/images/logo.png`,
    description: "Authentic religious items and spiritual products for all faiths",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@sacredtreasures.com"
    },
    sameAs: [
      "https://facebook.com/sacredtreasures",
      "https://twitter.com/sacredtreasures",
      "https://instagram.com/sacredtreasures"
    ]
  }
}

export function generateBreadcrumbStructuredData(items: Array<{
  name: string
  url: string
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${defaultSEO.url}#website`,
    url: defaultSEO.url,
    name: "Sacred Treasures",
    description: defaultSEO.description,
    publisher: {
      "@id": `${defaultSEO.url}#organization`
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${defaultSEO.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }
}
