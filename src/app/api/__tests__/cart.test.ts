import { NextRequest } from 'next/server'
import { GET, POST } from '../cart/route'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    cartItem: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  },
}))

const { prisma } = require('@/lib/prisma')

describe('/api/cart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/cart', () => {
    it('should fetch cart items successfully', async () => {
      const mockCartItems = [
        {
          id: '1',
          quantity: 2,
          product: {
            id: '1',
            name: 'Test Product',
            price: 29.99,
            images: ['https://example.com/image.jpg'],
          },
        },
      ]

      prisma.cartItem.findMany.mockResolvedValue(mockCartItems)

      const request = new NextRequest('http://localhost:3000/api/cart')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockCartItems)
      expect(prisma.cartItem.findMany).toHaveBeenCalled()
    })

    it('should handle empty cart', async () => {
      prisma.cartItem.findMany.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/cart')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('should handle database errors', async () => {
      prisma.cartItem.findMany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/cart')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch cart')
    })
  })

  describe('POST /api/cart', () => {
    it('should add item to cart successfully', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: 29.99,
        images: ['https://example.com/image.jpg'],
      }

      const mockCartItem = {
        id: '1',
        productId: '1',
        quantity: 1,
        product: mockProduct,
      }

      prisma.product.findUnique.mockResolvedValue(mockProduct)
      prisma.cartItem.upsert.mockResolvedValue(mockCartItem)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: '1',
          quantity: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockCartItem)
      expect(prisma.cartItem.upsert).toHaveBeenCalled()
    })

    it('should update existing cart item quantity', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: 29.99,
        images: ['https://example.com/image.jpg'],
      }

      const mockCartItem = {
        id: '1',
        productId: '1',
        quantity: 3, // Updated quantity
        product: mockProduct,
      }

      prisma.product.findUnique.mockResolvedValue(mockProduct)
      prisma.cartItem.upsert.mockResolvedValue(mockCartItem)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: '1',
          quantity: 3,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.quantity).toBe(3)
    })

    it('should handle invalid product ID', async () => {
      prisma.product.findUnique.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: 'invalid',
          quantity: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Product not found')
    })

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          // Missing productId and quantity
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('validation')
    })

    it('should handle database errors', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: 29.99,
        images: ['https://example.com/image.jpg'],
      }

      prisma.product.findUnique.mockResolvedValue(mockProduct)
      prisma.cartItem.upsert.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: '1',
          quantity: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to add item to cart')
    })
  })
})
