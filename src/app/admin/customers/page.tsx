"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Eye, 
  Mail, 
  Phone,
  ShoppingCart,
  DollarSign
} from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string
  lastOrderDate?: string
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive"
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        // In a real implementation, you would fetch from an API
        setTimeout(() => {
          setCustomers([
            {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              phone: "+1 (555) 123-4567",
              createdAt: "2024-01-01T00:00:00Z",
              lastOrderDate: "2024-01-15T10:30:00Z",
              totalOrders: 5,
              totalSpent: 245.99,
              status: "active",
            },
            {
              id: "2",
              name: "Jane Smith",
              email: "jane@example.com",
              phone: "+1 (555) 234-5678",
              createdAt: "2024-01-02T00:00:00Z",
              lastOrderDate: "2024-01-14T09:15:00Z",
              totalOrders: 3,
              totalSpent: 156.50,
              status: "active",
            },
            {
              id: "3",
              name: "Ahmed Hassan",
              email: "ahmed@example.com",
              phone: "+1 (555) 345-6789",
              createdAt: "2024-01-03T00:00:00Z",
              lastOrderDate: "2024-01-13T08:45:00Z",
              totalOrders: 2,
              totalSpent: 89.99,
              status: "active",
            },
            {
              id: "4",
              name: "Priya Patel",
              email: "priya@example.com",
              createdAt: "2024-01-04T00:00:00Z",
              lastOrderDate: "2024-01-10T14:20:00Z",
              totalOrders: 1,
              totalSpent: 45.99,
              status: "inactive",
            },
          ])
          setTotalPages(1)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching customers:", error)
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [currentPage])

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (customer.phone && customer.phone.includes(searchQuery))
    
    const matchesFilter = filterStatus === "all" ||
                         customer.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleToggleStatus = async (customerId: string) => {
    // In a real implementation, you would call an API
    setCustomers(customers.map(customer => 
      customer.id === customerId 
        ? { ...customer, status: customer.status === "active" ? "inactive" : "active" }
        : customer
    ))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600">Manage customer accounts</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage customer accounts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.status === "active").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)).toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
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
                  placeholder="Search customers..."
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
                <option value="all">All Customers</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          <CardDescription>Manage customer accounts and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Orders</th>
                  <th className="text-left py-3 px-4">Total Spent</th>
                  <th className="text-left py-3 px-4">Last Order</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600">ID: {customer.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-sm">{customer.email}</p>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <p className="text-sm text-gray-600">{customer.phone}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{customer.totalOrders}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">${customer.totalSpent.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm">
                          {customer.lastOrderDate 
                            ? new Date(customer.lastOrderDate).toLocaleDateString()
                            : "No orders"
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          Member since {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/customers/${customer.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleStatus(customer.id)}
                        >
                          {customer.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">
                {searchQuery ? "Try adjusting your search criteria" : "No customers have registered yet"}
              </p>
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
