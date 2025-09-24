import { unstable_cache } from "next/cache"

// Cache configuration
const CACHE_TAGS = {
  PRODUCTS: "products",
  CATEGORIES: "categories", 
  REVIEWS: "reviews",
  RECOMMENDATIONS: "recommendations"
} as const

// Cache durations (in seconds)
const CACHE_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 1800, // 30 minutes
  VERY_LONG: 3600, // 1 hour
  STATIC: 86400 // 24 hours
} as const

// Cached product queries
export const getCachedProducts = unstable_cache(
  async (filters: Record<string, unknown>) => {
    const { prisma } = await import("./prisma")
    
    const products = await prisma.product.findMany({
      where: filters,
      include: {
        category: true,
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return products
  },
  ["products"],
  {
    tags: [CACHE_TAGS.PRODUCTS],
    revalidate: CACHE_DURATIONS.MEDIUM
  }
)

// Cached categories
export const getCachedCategories = unstable_cache(
  async () => {
    const { prisma } = await import("./prisma")
    
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true
          },
          take: 4
        },
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    return categories
  },
  ["categories"],
  {
    tags: [CACHE_TAGS.CATEGORIES],
    revalidate: CACHE_DURATIONS.LONG
  }
)

// Cached recommendations
export const getCachedRecommendations = unstable_cache(
  async (type: string, productId?: string) => {
    const { prisma } = await import("./prisma")
    
    let recommendations: Record<string, unknown>[] = []
    
    switch (type) {
      case "trending":
        recommendations = await prisma.product.findMany({
          where: {
            isActive: true,
            isFeatured: true
          },
          include: {
            category: true,
            reviews: {
              select: {
                rating: true
              }
            },
            _count: {
              select: {
                reviews: true
              }
            }
          },
          take: 8,
          orderBy: {
            createdAt: "desc"
          }
        })
        break
        
      case "featured":
        recommendations = await prisma.product.findMany({
          where: {
            isActive: true,
            isFeatured: true
          },
          include: {
            category: true,
            reviews: {
              select: {
                rating: true
              }
            },
            _count: {
              select: {
                reviews: true
              }
            }
          },
          take: 8,
          orderBy: {
            createdAt: "desc"
          }
        })
        break
    }
    
    return recommendations
  },
  ["recommendations"],
  {
    tags: [CACHE_TAGS.RECOMMENDATIONS],
    revalidate: CACHE_DURATIONS.MEDIUM
  }
)

// Cache invalidation helpers
export async function invalidateProductCache() {
  const { revalidateTag } = await import("next/cache")
  revalidateTag(CACHE_TAGS.PRODUCTS)
}

export async function invalidateCategoryCache() {
  const { revalidateTag } = await import("next/cache")
  revalidateTag(CACHE_TAGS.CATEGORIES)
}

export async function invalidateRecommendationCache() {
  const { revalidateTag } = await import("next/cache")
  revalidateTag(CACHE_TAGS.RECOMMENDATIONS)
}

export async function invalidateReviewCache() {
  const { revalidateTag } = await import("next/cache")
  revalidateTag(CACHE_TAGS.REVIEWS)
}

// Client-side cache utilities
export class ClientCache {
  private static cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>()

  static set(key: string, data: unknown, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  static get(key: string): unknown | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  static delete(key: string): boolean {
    return this.cache.delete(key)
  }

  static clear(): void {
    this.cache.clear()
  }

  static has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  static measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    return fn().finally(() => {
      const end = performance.now()
      console.log(`[Performance] ${name}: ${end - start}ms`)
    })
  }

  static measureSync<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    console.log(`[Performance] ${name}: ${end - start}ms`)
    return result
  }
}
