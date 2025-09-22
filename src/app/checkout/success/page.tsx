"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/store/cart"

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    price: number
    total: number
    product: {
      name: string
      slug: string
      images: string[]
    }
  }>
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    if (sessionId) {
      // Clear cart on successful payment
      clearCart()
      
      // In a real implementation, you would fetch order details using the session ID
      // For now, we&apos;ll simulate a successful order
      setTimeout(() => {
        setOrder({
          id: "order-123",
          orderNumber: `ST-${Date.now()}`,
          status: "CONFIRMED",
          total: 89.99,
          createdAt: new Date().toISOString(),
          items: [
            {
              id: "item-1",
              quantity: 1,
              price: 29.99,
              total: 29.99,
              product: {
                name: "Premium Tasbih - 99 Beads",
                slug: "premium-tasbih-99-beads",
                images: ["/images/products/tasbih-99-1.jpg"],
              },
            },
          ],
        })
        setLoading(false)
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [sessionId, clearCart])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find your order. Please contact support if you need assistance.
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Order #{order.orderNumber}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            ${order.total.toFixed(2)}
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary">{order.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What&apos;s Next */}
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
            <CardDescription>
              Here&apos;s what happens with your order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary">1</span>
              </div>
              <div>
                <h4 className="font-medium">Order Processing</h4>
                <p className="text-sm text-muted-foreground">
                  We&apos;re preparing your items for shipment
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-muted-foreground">2</span>
              </div>
              <div>
                <h4 className="font-medium">Shipping</h4>
                <p className="text-sm text-muted-foreground">
                  Your order will be shipped within 1-2 business days
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-muted-foreground">3</span>
              </div>
              <div>
                <h4 className="font-medium">Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Estimated delivery: 3-5 business days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="max-w-4xl mx-auto mb-12">
        <CardHeader>
          <CardTitle>Ordered Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="h-16 w-16 bg-muted rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Confirmation */}
      <Card className="max-w-4xl mx-auto mb-12">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-center">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">Email Confirmation Sent</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a confirmation email with your order details and tracking information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/products">
            Continue Shopping
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/dashboard/orders">View Order History</Link>
        </Button>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
