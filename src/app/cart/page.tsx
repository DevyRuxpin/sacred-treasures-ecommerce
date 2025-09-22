"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCartStore()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }
    
    setIsUpdating(id)
    try {
      updateQuantity(id, newQuantity)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Badge variant="secondary">{getTotalItems()} items</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.image || "/images/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground mb-2">{item.variant}</p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={isUpdating === item.id}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1
                            handleQuantityChange(item.id, newQuantity)
                          }}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isUpdating === item.id}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-lg font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {shipping > 0 && (
                <div className="text-sm text-muted-foreground text-center">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}
              
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </Link>
              </Button>
              
              <div className="text-xs text-muted-foreground text-center">
                <p>Secure checkout powered by Stripe</p>
                <p>SSL encrypted • 30-day returns</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
