import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { PaginatedResponse, PrismaWhereClause, PrismaOrderByComplex } from "@/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse search query
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category") || ""
    const priceMin = searchParams.get("priceMin") ? parseFloat(searchParams.get("priceMin")!) : undefined
    const priceMax = searchParams.get("priceMax") ? parseFloat(searchParams.get("priceMax")!) : undefined
    const rating = searchParams.get("rating") ? parseInt(searchParams.get("rating")!) : undefined
    const inStock = searchParams.get("inStock") === "true"
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || []
    const sortBy = searchParams.get("sortBy") || "relevance"
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")

    // Build search conditions
    const where: PrismaWhereClause = {
      isActive: true,
    }

    // Text search across multiple fields
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
         { description: { contains: query, mode: "insensitive" } },
        { tags: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]
    }

    // Category filter
    if (category) {
      where.category = {
        slug: category,
      }
    }

    // Price range filter
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {}
      if (priceMin !== undefined) {
        where.price.gte = priceMin
      }
      if (priceMax !== undefined) {
        where.price.lte = priceMax
      }
    }

    // Stock filter
    if (inStock) {
      where.quantity = {
        gt: 0,
      }
    }

    // Tags filter
    if (tags.length > 0) {
      where.tags = {
        contains: tags.join(','),
        mode: 'insensitive'
      }
    }

    // Rating filter (requires aggregation)
    const havingClause: { avgRating?: { gte: number } } = {}
    if (rating !== undefined) {
      havingClause.avgRating = {
        gte: rating,
      }
    }

    // Build order by clause
    let orderBy: PrismaOrderByComplex | Array<PrismaOrderByComplex> = {}
    switch (sortBy) {
      case "price":
        orderBy.price = sortOrder
        break
      case "name":
        orderBy.name = sortOrder
        break
      case "createdAt":
        orderBy.createdAt = sortOrder
        break
      case "popularity":
        orderBy = {
          reviews: {
            _count: sortOrder,
          },
        }
        break
      case "rating":
        orderBy = {
          reviews: {
            rating: "desc",
          },
        }
        break
      default: // relevance
        if (query) {
          // For relevance, we'll use a combination of factors
          orderBy = [
            { isFeatured: "desc" },
            { createdAt: "desc" },
          ]
        } else {
          orderBy = { createdAt: "desc" }
        }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute search with aggregation for ratings
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              orderItems: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Calculate ratings and apply rating filter
    let filteredProducts = products.map((product) => {
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

    // Apply rating filter after calculation
    if (rating !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.averageRating >= rating
      )
    }

    // Get search suggestions and filters
    const [categories, tagsList, priceRange] = await Promise.all([
      prisma.category.findMany({
        where: {
          products: {
            some: {
              isActive: true,
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: {
              products: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.product.findMany({
        where: {
          isActive: true,
        },
        select: {
          tags: true,
        },
      }),
      prisma.product.aggregate({
        where: {
          isActive: true,
        },
        _min: {
          price: true,
        },
        _max: {
          price: true,
        },
      }),
    ])

    // Extract unique tags
    const allTags = Array.from(
      new Set(tagsList.flatMap((product) => product.tags))
    ).sort()

    const response: PaginatedResponse<typeof filteredProducts[0]> & {
      suggestions?: string[]
      filters?: {
        categories: typeof categories
        tags: string[]
        priceRange: {
          min: number
          max: number
        }
      }
    } = {
      success: true,
      data: filteredProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      suggestions: query ? await getSearchSuggestions(query) : undefined,
      filters: {
        categories,
        tags: allTags,
        priceRange: {
           min: Number(priceRange._min.price) || 0,
           max: Number(priceRange._max.price) || 0,
        },
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error performing search:", error)
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    )
  }
}

async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    // Get product names that match the query
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
           { name: { contains: query } },
           { tags: { contains: query } },
        ],
      },
      select: {
        name: true,
        tags: true,
      },
      take: 5,
    })

    const suggestions = new Set<string>()
    
    // Add product names
    products.forEach((product) => {
      suggestions.add(product.name)
    })

    // Add matching tags
    products.forEach((product) => {
      product.tags.split(',').forEach((tag: string) => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tag)
        }
      })
    })

    return Array.from(suggestions).slice(0, 8)
  } catch (error) {
    console.error("Error getting search suggestions:", error)
    return []
  }
}
