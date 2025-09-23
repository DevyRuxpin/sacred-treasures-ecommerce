"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Calendar, Tag, User } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: string
  readTime?: number
  viewCount: number
  category?: string
  tags: string[]
  author: {
    name: string
    image?: string
  }
  _count: {
    comments: number
  }
}

interface BlogResponse {
  posts: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  })
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  const fetchPosts = async (page = 1, category?: string, tag?: string, featured?: boolean) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(category && { category }),
        ...(tag && { tag }),
        ...(featured && { featured: "true" })
      })

      const response = await fetch(`/api/blog?${params}`)
      const data = await response.json()

      if (data.success) {
        setPosts(data.data.posts)
        setPagination(data.data.pagination)
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoriesAndTags = async () => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()

      if (data.success) {
        const categories = [...new Set(data.data.posts.map((post: BlogPost) => post.category).filter(Boolean))]
        const tags = [...new Set(data.data.posts.flatMap((post: BlogPost) => post.tags))]
        
        setAllCategories(categories as string[])
        setAllTags(tags)
      }
    } catch (error) {
      console.error("Error fetching categories and tags:", error)
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchCategoriesAndTags()
  }, [])

  const handleSearch = () => {
    // For now, we'll filter client-side. In a real app, you'd want server-side search
    const filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setPosts(filteredPosts)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
    fetchPosts(1, selectedCategory === category ? undefined : category, selectedTag)
  }

  const handleTagFilter = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag)
    fetchPosts(1, selectedCategory, selectedTag === tag ? undefined : tag)
  }

  const handleFeaturedFilter = () => {
    fetchPosts(1, selectedCategory, selectedTag, true)
  }

  const featuredPosts = posts.filter(post => post.tags.includes("featured") || post.category === "Featured")
  const regularPosts = posts.filter(post => !post.tags.includes("featured") && post.category !== "Featured")

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sacred Treasures Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover stories, insights, and inspiration from the world of religious artifacts and spiritual practices.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          {/* Categories */}
          {allCategories.length > 0 && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {allCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {allTags.slice(0, 8).map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagFilter(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(selectedCategory || selectedTag) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory(null)
                setSelectedTag(null)
                fetchPosts()
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post) => (
              <BlogCard key={post.id} post={post} featured />
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        {regularPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={!pagination.hasPrev}
            onClick={() => fetchPosts(pagination.page - 1, selectedCategory, selectedTag)}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === pagination.page ? "default" : "outline"}
                size="sm"
                onClick={() => fetchPosts(page, selectedCategory, selectedTag)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            disabled={!pagination.hasNext}
            onClick={() => fetchPosts(pagination.page + 1, selectedCategory, selectedTag)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
