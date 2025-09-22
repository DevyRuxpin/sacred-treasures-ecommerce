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
  Building,
  RefreshCw,
  ExternalLink,
  Mail,
  Phone,
  MapPin
} from "lucide-react"
import Link from "next/link"

interface Supplier {
  id: string
  name: string
  email: string
  phone?: string
  contactPerson?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  website?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    products: number
  }
}

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true)
      try {
        // In a real implementation, you would fetch from an API
        setTimeout(() => {
          setSuppliers([
            {
              id: "1",
              name: "Sacred Items Wholesale",
              email: "orders@sacreditems.com",
              phone: "+1 (555) 123-4567",
              contactPerson: "Ahmed Hassan",
              address: "123 Religious Street",
              city: "New York",
              state: "NY",
              country: "USA",
              postalCode: "10001",
              website: "https://sacreditems.com",
              isActive: true,
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
              _count: { products: 25 },
            },
            {
              id: "2",
              name: "Dharma Supplies Co.",
              email: "sales@dharmasupplies.com",
              phone: "+1 (555) 234-5678",
              contactPerson: "Priya Patel",
              address: "456 Temple Avenue",
              city: "Los Angeles",
              state: "CA",
              country: "USA",
              postalCode: "90210",
              website: "https://dharmasupplies.com",
              isActive: true,
              createdAt: "2024-01-02T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
              _count: { products: 18 },
            },
            {
              id: "3",
              name: "Gurdwara Goods",
              email: "info@gurdwaragoods.com",
              phone: "+1 (555) 345-6789",
              contactPerson: "Singh Ji",
              address: "789 Sikh Street",
              city: "Toronto",
              state: "ON",
              country: "Canada",
              postalCode: "M5V 3A8",
              website: "https://gurdwaragoods.com",
              isActive: false,
              createdAt: "2024-01-03T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
              _count: { products: 12 },
            },
          ])
          setTotalPages(1)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching suppliers:", error)
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [currentPage])

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = filterStatus === "all" ||
                         (filterStatus === "active" && supplier.isActive) ||
                         (filterStatus === "inactive" && !supplier.isActive)

    return matchesSearch && matchesFilter
  })

  const handleSyncInventory = async (supplierId: string) => {
    try {
      // In a real implementation, you would call the sync API
      // Syncing inventory for supplier
      // Show success message
    } catch (error) {
      console.error("Error syncing inventory:", error)
    }
  }

  const handleDeleteSupplier = async (supplierId: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      // In a real implementation, you would call an API
      setSuppliers(suppliers.filter(s => s.id !== supplierId))
    }
  }

  const handleToggleStatus = async (supplierId: string) => {
    // In a real implementation, you would call an API
    setSuppliers(suppliers.map(s => 
      s.id === supplierId ? { ...s, isActive: !s.isActive } : s
    ))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-gray-600">Manage your dropshipping suppliers</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your dropshipping suppliers</p>
        </div>
        <Button asChild>
          <Link href="/admin/suppliers/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {suppliers.filter(s => s.isActive).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {suppliers.reduce((sum, s) => sum + s._count.products, 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Products/Supplier</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(suppliers.reduce((sum, s) => sum + s._count.products, 0) / suppliers.length)}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
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
                <option value="all">All Suppliers</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers ({filteredSuppliers.length})</CardTitle>
          <CardDescription>Manage your dropshipping suppliers and their products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Supplier</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Products</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          {supplier.website && (
                            <a 
                              href={supplier.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-sm">{supplier.email}</p>
                        </div>
                        {supplier.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <p className="text-sm text-gray-600">{supplier.phone}</p>
                          </div>
                        )}
                        {supplier.contactPerson && (
                          <p className="text-sm text-gray-600">{supplier.contactPerson}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm">
                            {supplier.city}, {supplier.state}
                          </p>
                          <p className="text-xs text-gray-500">{supplier.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-center">
                        <p className="font-medium">{supplier._count.products}</p>
                        <p className="text-xs text-gray-500">products</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={supplier.isActive ? "default" : "secondary"}>
                        {supplier.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/suppliers/${supplier.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/suppliers/${supplier.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSyncInventory(supplier.id)}
                          title="Sync Inventory"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleStatus(supplier.id)}
                        >
                          {supplier.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteSupplier(supplier.id)}
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

          {filteredSuppliers.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first supplier"}
              </p>
              <Button asChild>
                <Link href="/admin/suppliers/new">Add Supplier</Link>
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
