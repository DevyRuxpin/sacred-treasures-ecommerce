"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children: Category[]
  products?: Array<{
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number
    images: string[]
    isFeatured: boolean
  }>
  _count: {
    products: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories?includeProducts=true&parentOnly=true")
        const data = await response.json()
        
        if (data.success && data.data) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our carefully curated collection of religious items organized by faith and tradition
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {categories.map((category) => (
          <Card key={category.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <Link href={`/categories/${category.slug}`}>
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={category.image || "/images/categories/placeholder.jpg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-white/90 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary">
                  <Package className="h-3 w-3 mr-1" />
                  {category._count.products} products
                </Badge>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/categories/${category.slug}`}>
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>

              {category.children && category.children.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Subcategories:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.children.slice(0, 3).map((child) => (
                      <Link
                        key={child.id}
                        href={`/categories/${child.slug}`}
                        className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                    {category.children.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{category.children.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground">
            Discover our most popular religious items
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories
            .flatMap(category => category.products || [])
            .filter(product => product.isFeatured)
            .slice(0, 8)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>

      {/* Religious Traditions Info */}
      <div className="bg-muted/50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Respecting All Faiths</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            We understand the deep spiritual significance of religious items and work with trusted artisans 
            and suppliers to ensure authenticity and respect for each tradition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">☪️</span>
            </div>
            <h3 className="font-semibold mb-2">Islamic Items</h3>
            <p className="text-sm text-muted-foreground">
              Authentic Islamic religious items including tasbih, prayer mats, and Quran accessories
            </p>
          </div>
          
          <div className="text-center">
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🕉️</span>
            </div>
            <h3 className="font-semibold mb-2">Hindu Items</h3>
            <p className="text-sm text-muted-foreground">
              Traditional Hindu religious items including mala beads, idols, and meditation accessories
            </p>
          </div>
          
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">☬</span>
            </div>
            <h3 className="font-semibold mb-2">Sikh Items</h3>
            <p className="text-sm text-muted-foreground">
              Authentic Sikh religious items including kirpans, turbans, and prayer books
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
