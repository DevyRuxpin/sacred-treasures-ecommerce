import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeComments = searchParams.get("comments") === "true"

    // Get blog post
    const post = await prisma.blogPost.findUnique({
      where: { 
        slug: params.slug,
        isPublished: true,
        publishedAt: { not: null }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        comments: includeComments ? {
          where: {
            isApproved: true
          },
          orderBy: {
            createdAt: "desc"
          }
        } : false,
        _count: {
          select: {
            comments: {
              where: {
                isApproved: true
              }
            }
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    // Get related posts
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        id: { not: post.id },
        isPublished: true,
        publishedAt: { not: null },
        OR: [
          { category: post.category },
          { tags: { array_contains: post.tags } }
        ]
      },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        }
      },
      take: 3,
      orderBy: {
        publishedAt: "desc"
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        viewCount: post.viewCount + 1,
        relatedPosts
      }
    })

  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog post" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    
    // Get existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: params.slug }
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      )
    }

    // Calculate read time if content changed
    let readTime = existingPost.readTime
    if (body.content && body.content !== existingPost.content) {
      const wordsPerMinute = 200
      const wordCount = body.content.split(/\s+/).length
      readTime = Math.ceil(wordCount / wordsPerMinute)
    }

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
        ...body,
        readTime,
        publishedAt: body.isPublished && !existingPost.publishedAt ? new Date() : existingPost.publishedAt,
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
      message: "Blog post updated successfully"
    })

  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update blog post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug }
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      )
    }

    await prisma.blogPost.delete({
      where: { slug: params.slug }
    })

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post" },
      { status: 500 }
    )
  }
}
