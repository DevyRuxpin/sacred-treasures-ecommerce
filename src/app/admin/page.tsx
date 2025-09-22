"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  totalProducts: number
  productsChange: number
  totalCustomers: number
  customersChange: number
  recentOrders: Array<{
    id: string
    orderNumber: string
    customerName: string
    total: number
    status: string
    createdAt: string
  }>
  lowStockProducts: Array<{
    id: string
    name: string
    quantity: number
    sku: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // In a real implementation, you would fetch from an API
        // For now, we'll simulate the data
        setTimeout(() => {
          setStats({
            totalRevenue: 45678.90,
            revenueChange: 12.5,
            totalOrders: 1234,
            ordersChange: 8.2,
            totalProducts: 156,
            productsChange: 3.1,
            totalCustomers: 892,
            customersChange: 15.7,
            recentOrders: [
              {
                id: "1",
                orderNumber: "ST-123456789",
                customerName: "John Doe",
                total: 89.99,
                status: "CONFIRMED",
                createdAt: "2024-01-15T10:30:00Z",
              },
              {
                id: "2",
                orderNumber: "ST-123456790",
                customerName: "Jane Smith",
                total: 156.50,
                status: "SHIPPED",
                createdAt: "2024-01-15T09:15:00Z",
              },
              {
                id: "3",
                orderNumber: "ST-123456791",
                customerName: "Ahmed Hassan",
                total: 45.99,
                status: "PENDING",
                createdAt: "2024-01-15T08:45:00Z",
              },
            ],
            lowStockProducts: [
              {
                id: "1",
                name: "Premium Tasbih - 99 Beads",
                quantity: 3,
                sku: "TASB-99-001",
              },
              {
                id: "2",
                name: "Sikh Kirpan - Traditional",
                quantity: 1,
                sku: "KIRP-TRAD-001",
              },
            ],
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-8 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    )
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
  }: { 
    title: string
    value: string | number
    change: number
    icon: React.ComponentType<{ className?: string }>
    href: string
  }) => {
    const isPositive = change > 0
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <div className="flex items-center mt-1">
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}>
                  {Math.abs(change)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={stats.revenueChange}
          icon={DollarSign}
          href="/admin/analytics"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change={stats.ordersChange}
          icon={ShoppingCart}
          href="/admin/orders"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          change={stats.productsChange}
          icon={Package}
          href="/admin/products"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          change={stats.customersChange}
          icon={Users}
          href="/admin/customers"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <Badge 
                      variant={order.status === "CONFIRMED" ? "default" : 
                              order.status === "SHIPPED" ? "secondary" : "outline"}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Low Stock Alert</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/products?filter=low-stock">View All</Link>
              </Button>
            </div>
            <CardDescription>Products running low on inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">
                      {product.quantity} left
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-20 flex-col gap-2">
              <Link href="/admin/products/new">
                <Package className="h-6 w-6" />
                Add New Product
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col gap-2">
              <Link href="/admin/orders">
                <ShoppingCart className="h-6 w-6" />
                Manage Orders
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col gap-2">
              <Link href="/admin/analytics">
                <TrendingUp className="h-6 w-6" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
