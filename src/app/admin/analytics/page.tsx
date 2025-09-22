"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Download,
  RefreshCw
} from "lucide-react"

interface AnalyticsData {
  revenue: {
    total: number
    change: number
    monthly: Array<{ month: string; amount: number }>
  }
  orders: {
    total: number
    change: number
    monthly: Array<{ month: string; count: number }>
  }
  customers: {
    total: number
    change: number
    monthly: Array<{ month: string; count: number }>
  }
  products: {
    total: number
    change: number
    topSelling: Array<{ name: string; sales: number; revenue: number }>
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        // In a real implementation, you would fetch from an API
        setTimeout(() => {
          setData({
            revenue: {
              total: 45678.90,
              change: 12.5,
              monthly: [
                { month: "Jan", amount: 12000 },
                { month: "Feb", amount: 15000 },
                { month: "Mar", amount: 18000 },
                { month: "Apr", amount: 22000 },
                { month: "May", amount: 25000 },
                { month: "Jun", amount: 28000 },
              ],
            },
            orders: {
              total: 1234,
              change: 8.2,
              monthly: [
                { month: "Jan", count: 200 },
                { month: "Feb", count: 250 },
                { month: "Mar", count: 300 },
                { month: "Apr", count: 350 },
                { month: "May", count: 400 },
                { month: "Jun", count: 450 },
              ],
            },
            customers: {
              total: 892,
              change: 15.7,
              monthly: [
                { month: "Jan", count: 150 },
                { month: "Feb", count: 180 },
                { month: "Mar", count: 220 },
                { month: "Apr", count: 260 },
                { month: "May", count: 300 },
                { month: "Jun", count: 350 },
              ],
            },
            products: {
              total: 156,
              change: 3.1,
              topSelling: [
                { name: "Premium Tasbih - 99 Beads", sales: 45, revenue: 1349.55 },
                { name: "Rudraksha Mala - 108 Beads", sales: 38, revenue: 1747.62 },
                { name: "Crystal Tasbih - 33 Beads", sales: 52, revenue: 1039.48 },
                { name: "Sandalwood Mala - 108 Beads", sales: 29, revenue: 1043.71 },
                { name: "Sikh Kirpan - Traditional", sales: 15, revenue: 899.85 },
              ],
            },
            recentActivity: [
              {
                id: "1",
                type: "order",
                description: "New order #ST-123456789 from John Doe",
                timestamp: "2024-01-15T10:30:00Z",
              },
              {
                id: "2",
                type: "product",
                description: "Product 'Premium Tasbih' stock updated",
                timestamp: "2024-01-15T09:15:00Z",
              },
              {
                id: "3",
                type: "customer",
                description: "New customer registration: Jane Smith",
                timestamp: "2024-01-15T08:45:00Z",
              },
              {
                id: "4",
                type: "order",
                description: "Order #ST-123456790 shipped",
                timestamp: "2024-01-15T08:30:00Z",
              },
            ],
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend 
  }: { 
    title: string
    value: string | number
    change: number
    icon: React.ComponentType<{ className?: string }>
    trend: "up" | "down"
  }) => {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <div className="flex items-center mt-1">
                {trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  trend === "up" ? "text-green-600" : "text-red-600"
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Business insights and performance metrics</p>
          </div>
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

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${data.revenue.total.toLocaleString()}`}
          change={data.revenue.change}
          icon={DollarSign}
          trend={data.revenue.change > 0 ? "up" : "down"}
        />
        <StatCard
          title="Total Orders"
          value={data.orders.total.toLocaleString()}
          change={data.orders.change}
          icon={ShoppingCart}
          trend={data.orders.change > 0 ? "up" : "down"}
        />
        <StatCard
          title="Total Customers"
          value={data.customers.total.toLocaleString()}
          change={data.customers.change}
          icon={Users}
          trend={data.customers.change > 0 ? "up" : "down"}
        />
        <StatCard
          title="Total Products"
          value={data.products.total.toLocaleString()}
          change={data.products.change}
          icon={Package}
          trend={data.products.change > 0 ? "up" : "down"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.products.topSelling.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {activity.type === "order" && <ShoppingCart className="h-4 w-4 text-blue-500" />}
                    {activity.type === "product" && <Package className="h-4 w-4 text-green-500" />}
                    {activity.type === "customer" && <Users className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400">Integration with Chart.js or similar library</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(data.revenue.total / data.orders.total).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orders per Customer</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(data.orders.total / data.customers.total).toFixed(1)}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">3.2%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
