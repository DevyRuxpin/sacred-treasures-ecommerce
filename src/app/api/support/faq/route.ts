import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    // Build where clause
    const where: Record<string, unknown> = {
      isPublished: true
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        {
          question: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          answer: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    }

    // Get FAQs with pagination
    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        orderBy: [
          { order: "asc" },
          { viewCount: "desc" }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.fAQ.count({ where })
    ])

    // Get categories
    const categories = await prisma.fAQ.groupBy({
      by: ["category"],
      where: {
        isPublished: true
      },
      _count: {
        category: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        faqs,
        categories: categories.map(c => ({
          name: c.category,
          count: c._count.category
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    })

  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch FAQs" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    if (action === "feedback") {
      const body = await request.json()
      const { faqId, helpful } = body

      if (!faqId || typeof helpful !== "boolean") {
        return NextResponse.json(
          { success: false, error: "Invalid feedback data" },
          { status: 400 }
        )
      }

      // Update FAQ feedback
      const updateData = helpful 
        ? { helpfulCount: { increment: 1 } }
        : { notHelpfulCount: { increment: 1 } }

      await prisma.fAQ.update({
        where: { id: faqId },
        data: updateData
      })

      return NextResponse.json({
        success: true,
        message: "Feedback recorded successfully"
      })
    }

    if (action === "view") {
      const body = await request.json()
      const { faqId } = body

      if (!faqId) {
        return NextResponse.json(
          { success: false, error: "FAQ ID is required" },
          { status: 400 }
        )
      }

      // Increment view count
      await prisma.fAQ.update({
        where: { id: faqId },
        data: {
          viewCount: {
            increment: 1
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: "View count updated"
      })
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Error handling FAQ action:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    )
  }
}
