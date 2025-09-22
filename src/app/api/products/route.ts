import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
// import { withAuth } from "@/lib/middleware"
import { ProductFilters, PaginationParams, PaginatedResponse, PrismaWhereClause, PrismaOrderBy, ProductVariant } from "@/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const filters: ProductFilters = {
      category: searchParams.get("category") || undefined,
      priceMin: searchParams.get("priceMin") ? parseFloat(searchParams.get("priceMin")!) : undefined,
      priceMax: searchParams.get("priceMax") ? parseFloat(searchParams.get("priceMax")!) : undefined,
      rating: searchParams.get("rating") ? parseInt(searchParams.get("rating")!) : undefined,
      inStock: searchParams.get("inStock") === "true" ? true : undefined,
      tags: searchParams.get("tags")?.split(",") || undefined,
      search: searchParams.get("search") || undefined,
    }

    const pagination: PaginationParams = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "12"),
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    }

    // Build where clause
    const where: PrismaWhereClause = {
      isActive: true,
    }

    if (filters.category) {
      where.category = {
        slug: filters.category,
      }
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.price = {}
      if (filters.priceMin !== undefined) {
        where.price.gte = filters.priceMin
      }
      if (filters.priceMax !== undefined) {
        where.price.lte = filters.priceMax
      }
    }

    if (filters.inStock) {
      where.quantity = {
        gt: 0,
      }
    }

    if (filters.tags && filters.tags.length > 0) {
      // For now, skip tags filtering to avoid JSON field issues
      // TODO: Implement proper JSON array filtering for SQLite
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }

    // Calculate pagination
    const skip = (pagination.page - 1) * pagination.limit

    // Build orderBy clause
    const orderBy: PrismaOrderBy = {}
    if (pagination.sortBy && pagination.sortOrder) {
      orderBy[pagination.sortBy] = pagination.sortOrder
    }

    // Execute queries
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
            },
          },
        },
        orderBy,
        skip,
        take: pagination.limit,
      }),
      prisma.product.count({ where }),
    ])

    // Calculate average ratings
    const productsWithRatings = products.map((product) => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

      return {
        ...product,
        images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
        tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
        dimensions: product.dimensions ? (typeof product.dimensions === 'string' ? JSON.parse(product.dimensions) : product.dimensions) : null,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: product._count.reviews,
        reviews: undefined,
        _count: undefined,
      }
    })

    const response: PaginatedResponse<typeof productsWithRatings[0]> = {
      success: true,
      data: productsWithRatings,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNext: pagination.page < Math.ceil(total / pagination.limit),
        hasPrev: pagination.page > 1,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

async function createProduct(req: NextRequest) {
  try {
    const body = await req.json()
    
    const {
      name,
      description,
      shortDescription,
      price,
      comparePrice,
      sku,
      barcode,
      trackQuantity,
      quantity,
      weight,
      dimensions,
      images,
      tags,
      isActive,
      isFeatured,
      isDigital,
      requiresShipping,
      taxCategory,
      seoTitle,
      seoDescription,
      categoryId,
      variants,
    } = body

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price,
        comparePrice,
        sku,
        barcode,
        trackQuantity,
        quantity,
        weight,
        dimensions,
        images,
        tags,
        isActive,
        isFeatured,
        isDigital,
        requiresShipping,
        taxCategory,
        seoTitle,
        seoDescription,
        categoryId,
        variants: variants ? {
          create: variants.map((variant: ProductVariant) => ({
            name: variant.name,
            value: variant.value,
            price: variant.price,
            sku: variant.sku,
            quantity: variant.quantity,
            image: variant.image,
          }))
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product created successfully",
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return createProduct(request)
}