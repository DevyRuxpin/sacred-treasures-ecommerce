import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") || "similar"

    let recommendations: Array<{ id: string; name: string; price: number; image?: string }> = []

    switch (type) {
      case "similar":
        recommendations = (await getSimilarProducts(productId)).map(p => ({ id: p.id, name: p.name, price: Number(p.price), image: p.images }))
        break
      case "frequently_bought_together":
        recommendations = (await getFrequentlyBoughtTogether(productId)).map(p => ({ id: p.id, name: p.name, price: Number(p.price), image: p.images }))
        break
      case "trending":
        recommendations = (await getTrendingProducts()).map(p => ({ id: p.id, name: p.name, price: Number(p.price), image: p.images }))
        break
      case "personalized":
        recommendations = (await getPersonalizedRecommendations(userId)).map(p => ({ id: p.id, name: p.name, price: Number(p.price), image: p.images }))
        break
      case "category":
        const categoryId = searchParams.get("categoryId")
        recommendations = (await getCategoryRecommendations(categoryId)).map(p => ({ id: p.id, name: p.name, price: Number(p.price), image: p.images }))
        break
      default:
        recommendations = (await getFeaturedProducts()).map(p => ({ id: p.id, name: p.name, price: Number(p.price), image: p.images }))
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
    })
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get recommendations" },
      { status: 500 }
    )
  }
}

async function getSimilarProducts(productId: string | null) {
  if (!productId) return []

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
    },
  })

  if (!product) return []

  // Find products in the same category with similar tags
  const similarProducts = await prisma.product.findMany({
    where: {
      id: { not: productId },
      isActive: true,
      OR: [
        { categoryId: product.categoryId },
        // For JSON fields, we'll search by category for now
        // Tags matching can be enhanced later with proper JSON operations
      ],
    },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    take: 8,
    orderBy: {
      isFeatured: "desc",
    },
  })

  return similarProducts.map((product) => {
    return {
      ...product,
      averageRating: 0,
      reviewCount: 0,
    }
  })
}

async function getFrequentlyBoughtTogether(productId: string | null) {
  if (!productId) return []

  // Find orders that contain this product
  const ordersWithProduct = await prisma.orderItem.findMany({
    where: {
      productId,
    },
    select: {
      orderId: true,
    },
  })

  const orderIds = ordersWithProduct.map((item) => item.orderId)

  if (orderIds.length === 0) return []

  // Find other products frequently bought with this one
  const frequentlyBought = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      orderId: { in: orderIds },
      productId: { not: productId },
    },
    _count: {
      productId: true,
    },
    orderBy: {
      _count: {
        productId: "desc",
      },
    },
    take: 6,
  })

  const productIds = frequentlyBought.map((item) => item.productId)

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })

  return products.map((product) => {
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    return {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product._count.reviews,
      reviews: undefined,
      _count: undefined,
    }
  })
}

async function getTrendingProducts() {
  // Get products with most orders in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const trendingProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      orderItems: {
        some: {
          order: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
        },
      },
    },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          reviews: true,
          orderItems: {
            where: {
              order: {
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      orderItems: {
        _count: "desc",
      },
    },
    take: 8,
  })

  return trendingProducts.map((product) => {
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    return {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product._count.reviews,
      orderCount: product._count.orderItems,
      reviews: undefined,
      _count: undefined,
    }
  })
}

async function getPersonalizedRecommendations(userId: string | null) {
  if (!userId) return await getFeaturedProducts()

  // Get user's order history
  const userOrders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  })

  if (userOrders.length === 0) return await getFeaturedProducts()

  // Extract categories and tags from user's purchase history
  const userCategories = new Set<string>()
  const userTags = new Set<string>()

  userOrders.forEach((order) => {
    order.items.forEach((item) => {
      userCategories.add(item.product.categoryId)
      item.product.tags.split(',').forEach((tag: string) => userTags.add(tag.trim()))
    })
  })

  // Find products in user's preferred categories and tags
  const personalizedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { categoryId: { in: Array.from(userCategories) } },
        // For JSON fields, we'll search by category for now
        // Tags matching can be enhanced later with proper JSON operations
      ],
    },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    take: 8,
    orderBy: {
      isFeatured: "desc",
    },
  })

  return personalizedProducts.map((product) => {
    return {
      ...product,
      averageRating: 0,
      reviewCount: 0,
    }
  })
}

async function getCategoryRecommendations(categoryId: string | null) {
  if (!categoryId) return await getFeaturedProducts()

  const categoryProducts = await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
    },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    take: 8,
    orderBy: {
      isFeatured: "desc",
    },
  })

  return categoryProducts.map((product) => {
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    return {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product._count.reviews,
      reviews: undefined,
      _count: undefined,
    }
  })
}

async function getFeaturedProducts() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  })

  return featuredProducts.map((product) => {
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    return {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product._count.reviews,
      reviews: undefined,
      _count: undefined,
    }
  })
}
