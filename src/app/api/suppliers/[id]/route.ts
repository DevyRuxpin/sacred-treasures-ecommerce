import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
// import { withAuth } from "@/lib/middleware"

async function getSupplier(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        products: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Supplier not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: supplier,
    })
  } catch (error) {
    console.error("Error fetching supplier:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch supplier" },
      { status: 500 }
    )
  }
}

async function updateSupplier(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      phone,
      contactPerson,
      address,
      city,
      state,
      country,
      postalCode,
      website,
      apiEndpoint,
      apiKey,
      apiSecret,
      isActive,
    } = body

    const supplier = await prisma.supplier.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone,
        contactPerson,
        address: { ...address, city, state, country, postalCode },
        website,
        isActive,
      },
    })

    return NextResponse.json({
      success: true,
      data: supplier,
    })
  } catch (error) {
    console.error("Error updating supplier:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update supplier" },
      { status: 500 }
    )
  }
}

async function deleteSupplier(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    // Check if supplier has products
    const productCount = await prisma.supplierProduct.count({
      where: { supplierId: id },
    })

    if (productCount > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete supplier with associated products" },
        { status: 400 }
      )
    }

    await prisma.supplier.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Supplier deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting supplier:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete supplier" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  return getSupplier(request, { params })
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  return updateSupplier(request, { params })
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  return deleteSupplier(request, { params })
}
