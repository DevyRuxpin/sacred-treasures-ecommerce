"use client"

import { useState } from "react"
import { useWishlistStore } from "@/store/wishlist"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WishlistButton } from "@/components/ui/wishlist-button"
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, getTotalItems } = useWishlistStore()
  const { addItem } = useCartStore()
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null)

  const handleAddToCart = async (item: any) => {
    setIsAddingToCart(item.productId)
    try {
      addItem({
        productId: item.productId,
        quantity: 1,
        price: item.price,
        name: item.name,
        image: item.image,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAddingToCart(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added any items to your wishlist yet.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Start Shopping</Link>
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
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <Badge variant="secondary">{getTotalItems()} items</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="group overflow-hidden hover:shadow-medium transition-all duration-300">
            <div className="relative">
              <Link href={`/products/${item.slug}`}>
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={item.image || "/images/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/800x600/cccccc/666666?text=Image+Not+Available";
                    }}
                  />
                </div>
              </Link>
              
              {/* Wishlist Button */}
              <div className="absolute top-3 right-3">
                <WishlistButton 
                  product={{
                    id: item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    slug: item.slug,
                    category: item.category
                  }}
                  variant="icon"
                  className="bg-white/90 hover:bg-white shadow-medium"
                />
              </div>

              {/* Category Badge */}
              {item.category && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-medium text-xs">
                    {item.category.name}
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors duration-200">
                <Link href={`/products/${item.slug}`}>
                  {item.name}
                </Link>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Price */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold text-gradient">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              {/* Added Date */}
              <div className="text-xs text-muted-foreground mb-4">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={() => handleAddToCart(item)}
                  disabled={isAddingToCart === item.productId}
                  className="w-full gradient-primary hover:shadow-strong"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isAddingToCart === item.productId ? "Adding..." : "Add to Cart"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => removeItem(item.productId)}
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {items.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={clearWishlist}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Wishlist
          </Button>
        </div>
      )}
    </div>
  )
}
