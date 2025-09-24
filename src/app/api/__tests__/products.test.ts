import { NextRequest } from 'next/server'
import { GET, POST } from '../products/route'

// Mock Prisma
const mockPrisma = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  category: {
    findMany: jest.fn(),
  },
}

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

describe('/api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/products', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          price: 29.99,
          images: ['https://example.com/image.jpg'],
          category: { name: 'Test Category', slug: 'test-category' },
        },
      ]

      mockPrisma.product.findMany.mockResolvedValue(mockProducts)
      mockPrisma.product.count.mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProducts)
      expect(mockPrisma.product.findMany).toHaveBeenCalled()
    })

    it('should handle search query', async () => {
      const mockProducts = []
      mockPrisma.product.findMany.mockResolvedValue(mockProducts)
      mockPrisma.product.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/products?search=test')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                name: { contains: 'test', mode: 'insensitive' }
              })
            ])
          })
        })
      )
    })

    it('should handle category filter', async () => {
      const mockProducts = []
      mockPrisma.product.findMany.mockResolvedValue(mockProducts)
      mockPrisma.product.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/products?category=test-category')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { slug: 'test-category' }
          })
        })
      )
    })

    it('should handle pagination', async () => {
      const mockProducts = []
      mockPrisma.product.findMany.mockResolvedValue(mockProducts)
      mockPrisma.product.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/products?page=2&limit=10')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page - 1) * limit
          take: 10
        })
      )
    })

    it('should handle price range filter', async () => {
      const mockProducts = []
      mockPrisma.product.findMany.mockResolvedValue(mockProducts)
      mockPrisma.product.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/products?minPrice=10&maxPrice=50')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: {
              gte: 10,
              lte: 50
            }
          })
        })
      )
    })

    it('should handle database errors', async () => {
      mockPrisma.product.findMany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch products')
    })
  })

  describe('POST /api/products', () => {
    it('should create a new product successfully', async () => {
      const mockProduct = {
        id: '1',
        name: 'New Product',
        price: 39.99,
        images: ['https://example.com/image.jpg'],
      }

      mockPrisma.product.create.mockResolvedValue(mockProduct)

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Product',
          price: 39.99,
          images: ['https://example.com/image.jpg'],
          categoryId: '1',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProduct)
      expect(mockPrisma.product.create).toHaveBeenCalled()
    })

    it('should validate required fields', async () => {
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
      expect(data.error).toContain('validation')
    })

    it('should handle database errors on creation', async () => {
      mockPrisma.product.create.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Product',
          price: 39.99,
          images: ['https://example.com/image.jpg'],
          categoryId: '1',
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
