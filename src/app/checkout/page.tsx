"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Lock, Truck, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  })
  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  })
  const [sameAsShipping, setSameAsShipping] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = async () => {
    if (items.length === 0) return

    setLoading(true)
    try {
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingAddress,
          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        }),
      })

      const data = await response.json()

      if (data.success && data.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.data.url
      } else {
        console.error("Failed to create checkout session:", data.error)
      }
    } catch (error) {
      console.error("Error during checkout:", error)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link href="/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <Input
                    value={shippingAddress.firstName}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <Input
                    value={shippingAddress.lastName}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Address</label>
                <Input
                  value={shippingAddress.address1}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, address1: e.target.value }))}
                  placeholder="Street address"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Apartment, suite, etc. (optional)</label>
                <Input
                  value={shippingAddress.address2}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, address2: e.target.value }))}
                  placeholder="Apartment, suite, etc."
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Input
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">State</label>
                  <Input
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">ZIP Code</label>
                  <Input
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, zip: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
              <CardDescription>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Same as shipping address</span>
                </label>
              </CardDescription>
            </CardHeader>
            {!sameAsShipping && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">First Name</label>
                    <Input
                      value={billingAddress.firstName}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Name</label>
                    <Input
                      value={billingAddress.lastName}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Address</label>
                  <Input
                    value={billingAddress.address1}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, address1: e.target.value }))}
                    placeholder="Street address"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">City</label>
                    <Input
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">State</label>
                    <Input
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">ZIP Code</label>
                    <Input
                      value={billingAddress.zip}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, zip: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.image || "/images/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">{item.variant}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <Badge variant="secondary">Free</Badge>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Credit/Debit Cards</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>•</span>
                  <span>Klarna (Pay in 4)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>•</span>
                  <span>Afterpay</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-3 w-3" />
                  <span>30-day returns</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Processing..." : "Complete Order"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By completing your purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
