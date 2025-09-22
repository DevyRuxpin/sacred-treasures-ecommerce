import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
// import { withAuth } from "@/lib/middleware"

async function getSuppliers(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"

    const skip = (page - 1) * limit

    const where: { OR?: Array<{ name?: { contains: string; mode: "insensitive" }; email?: { contains: string; mode: "insensitive" } }>; isActive?: boolean } = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
         { name: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status !== "all") {
      where.isActive = status === "active"
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.supplier.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: suppliers,
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
    console.error("Error fetching suppliers:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch suppliers" },
      { status: 500 }
    )
  }
}

async function createSupplier(req: NextRequest) {
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
      isActive = true,
    } = body

    const supplier = await prisma.supplier.create({
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
    console.error("Error creating supplier:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create supplier" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return getSuppliers(request)
}

export async function POST(request: NextRequest) {
  return createSupplier(request)
}
