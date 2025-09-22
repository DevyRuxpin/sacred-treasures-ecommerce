import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
// import { withAuth } from "@/lib/middleware"

async function syncSupplierInventory(req: NextRequest) {
  try {
    const { supplierId } = await req.json()

    if (!supplierId) {
      return NextResponse.json(
        { success: false, error: "Supplier ID is required" },
        { status: 400 }
      )
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    })

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Supplier not found" },
        { status: 404 }
      )
    }

    // In a real implementation, you would check supplier API configuration
    // if (!supplier.apiEndpoint || !supplier.apiKey) {
    //   return NextResponse.json(
    //     { success: false, error: "Supplier API configuration is incomplete" },
    //     { status: 400 }
    //   )
    // }

    // In a real implementation, you would call the supplier's API
    // For now, we'll simulate the sync process
    const syncResults = await simulateSupplierSync(supplier)

    return NextResponse.json({
      success: true,
      data: {
        supplierId,
        syncedProducts: syncResults.syncedProducts,
        updatedProducts: syncResults.updatedProducts,
        errors: syncResults.errors,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error syncing supplier inventory:", error)
    return NextResponse.json(
      { success: false, error: "Failed to sync supplier inventory" },
      { status: 500 }
    )
  }
}

async function simulateSupplierSync(supplier: { id: string; name: string }) {
  // Simulate API call to supplier
  const mockSupplierData = [
    {
      sku: "TASB-99-001",
      name: "Premium Tasbih - 99 Beads",
      price: 29.99,
      comparePrice: 39.99,
      quantity: 50,
      isActive: true,
      images: ["/images/products/tasbih-99-1.jpg"],
      description: "High-quality tasbih with 99 beads",
      shortDescription: "Premium tasbih for daily prayers",
      tags: ["tasbih", "prayer", "99-beads"],
    },
    {
      sku: "MALA-108-001",
      name: "Rudraksha Mala - 108 Beads",
      price: 45.99,
      comparePrice: 59.99,
      quantity: 3,
      isActive: true,
      images: ["/images/products/rudraksha-mala-1.jpg"],
      description: "Authentic rudraksha mala with 108 beads",
      shortDescription: "Traditional rudraksha mala",
      tags: ["mala", "rudraksha", "108-beads"],
    },
  ]

  const syncedProducts = []
  const updatedProducts = []
  const errors = []

  for (const item of mockSupplierData) {
    try {
      // Check if product exists
      const existingProduct = await prisma.product.findFirst({
        where: { sku: item.sku },
      })

      if (existingProduct) {
        // Update existing product
        const updatedProduct = await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            name: item.name,
            price: item.price,
            comparePrice: item.comparePrice,
            quantity: item.quantity,
            isActive: item.isActive,
            images: item.images.join(','),
            description: item.description,
            shortDescription: item.shortDescription,
            tags: item.tags.join(','),
            updatedAt: new Date(),
          },
        })

        // Update supplier product relationship
        await prisma.supplierProduct.upsert({
          where: {
            supplierId_productId: {
              supplierId: supplier.id,
              productId: existingProduct.id,
            },
          },
          update: {
            supplierSku: item.sku,
            supplierPrice: item.price,
          },
          create: {
            supplierId: supplier.id,
            productId: existingProduct.id,
            supplierSku: item.sku,
            supplierPrice: item.price,
          },
        })

        updatedProducts.push(updatedProduct)
      } else {
        // Create new product
        const newProduct = await prisma.product.create({
          data: {
            name: item.name,
            slug: item.name.toLowerCase().replace(/\s+/g, "-"),
            sku: item.sku,
            price: item.price,
            comparePrice: item.comparePrice,
            quantity: item.quantity,
            isActive: item.isActive,
            images: item.images.join(','),
            description: item.description,
            shortDescription: item.shortDescription,
            tags: item.tags.join(','),
            categoryId: "default-category", // You would map this properly
          },
        })

        // Create supplier product relationship
        await prisma.supplierProduct.create({
          data: {
            supplierId: supplier.id,
            productId: newProduct.id,
            supplierSku: item.sku,
            supplierPrice: item.price,
          },
        })

        syncedProducts.push(newProduct)
      }
    } catch (error) {
      errors.push({
        sku: item.sku,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return {
    syncedProducts,
    updatedProducts,
    errors,
  }
}

async function getSyncHistory(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const supplierId = searchParams.get("supplierId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    const where: { supplierId?: string } = {}
    if (supplierId) {
      where.supplierId = supplierId
    }

    const [syncHistory, total] = await Promise.all([
      prisma.supplierProduct.findMany({
        where,
        include: {
          supplier: {
            select: {
              name: true,
            },
          },
          product: {
            select: {
              name: true,
              sku: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.supplierProduct.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: syncHistory,
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
    console.error("Error fetching sync history:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch sync history" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return syncSupplierInventory(request)
}

export async function GET(request: NextRequest) {
  return getSyncHistory(request)
}
