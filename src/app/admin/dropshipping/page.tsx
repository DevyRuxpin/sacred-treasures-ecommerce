"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Eye, 
  Package, 
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  Building
} from "lucide-react"
import Link from "next/link"

interface OrderForwarding {
  id: string
  orderId: string
  supplierId: string
  supplierOrderId: string
  status: string
  trackingNumber?: string
  forwardedAt: string
  updatedAt: string
  notes?: string
  order: {
    orderNumber: string
    status: string
  }
  supplier: {
    name: string
    contactPerson?: string
    email: string
  }
}

export default function AdminDropshippingOrders() {
  const [forwardingRecords, setForwardingRecords] = useState<OrderForwarding[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchForwardingRecords = async () => {
      setLoading(true)
      try {
        // In a real implementation, you would fetch from an API
        setTimeout(() => {
          setForwardingRecords([
            {
              id: "1",
              orderId: "order-1",
              supplierId: "supplier-1",
              supplierOrderId: "SUP-123456789",
              status: "FORWARDED",
              trackingNumber: "TRK-ABC123456",
              forwardedAt: "2024-01-15T10:30:00Z",
              updatedAt: "2024-01-15T10:30:00Z",
              notes: "Order forwarded successfully",
              order: {
                orderNumber: "ST-123456789",
                status: "PROCESSING",
              },
              supplier: {
                name: "Sacred Items Wholesale",
                contactPerson: "Ahmed Hassan",
                email: "orders@sacreditems.com",
              },
            },
            {
              id: "2",
              orderId: "order-2",
              supplierId: "supplier-2",
              supplierOrderId: "SUP-123456790",
              status: "SHIPPED",
              trackingNumber: "TRK-DEF789012",
              forwardedAt: "2024-01-15T09:15:00Z",
              updatedAt: "2024-01-15T14:20:00Z",
              notes: "Package shipped via FedEx",
              order: {
                orderNumber: "ST-123456790",
                status: "SHIPPED",
              },
              supplier: {
                name: "Dharma Supplies Co.",
                contactPerson: "Priya Patel",
                email: "sales@dharmasupplies.com",
              },
            },
            {
              id: "3",
              orderId: "order-3",
              supplierId: "supplier-1",
              supplierOrderId: "SUP-123456791",
              status: "DELIVERED",
              trackingNumber: "TRK-GHI345678",
              forwardedAt: "2024-01-14T08:45:00Z",
              updatedAt: "2024-01-16T16:30:00Z",
              notes: "Package delivered successfully",
              order: {
                orderNumber: "ST-123456791",
                status: "DELIVERED",
              },
              supplier: {
                name: "Sacred Items Wholesale",
                contactPerson: "Ahmed Hassan",
                email: "orders@sacreditems.com",
              },
            },
          ])
          setTotalPages(1)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching forwarding records:", error)
        setLoading(false)
      }
    }

    fetchForwardingRecords()
  }, [currentPage])

  const filteredRecords = forwardingRecords.filter((record) => {
    const matchesSearch = record.order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (record.trackingNumber && record.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = filterStatus === "all" ||
                         record.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "FORWARDED":
        return <Package className="h-4 w-4 text-blue-500" />
      case "SHIPPED":
        return <Truck className="h-4 w-4 text-green-500" />
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FORWARDED":
        return "bg-blue-100 text-blue-800"
      case "SHIPPED":
        return "bg-green-100 text-green-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleUpdateStatus = async (recordId: string, newStatus: string) => {
    // In a real implementation, you would call an API
    setForwardingRecords(forwardingRecords.map(record => 
      record.id === recordId ? { ...record, status: newStatus, updatedAt: new Date().toISOString() } : record
    ))
  }

  const handleRefreshStatus = async (recordId: string) => {
    // In a real implementation, you would call the supplier's API to get updated status
    console.log("Refreshing status for record:", recordId)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dropshipping Orders</h1>
            <p className="text-gray-600">Manage order forwarding to suppliers</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Dropshipping Orders</h1>
          <p className="text-gray-600">Manage order forwarding to suppliers</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Forwarded</p>
                <p className="text-2xl font-bold text-gray-900">{forwardingRecords.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">
                  {forwardingRecords.filter(r => r.status === "SHIPPED").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {forwardingRecords.filter(r => r.status === "DELIVERED").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {forwardingRecords.filter(r => r.status === "FORWARDED").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
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
                  placeholder="Search orders..."
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
                <option value="all">All Status</option>
                <option value="forwarded">Forwarded</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forwarding Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Forwarding Records ({filteredRecords.length})</CardTitle>
          <CardDescription>Track orders forwarded to suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order</th>
                  <th className="text-left py-3 px-4">Supplier</th>
                  <th className="text-left py-3 px-4">Supplier Order</th>
                  <th className="text-left py-3 px-4">Tracking</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Forwarded</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{record.order.orderNumber}</p>
                        <p className="text-sm text-gray-600">Order Status: {record.order.status}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{record.supplier.name}</p>
                          <p className="text-sm text-gray-600">{record.supplier.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {record.supplierOrderId}
                        </code>
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {record.trackingNumber ? (
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-blue-100 px-2 py-1 rounded text-blue-800">
                            {record.trackingNumber}
                          </code>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No tracking</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm">
                          {new Date(record.forwardedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(record.forwardedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/orders/${record.orderId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRefreshStatus(record.id)}
                          title="Refresh Status"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <select
                          value={record.status}
                          onChange={(e) => handleUpdateStatus(record.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="FORWARDED">Forwarded</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forwarding records found</h3>
              <p className="text-gray-600">
                {searchQuery ? "Try adjusting your search criteria" : "No orders have been forwarded to suppliers yet"}
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
