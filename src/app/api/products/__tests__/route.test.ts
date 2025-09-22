import { GET, POST } from '@/app/api/products/route'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
  },
}))

// Mock middleware
jest.mock('@/lib/middleware', () => ({
  withAuth: (handler: (req: Request, context: Record<string, unknown>) => Promise<Response>) => handler,
}))

describe('/api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/products', () => {
    it('returns products with pagination', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          price: 29.99,
          isActive: true,
          category: { name: 'Test Category' },
          reviews: [],
          _count: { reviews: 0, orderItems: 0 },
        },
      ]

      const { prisma } = await import('@/lib/prisma')
      prisma.product.findMany.mockResolvedValue(mockProducts)
      prisma.product.count.mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/products?page=1&limit=10')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      })
    })

    it('filters products by category', async () => {
      const { prisma } = await import('@/lib/prisma')
      prisma.product.findMany.mockResolvedValue([])
      prisma.product.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/products?category=prayer-beads')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { slug: 'prayer-beads' },
          }),
        })
      )
    })

    it('searches products by query', async () => {
      const { prisma } = await import('@/lib/prisma')
      prisma.product.findMany.mockResolvedValue([])
      prisma.product.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/products?q=tasbih')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                name: { contains: 'tasbih', mode: 'insensitive' },
              }),
            ]),
          }),
        })
      )
    })

    it('handles errors gracefully', async () => {
      const { prisma } = await import('@/lib/prisma')
      prisma.product.findMany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch products')
    })
  })

  describe('POST /api/products', () => {
    it('creates a new product', async () => {
      const mockProduct = {
        id: '1',
        name: 'New Product',
        price: 29.99,
        categoryId: 'cat-1',
      }

      const { prisma } = await import('@/lib/prisma')
      prisma.product.create.mockResolvedValue(mockProduct)
      prisma.category.findUnique.mockResolvedValue({ id: 'cat-1', name: 'Test Category' })

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Product',
          price: 29.99,
          categoryId: 'cat-1',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProduct)
    })

    it('validates required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('handles database errors', async () => {
      const { prisma } = await import('@/lib/prisma')
      prisma.product.create.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Product',
          price: 29.99,
          categoryId: 'cat-1',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to create product')
    })
  })
})
