"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/ui/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Grid, List } from "lucide-react"
import { ProductFilters, PaginatedResponse } from "@/types"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  averageRating?: number
  reviewCount?: number
  isFeatured?: boolean
  category?: {
    name: string
    slug: string
  }
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    priceMin: searchParams.get("priceMin") ? parseFloat(searchParams.get("priceMin")!) : undefined,
    priceMax: searchParams.get("priceMax") ? parseFloat(searchParams.get("priceMax")!) : undefined,
    inStock: searchParams.get("inStock") === "true",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append("search", filters.search)
      if (filters.category) params.append("category", filters.category)
      if (filters.priceMin !== undefined) params.append("priceMin", filters.priceMin.toString())
      if (filters.priceMax !== undefined) params.append("priceMax", filters.priceMax.toString())
      if (filters.inStock) params.append("inStock", "true")
      
      params.append("page", pagination.page.toString())
      params.append("limit", pagination.limit.toString())
      params.append("sortBy", sortBy)
      params.append("sortOrder", sortOrder)

      const response = await fetch(`/api/products?${params}`)
      const data: PaginatedResponse<Product> = await response.json()

      if (data.success && data.data) {
        setProducts(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.page, sortBy, sortOrder, fetchProducts])

  const handleFilterChange = (key: keyof ProductFilters, value: string | number | boolean | string[] | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const _handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortOrder("desc")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={filters.search || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.priceMin || ""}
                    onChange={(e) => handleFilterChange("priceMin", e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.priceMax || ""}
                    onChange={(e) => handleFilterChange("priceMax", e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
              </div>

              {/* In Stock */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock || false}
                    onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => setFilters({})}
                className="w-full"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Products</h1>
              <p className="text-muted-foreground">
                Showing {products.length} of {pagination.total} products
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-")
                    setSortBy(newSortBy)
                    setSortOrder(newSortOrder as "asc" | "desc")
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="createdAt-desc">Newest</option>
                  <option value="createdAt-asc">Oldest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 border rounded">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found</p>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
