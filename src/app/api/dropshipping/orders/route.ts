import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
// import { withAuth } from "@/lib/middleware"

async function forwardOrderToSupplier(req: NextRequest) {
  try {
    const { orderId, supplierId } = await req.json()

    if (!orderId || !supplierId) {
      return NextResponse.json(
        { success: false, error: "Order ID and Supplier ID are required" },
        { status: 400 }
      )
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                supplierProducts: {
                  where: { supplierId },
                },
              },
            },
          },
        },
        user: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    // Get supplier details
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    })

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Supplier not found" },
        { status: 404 }
      )
    }

    // Filter items that belong to this supplier
    const supplierItems = order.items.filter(item => 
      item.product.supplierProducts.length > 0
    )

    if (supplierItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items from this supplier in the order" },
        { status: 400 }
      )
    }

    // Prepare order data for supplier
    const supplierOrderData = {
      orderNumber: order.orderNumber,
      customerName: order.user?.name || "Guest",
      customerEmail: order.user?.email || "",
      shippingAddress: {
        street: (order.shippingAddress as Record<string, unknown>)?.street as string || "",
        city: (order.shippingAddress as Record<string, unknown>)?.city as string || "",
        state: (order.shippingAddress as Record<string, unknown>)?.state as string || "",
        country: (order.shippingAddress as Record<string, unknown>)?.country as string || "",
        postalCode: (order.shippingAddress as Record<string, unknown>)?.postalCode as string || "",
      },
      items: supplierItems.map(item => ({
        sku: item.product.supplierProducts[0].supplierSku || '',
        quantity: item.quantity,
        price: Number(item.product.supplierProducts[0].supplierPrice),
      })),
      total: supplierItems.reduce((sum, item) => 
        sum + (item.quantity * Number(item.product.supplierProducts[0].supplierPrice)), 0
      ),
      orderDate: order.createdAt,
    }

    // In a real implementation, you would call the supplier's API
    const forwardResult = await simulateOrderForwarding(supplier, supplierOrderData)

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PROCESSING",
        updatedAt: new Date(),
      },
    })

    // Create order forwarding record
    const forwardingRecord = await prisma.orderForwarding.create({
      data: {
        orderId,
        supplierId,
        supplierOrderId: forwardResult.supplierOrderId,
        status: "FORWARDED",
        trackingNumber: forwardResult.trackingNumber,
        notes: forwardResult.notes,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        supplierId,
        supplierOrderId: forwardResult.supplierOrderId,
        trackingNumber: forwardResult.trackingNumber,
        status: "FORWARDED",
        forwardedAt: forwardingRecord.createdAt,
      },
    })
  } catch (error) {
    console.error("Error forwarding order to supplier:", error)
    return NextResponse.json(
      { success: false, error: "Failed to forward order to supplier" },
      { status: 500 }
    )
  }
}

async function simulateOrderForwarding(supplier: { id: string; name: string }, orderData: { items: Array<{ sku: string; quantity: number; price: number }> }) {
  // Simulate API call to supplier
  // In a real implementation, you would make an HTTP request to supplier.apiEndpoint
  
  return {
    supplierOrderId: `SUP-${Date.now()}`,
    trackingNumber: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    notes: `Order forwarded to ${supplier.name} successfully`,
  }
}

async function getOrderForwardingStatus(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get("orderId")
    const supplierId = searchParams.get("supplierId")

    const where: { orderId?: string; supplierId?: string } = {}
    if (orderId) where.orderId = orderId
    if (supplierId) where.supplierId = supplierId

    const forwardingRecords = await prisma.orderForwarding.findMany({
      where,
      include: {
        supplier: {
          select: {
            name: true,
            contactPerson: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: forwardingRecords,
    })
  } catch (error) {
    console.error("Error fetching order forwarding status:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch order forwarding status" },
      { status: 500 }
    )
  }
}

async function updateOrderForwardingStatus(req: NextRequest) {
  try {
    const { forwardingId, status, trackingNumber, notes } = await req.json()

    if (!forwardingId || !status) {
      return NextResponse.json(
        { success: false, error: "Forwarding ID and status are required" },
        { status: 400 }
      )
    }

    const forwardingRecord = await prisma.orderForwarding.update({
      where: { id: forwardingId },
      data: {
        status,
        trackingNumber,
        notes,
        updatedAt: new Date(),
      },
      include: {
        supplier: true,
      },
    })

    // Update main order status if needed
    if (status === "SHIPPED" || status === "DELIVERED") {
      await prisma.order.update({
        where: { id: forwardingRecord.orderId },
        data: {
          status: status === "SHIPPED" ? "SHIPPED" : "DELIVERED",
          updatedAt: new Date(),
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: forwardingRecord,
    })
  } catch (error) {
    console.error("Error updating order forwarding status:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update order forwarding status" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return forwardOrderToSupplier(request)
}
export async function GET(request: NextRequest) {
  return getOrderForwardingStatus(request)
}

export async function PUT(request: NextRequest) {
  return updateOrderForwardingStatus(request)
}
