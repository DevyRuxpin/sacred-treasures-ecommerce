"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/ui/product-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Sparkles, TrendingUp, Users, Package } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  averageRating: number
  reviewCount: number
  isFeatured?: boolean
  category?: {
    name: string
    slug: string
  }
}

interface RecommendationSectionProps {
  title: string
  description: string
  type: "similar" | "frequently_bought_together" | "trending" | "personalized" | "category" | "featured"
  productId?: string
  userId?: string
  categoryId?: string
  icon?: React.ReactNode
  maxItems?: number
  showViewAll?: boolean
  viewAllLink?: string
}

export function RecommendationSection({
  title,
  description,
  type,
  productId,
  userId,
  categoryId,
  icon = <Sparkles className="h-5 w-5" />,
  maxItems = 8,
  showViewAll = true,
  viewAllLink,
}: RecommendationSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const params = new URLSearchParams()
        params.append("type", type)
        params.append("limit", maxItems.toString())
        
        if (productId) params.append("productId", productId)
        if (userId) params.append("userId", userId)
        if (categoryId) params.append("categoryId", categoryId)

        const response = await fetch(`/api/recommendations?${params}`)
        const data = await response.json()

        if (data.success && data.data) {
          setProducts(data.data)
        } else {
          setError("Failed to load recommendations")
        }
      } catch (err) {
        setError("Failed to load recommendations")
        console.error("Error fetching recommendations:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [type, productId, userId, categoryId, maxItems])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || products.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showViewAll && viewAllLink && (
            <Button variant="outline" size="sm" asChild>
              <Link href={viewAllLink}>
                View All
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Specialized recommendation components
export function SimilarProducts({ productId, maxItems = 4 }: { productId: string; maxItems?: number }) {
  return (
    <RecommendationSection
      title="Similar Products"
      description="You might also like these items"
      type="similar"
      productId={productId}
      icon={<Icon><Package className="h-5 w-5" /></Icon>}
      maxItems={maxItems}
      showViewAll={false}
    />
  )
}

export function FrequentlyBoughtTogether({ productId, maxItems = 4 }: { productId: string; maxItems?: number }) {
  return (
    <RecommendationSection
      title="Frequently Bought Together"
      description="Customers who bought this item also purchased"
      type="frequently_bought_together"
      productId={productId}
      icon={<Icon><Users className="h-5 w-5" /></Icon>}
      maxItems={maxItems}
      showViewAll={false}
    />
  )
}

export function TrendingProducts({ maxItems = 8 }: { maxItems?: number }) {
  return (
    <RecommendationSection
      title="Trending Now"
      description="Popular items this week"
      type="trending"
      icon={<Icon><TrendingUp className="h-5 w-5" /></Icon>}
      maxItems={maxItems}
      viewAllLink="/products?sortBy=popularity&sortOrder=desc"
    />
  )
}

export function PersonalizedRecommendations({ userId, maxItems = 8 }: { userId?: string; maxItems?: number }) {
  if (!userId) return null

  return (
    <RecommendationSection
      title="Recommended for You"
      description="Based on your purchase history"
      type="personalized"
      userId={userId}
      icon={<Icon><Sparkles className="h-5 w-5" /></Icon>}
      maxItems={maxItems}
      viewAllLink="/products"
    />
  )
}

export function CategoryRecommendations({ categoryId, maxItems = 8 }: { categoryId: string; maxItems?: number }) {
  return (
    <RecommendationSection
      title="More from This Category"
      description="Explore similar items"
      type="category"
      categoryId={categoryId}
      icon={<Icon><Package className="h-5 w-5" /></Icon>}
      maxItems={maxItems}
      showViewAll={false}
    />
  )
}

export function FeaturedProducts({ maxItems = 8 }: { maxItems?: number }) {
  return (
    <RecommendationSection
      title="Featured Products"
      description="Handpicked items for you"
      type="featured"
      icon={<Icon><Sparkles className="h-5 w-5" /></Icon>}
      maxItems={maxItems}
      viewAllLink="/products?featured=true"
    />
  )
}
