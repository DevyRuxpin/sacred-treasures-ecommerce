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
} from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  customerName: string
  customerEmail: string
  createdAt: string
  items: Array<{
    id: string
    productName: string
    quantity: number
    price: number
  }>
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        // In a real implementation, you would fetch from an API
        setTimeout(() => {
          setOrders([
            {
              id: "1",
              orderNumber: "ST-123456789",
              status: "CONFIRMED",
              paymentStatus: "PAID",
              total: 89.99,
              customerName: "John Doe",
              customerEmail: "john@example.com",
              createdAt: "2024-01-15T10:30:00Z",
              items: [
                {
                  id: "1",
                  productName: "Premium Tasbih - 99 Beads",
                  quantity: 1,
                  price: 29.99,
                },
                {
                  id: "2",
                  productName: "Crystal Tasbih - 33 Beads",
                  quantity: 2,
                  price: 19.99,
                },
              ],
            },
            {
              id: "2",
              orderNumber: "ST-123456790",
              status: "SHIPPED",
              paymentStatus: "PAID",
              total: 156.50,
              customerName: "Jane Smith",
              customerEmail: "jane@example.com",
              createdAt: "2024-01-15T09:15:00Z",
              items: [
                {
                  id: "3",
                  productName: "Rudraksha Mala - 108 Beads",
                  quantity: 1,
                  price: 45.99,
                },
              ],
            },
            {
              id: "3",
              orderNumber: "ST-123456791",
              status: "PENDING",
              paymentStatus: "PENDING",
              total: 45.99,
              customerName: "Ahmed Hassan",
              customerEmail: "ahmed@example.com",
              createdAt: "2024-01-15T08:45:00Z",
              items: [
                {
                  id: "4",
                  productName: "Sandalwood Mala - 108 Beads",
                  quantity: 1,
                  price: 35.99,
                },
              ],
            },
          ])
          setTotalPages(1)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentPage])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === "all" ||
                         order.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "SHIPPED":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "SHIPPED":
        return "bg-blue-100 text-blue-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    // In a real implementation, you would call an API
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600">Manage customer orders</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
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
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>Manage customer orders and fulfillment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Items</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Payment</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">#{order.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.items.length} items</p>
                        <p className="text-sm text-gray-600">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} total
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
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

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchQuery ? "Try adjusting your search criteria" : "No orders have been placed yet"}
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
