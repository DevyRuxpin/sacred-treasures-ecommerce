import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await prisma.product.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    const productWithRating = {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: product._count.reviews,
      _count: undefined,
    }

    return NextResponse.json({
      success: true,
      data: productWithRating,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
