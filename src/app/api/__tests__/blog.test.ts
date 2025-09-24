import { NextRequest } from 'next/server'
import { GET, POST } from '../blog/route'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    blogPost: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}))

const { prisma } = require('@/lib/prisma')

describe('/api/blog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/blog', () => {
    it('should fetch blog posts successfully', async () => {
      const mockBlogPosts = [
        {
          id: '1',
          title: 'Test Blog Post',
          slug: 'test-blog-post',
          excerpt: 'This is a test blog post',
          content: 'Full content here',
          publishedAt: new Date(),
          author: { name: 'Test Author' },
          tags: ['test', 'blog'],
          _count: { comments: 5 },
        },
      ]

      prisma.blogPost.findMany.mockResolvedValue(mockBlogPosts)
      prisma.blogPost.count.mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/blog')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockBlogPosts)
      expect(prisma.blogPost.findMany).toHaveBeenCalled()
    })

    it('should filter by category', async () => {
      const mockBlogPosts = []
      prisma.blogPost.findMany.mockResolvedValue(mockBlogPosts)
      prisma.blogPost.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/blog?category=technology')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(prisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: 'technology'
          })
        })
      )
    })

    it('should filter by tag', async () => {
      const mockBlogPosts = []
      prisma.blogPost.findMany.mockResolvedValue(mockBlogPosts)
      prisma.blogPost.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/blog?tag=javascript')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(prisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tags: expect.objectContaining({
              has: 'javascript'
            })
          })
        })
      )
    })

    it('should filter featured posts', async () => {
      const mockBlogPosts = []
      prisma.blogPost.findMany.mockResolvedValue(mockBlogPosts)
      prisma.blogPost.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/blog?featured=true')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(prisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isFeatured: true
          })
        })
      )
    })

    it('should handle pagination', async () => {
      const mockBlogPosts = []
      prisma.blogPost.findMany.mockResolvedValue(mockBlogPosts)
      prisma.blogPost.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/blog?page=2&limit=5')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(prisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5, // (page - 1) * limit
          take: 5
        })
      )
    })

    it('should handle database errors', async () => {
      prisma.blogPost.findMany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/blog')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch blog posts')
    })
  })

  describe('POST /api/blog', () => {
    it('should create a new blog post successfully', async () => {
      const mockBlogPost = {
        id: '1',
        title: 'New Blog Post',
        slug: 'new-blog-post',
        content: 'This is a new blog post',
        authorId: '1',
        publishedAt: new Date(),
      }

      prisma.blogPost.create.mockResolvedValue(mockBlogPost)

      const request = new NextRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Blog Post',
          content: 'This is a new blog post',
          excerpt: 'This is an excerpt',
          tags: ['new', 'blog'],
          category: 'technology',
          authorId: '1',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockBlogPost)
      expect(prisma.blogPost.create).toHaveBeenCalled()
    })

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog', {
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
      prisma.blogPost.create.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Blog Post',
          content: 'This is a new blog post',
          authorId: '1',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to create blog post')
    })
  })
})
