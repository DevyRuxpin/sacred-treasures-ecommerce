"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  sku: string
  quantity: number
  images: string[]
  isActive: boolean
  isFeatured: boolean
  category: {
    name: string
    slug: string
  }
  createdAt: string
  updatedAt: string
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // In a real implementation, you would fetch from an API
        setTimeout(() => {
          setProducts([
            {
              id: "1",
              name: "Premium Tasbih - 99 Beads",
              slug: "premium-tasbih-99-beads",
              price: 29.99,
              comparePrice: 39.99,
              sku: "TASB-99-001",
              quantity: 50,
              images: ["/images/products/tasbih-99-1.jpg"],
              isActive: true,
              isFeatured: true,
              category: { name: "Prayer Beads", slug: "prayer-beads" },
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
            },
            {
              id: "2",
              name: "Rudraksha Mala - 108 Beads",
              slug: "rudraksha-mala-108-beads",
              price: 45.99,
              comparePrice: 59.99,
              sku: "MALA-108-001",
              quantity: 3,
              images: ["/images/products/rudraksha-mala-1.jpg"],
              isActive: true,
              isFeatured: true,
              category: { name: "Mala Beads", slug: "mala-beads" },
              createdAt: "2024-01-02T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
            },
            {
              id: "3",
              name: "Crystal Tasbih - 33 Beads",
              slug: "crystal-tasbih-33-beads",
              price: 19.99,
              comparePrice: 24.99,
              sku: "TASB-33-001",
              quantity: 75,
              images: ["/images/products/crystal-tasbih-1.jpg"],
              isActive: true,
              isFeatured: false,
              category: { name: "Prayer Beads", slug: "prayer-beads" },
              createdAt: "2024-01-03T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
            },
          ])
          setTotalPages(1)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === "all" ||
                         (filterStatus === "active" && product.isActive) ||
                         (filterStatus === "inactive" && !product.isActive) ||
                         (filterStatus === "featured" && product.isFeatured) ||
                         (filterStatus === "low-stock" && product.quantity < 10)

    return matchesSearch && matchesFilter
  })

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // In a real implementation, you would call an API
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const handleToggleStatus = async (productId: string) => {
    // In a real implementation, you would call an API
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Products</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="featured">Featured</option>
                <option value="low-stock">Low Stock</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>Manage your product catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">SKU</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-muted rounded-md flex-shrink-0">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="rounded-md object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {product.sku}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{product.category.name}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">${product.price.toFixed(2)}</p>
                        {product.comparePrice && (
                          <p className="text-sm text-gray-500 line-through">
                            ${product.comparePrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={product.quantity < 10 ? "text-red-600 font-medium" : ""}>
                          {product.quantity}
                        </span>
                        {product.quantity < 10 && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {product.isFeatured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/products/${product.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleStatus(product.id)}
                        >
                          {product.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first product"}
              </p>
              <Button asChild>
                <Link href="/admin/products/new">Add Product</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
