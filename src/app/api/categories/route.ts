import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get("includeProducts") === "true"
    const parentOnly = searchParams.get("parentOnly") === "true"
    const slug = searchParams.get("slug")

    const where: { parentId?: null; slug?: string } = {}
    if (parentOnly) {
      where.parentId = null
    }
    if (slug) {
      where.slug = slug
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: {
          include: {
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
        },
        products: includeProducts ? {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            isFeatured: true,
            description: true,
            tags: true,
          },
          ...(slug ? {} : { take: 8 }), // Limit products only when fetching all categories
        } : false,
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
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
