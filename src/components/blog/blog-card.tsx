"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/ui/lazy-image"
import { Calendar, Clock, Eye, MessageCircle, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BlogCardProps {
  post: {
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
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (featured) {
    return (
      <Card className="group overflow-hidden hover:shadow-medium transition-all duration-300 h-full">
        <div className="relative h-64 md:h-80">
          <ProductImage
            src={post.featuredImage || "/images/blog-placeholder.jpg"}
            alt={post.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Featured Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Category */}
          {post.category && (
            <div className="text-sm font-medium text-primary uppercase tracking-wide mb-2">
              {post.category}
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {post.publishedAt && formatDate(post.publishedAt)}
            </div>
            {post.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.viewCount}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post._count.comments}
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden hover:shadow-medium transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48">
        <ProductImage
          src={post.featuredImage || "/images/blog-placeholder.jpg"}
          alt={post.title}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <CardHeader className="pb-3 flex-shrink-0">
        {/* Category */}
        {post.category && (
          <div className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
            {post.category}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors duration-200">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
      </CardHeader>

      <CardContent className="pt-0 flex-grow flex flex-col">
        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {post.publishedAt && formatDate(post.publishedAt)}
          </div>
          {post.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime}m
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {post.viewCount}
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mt-auto">
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-3 w-3 text-primary" />
            </div>
          )}
          <span className="text-xs font-medium">{post.author.name}</span>
        </div>
      </CardContent>
    </Card>
  )
}
