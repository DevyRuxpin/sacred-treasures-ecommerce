import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
// import { withAuth } from "@/lib/middleware"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function getCart() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // For now, we'll use client-side cart storage
    // In a full implementation, you'd store cart items in the database
    return NextResponse.json({
      success: true,
      data: [],
      message: "Cart retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    )
  }
}

async function addToCart(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { productId, variantId, quantity } = body

    // Validate product exists and is available
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        isActive: true,
      },
      include: {
        variants: variantId ? {
          where: {
            id: variantId,
          },
        } : false,
      },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    if (product.trackQuantity && product.quantity < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient stock" },
        { status: 400 }
      )
    }

    // For now, return success - cart management is handled client-side
    // In a full implementation, you'd store cart items in the database
    return NextResponse.json({
      success: true,
      message: "Item added to cart successfully",
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { success: false, error: "Failed to add item to cart" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return getCart()
}

export async function POST(_request: NextRequest) {
  return addToCart(_request)
}
