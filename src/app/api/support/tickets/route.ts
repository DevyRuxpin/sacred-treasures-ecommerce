import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const createTicketSchema = z.object({
  subject: z.string().min(1).max(200),
  description: z.string().min(10).max(5000),
  category: z.enum([
    "GENERAL_INQUIRY",
    "ORDER_SUPPORT", 
    "PRODUCT_QUESTION",
    "TECHNICAL_ISSUE",
    "BILLING_QUESTION",
    "RETURN_REQUEST",
    "COMPLAINT",
    "FEATURE_REQUEST"
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  orderId: z.string().optional(),
  productId: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const priority = searchParams.get("priority")

    // Build where clause
    const where: any = {
      userId: session.user.id
    }

    if (status) {
      where.status = status
    }

    if (category) {
      where.category = category
    }

    if (priority) {
      where.priority = priority
    }

    // Get tickets with pagination
    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          _count: {
            select: {
              messages: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.supportTicket.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        tickets,
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
    console.error("Error fetching support tickets:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch support tickets" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createTicketSchema.parse(body)

    // Create support ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Create initial message
    await prisma.supportMessage.create({
      data: {
        content: validatedData.description,
        isFromUser: true,
        ticketId: ticket.id,
        userId: session.user.id,
      }
    })

    return NextResponse.json({
      success: true,
      data: ticket,
      message: "Support ticket created successfully"
    })

  } catch (error) {
    console.error("Error creating support ticket:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create support ticket" },
      { status: 500 }
    )
  }
}
