import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(1000),
  name: z.string().min(2).max(50),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = reviewSchema.parse(body)
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      select: { id: true, name: true }
    })
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }
    
    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: validatedData.productId,
        user: {
          email: validatedData.email
        }
      }
    })
    
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: "You have already reviewed this product" },
        { status: 400 }
      )
    }
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
        }
      })
    }
    
    // Create review
    const review = await prisma.review.create({
      data: {
        rating: validatedData.rating,
        title: validatedData.title,
        comment: validatedData.comment,
        productId: validatedData.productId,
        userId: user.id,
        isVerified: false, // Could be set to true if user has purchased the product
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: review,
      message: "Review submitted successfully"
    })
    
  } catch (error) {
    console.error("Error creating review:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sortBy") || "newest"
    const rating = searchParams.get("rating")
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      )
    }
    
    // Build where clause
    const where: any = { productId }
    if (rating && rating !== "all") {
      where.rating = parseInt(rating)
    }
    
    // Build order by clause
    let orderBy: any = { createdAt: "desc" }
    switch (sortBy) {
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      case "highest":
        orderBy = { rating: "desc" }
        break
      case "lowest":
        orderBy = { rating: "asc" }
        break
    }
    
    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        }
      }),
      prisma.review.count({ where })
    ])
    
    // Get review statistics
    const stats = await prisma.review.groupBy({
      by: ["rating"],
      where: { productId },
      _count: { rating: true }
    })
    
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
      const stat = stats.find(s => s.rating === rating)
      const count = stat?._count.rating || 0
      return { rating, count, percentage: total > 0 ? (count / total) * 100 : 0 }
    })
    
    const averageRating = stats.reduce((sum, stat) => sum + (stat.rating * stat._count.rating), 0) / total
    
    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        stats: {
          averageRating: averageRating || 0,
          totalReviews: total,
          ratingDistribution
        }
      }
    })
    
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}
