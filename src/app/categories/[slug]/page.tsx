"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  isFeatured: boolean
  description?: string
  tags: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children: Category[]
  products: Product[]
  _count?: {
    products: number
  }
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories?slug=${slug}&includeProducts=true`)
        const data = await response.json()
        
        if (data.success && data.data && data.data.length > 0) {
          setCategory(data.data[0])
        }
      } catch (error) {
        console.error("Error fetching category:", error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategory()
    }
  }, [slug])

  const sortedProducts = category?.products.sort((a, b) => {
    let aValue: string | number = a[sortBy as keyof Product] || ""
    let bValue: string | number = b[sortBy as keyof Product] || ""
    
    if (typeof aValue === "string") aValue = aValue.toLowerCase()
    if (typeof bValue === "string") bValue = bValue.toLowerCase()
    
    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  }) || []

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-primary">Categories</Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">
              {category.description}
            </p>
            <Badge variant="secondary" className="mb-4">
              <Package className="h-3 w-3 mr-1" />
              {category._count?.products || 0} products
            </Badge>
          </div>
          
          {category.image && (
            <div className="w-full md:w-64 h-48 relative rounded-lg overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Subcategories */}
      {category.children && category.children.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Subcategories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {category.children.map((child) => (
              <Link key={child.id} href={`/categories/${child.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium text-sm">{child.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {child._count?.products || 0} products
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Products</h2>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="isFeatured">Featured</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">
              This category doesn&apos;t have any products yet.
            </p>
          </div>
        )}
      </div>

      {/* Back to Categories */}
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Categories
          </Link>
        </Button>
      </div>
    </div>
  )
}
