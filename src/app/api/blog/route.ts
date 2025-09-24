import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createBlogPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  featuredImage: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  authorId: z.string().min(1),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const featured = searchParams.get("featured")
    const published = searchParams.get("published") !== "false"

    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (published) {
      where.isPublished = true
      where.publishedAt = { not: null }
    }
    
    if (category) {
      where.category = category
    }
    
    if (tag) {
      where.tags = {
        array_contains: [tag]
      }
    }
    
    if (featured === "true") {
      where.isFeatured = true
    }

    // Get blog posts with pagination
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          _count: {
            select: {
              comments: {
                where: {
                  isApproved: true
                }
              }
            }
          }
        },
        orderBy: {
          publishedAt: "desc"
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where })
    ])

    // Calculate read time for posts without it
    const postsWithReadTime = posts.map(post => {
      if (!post.readTime && post.content) {
        const wordsPerMinute = 200
        const wordCount = post.content.split(/\s+/).length
        const readTime = Math.ceil(wordCount / wordsPerMinute)
        return { ...post, readTime }
      }
      return post
    })

    return NextResponse.json({
      success: true,
      data: {
        posts: postsWithReadTime,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    })

  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBlogPostSchema.parse(body)

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { success: false, error: "A blog post with this slug already exists" },
        { status: 400 }
      )
    }

    // Calculate read time
    const wordsPerMinute = 200
    const wordCount = validatedData.content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / wordsPerMinute)

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        ...validatedData,
        readTime,
        publishedAt: validatedData.isPublished ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: post,
      message: "Blog post created successfully"
    })

  } catch (error) {
    console.error("Error creating blog post:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}
