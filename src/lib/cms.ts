import { prisma } from "./prisma"

export interface BlogPostData {
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  isPublished: boolean
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
  tags: string[]
  category?: string
  authorId: string
}

export class ContentManager {
  // Create a new blog post
  static async createPost(data: BlogPostData) {
    try {
      // Check if slug already exists
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: data.slug }
      })

      if (existingPost) {
        throw new Error("A blog post with this slug already exists")
      }

      // Calculate read time
      const wordsPerMinute = 200
      const wordCount = data.content.split(/\s+/).length
      const readTime = Math.ceil(wordCount / wordsPerMinute)

      // Create blog post
      const post = await prisma.blogPost.create({
        data: {
          ...data,
          readTime,
          publishedAt: data.isPublished ? new Date() : null,
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

      return { success: true, data: post }
    } catch (error) {
      console.error("Error creating blog post:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to create blog post" }
    }
  }

  // Update an existing blog post
  static async updatePost(slug: string, data: Partial<BlogPostData>) {
    try {
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug }
      })

      if (!existingPost) {
        throw new Error("Blog post not found")
      }

      // Calculate read time if content changed
      let readTime = existingPost.readTime
      if (data.content && data.content !== existingPost.content) {
        const wordsPerMinute = 200
        const wordCount = data.content.split(/\s+/).length
        readTime = Math.ceil(wordCount / wordsPerMinute)
      }

      // Update blog post
      const post = await prisma.blogPost.update({
        where: { slug },
        data: {
          ...data,
          readTime,
          publishedAt: data.isPublished && !existingPost.publishedAt ? new Date() : existingPost.publishedAt,
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

      return { success: true, data: post }
    } catch (error) {
      console.error("Error updating blog post:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to update blog post" }
    }
  }

  // Delete a blog post
  static async deletePost(slug: string) {
    try {
      const post = await prisma.blogPost.findUnique({
        where: { slug }
      })

      if (!post) {
        throw new Error("Blog post not found")
      }

      await prisma.blogPost.delete({
        where: { slug }
      })

      return { success: true }
    } catch (error) {
      console.error("Error deleting blog post:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to delete blog post" }
    }
  }

  // Get all blog posts with pagination and filters
  static async getPosts(options: {
    page?: number
    limit?: number
    category?: string
    tag?: string
    featured?: boolean
    published?: boolean
  } = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        tag,
        featured,
        published = true
      } = options

      // Build where clause
      const where: any = {}
      
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
      
      if (featured) {
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

      return {
        success: true,
        data: {
          posts,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
          }
        }
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      return { success: false, error: "Failed to fetch blog posts" }
    }
  }

  // Get a single blog post by slug
  static async getPost(slug: string, includeComments = false) {
    try {
      const post = await prisma.blogPost.findUnique({
        where: { 
          slug,
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
        return { success: false, error: "Blog post not found" }
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

      return {
        success: true,
        data: {
          ...post,
          viewCount: post.viewCount + 1,
          relatedPosts
        }
      }
    } catch (error) {
      console.error("Error fetching blog post:", error)
      return { success: false, error: "Failed to fetch blog post" }
    }
  }

  // Get blog statistics
  static async getStats() {
    try {
      const [
        totalPosts,
        publishedPosts,
        totalViews,
        totalComments,
        categories,
        tags
      ] = await Promise.all([
        prisma.blogPost.count(),
        prisma.blogPost.count({
          where: {
            isPublished: true,
            publishedAt: { not: null }
          }
        }),
        prisma.blogPost.aggregate({
          where: {
            isPublished: true
          },
          _sum: {
            viewCount: true
          }
        }),
        prisma.blogComment.count({
          where: {
            isApproved: true
          }
        }),
        prisma.blogPost.groupBy({
          by: ["category"],
          where: {
            category: { not: null },
            isPublished: true
          },
          _count: {
            category: true
          }
        }),
        prisma.blogPost.findMany({
          select: {
            tags: true
          },
          where: {
            isPublished: true
          }
        })
      ])

      // Count tag frequency
      const tagCounts: { [key: string]: number } = {}
      tags.forEach(post => {
        if (Array.isArray(post.tags)) {
          post.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
          })
        }
      })

      return {
        success: true,
        data: {
          totalPosts,
          publishedPosts,
          totalViews: totalViews._sum.viewCount || 0,
          totalComments,
          categories: categories.map(c => ({
            name: c.category,
            count: c._count.category
          })),
          tags: Object.entries(tagCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20)
        }
      }
    } catch (error) {
      console.error("Error fetching blog stats:", error)
      return { success: false, error: "Failed to fetch blog statistics" }
    }
  }

  // Generate slug from title
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  // Extract excerpt from content
  static extractExcerpt(content: string, maxLength = 160): string {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '')
    
    if (plainText.length <= maxLength) {
      return plainText
    }
    
    // Find the last complete word within the limit
    const truncated = plainText.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
  }

  // Validate blog post data
  static validatePostData(data: Partial<BlogPostData>) {
    const errors: string[] = []

    if (!data.title || data.title.trim().length === 0) {
      errors.push("Title is required")
    }

    if (!data.content || data.content.trim().length === 0) {
      errors.push("Content is required")
    }

    if (!data.slug || data.slug.trim().length === 0) {
      errors.push("Slug is required")
    }

    if (!data.authorId || data.authorId.trim().length === 0) {
      errors.push("Author ID is required")
    }

    if (data.title && data.title.length > 200) {
      errors.push("Title must be less than 200 characters")
    }

    if (data.content && data.content.length > 50000) {
      errors.push("Content must be less than 50,000 characters")
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
