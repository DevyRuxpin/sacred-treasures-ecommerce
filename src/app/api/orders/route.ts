import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
// import { withAuth } from "@/lib/middleware"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function getOrders(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  slug: true,
                  images: true,
                },
              },
              variant: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where: {
          userId: session.user.id,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

async function createOrder(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
    } = body

    // Validate items and calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: {
          id: item.productId,
          isActive: true,
        },
        include: {
          variants: item.variantId ? {
            where: {
              id: item.variantId,
            },
          } : false,
        },
      })

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      if (product.trackQuantity && product.quantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      const price = item.variantId && product.variants?.[0]?.price
        ? product.variants[0].price
        : product.price

      const itemTotal = Number(price) * item.quantity
      subtotal += itemTotal

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price,
        total: itemTotal,
      })
    }

    // Calculate taxes and shipping (simplified)
    const taxAmount = subtotal * 0.08 // 8% tax
    const shippingAmount = subtotal > 50 ? 0 : 10 // Free shipping over $50
    const total = subtotal + taxAmount + shippingAmount

    // Generate order number
    const orderNumber = `ST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount: 0,
        total,
        shippingAddress,
        billingAddress,
        paymentMethod,
        notes,
        userId: (session.user as any).id,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: true,
              },
            },
            variant: true,
          },
        },
      },
    })

    // Update product quantities
    for (const item of orderItems) {
      await prisma.product.update({
        where: {
          id: item.productId,
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return getOrders(request)
}

export async function POST(request: NextRequest) {
  return createOrder(request)
}
