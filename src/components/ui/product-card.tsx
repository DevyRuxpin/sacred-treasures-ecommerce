import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cart"
import { ShoppingCart, Heart, Star, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number
    images: string[]
    averageRating?: number
    reviewCount?: number
    isFeatured?: boolean
    category?: {
      name: string
      slug: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)
    try {
      addItem({
        productId: product.id,
        quantity: 1,
        price: Number(product.price),
        name: product.name,
        image: product.images[0],
      })
    } finally {
      setIsLoading(false)
    }
  }

  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <Card className="group overflow-hidden hover:shadow-medium transition-all duration-300 h-full flex flex-col">
      <div className="relative">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={product.images[0] || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/800x600/cccccc/666666?text=Image+Not+Available";
              }}
            />
            
            {/* Overlay with actions - only show on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-medium"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-medium"
                >
                  <Heart className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-medium"
                >
                  <Eye className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>

            {/* Badges - positioned to avoid overlap */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isFeatured && (
                <Badge className="gradient-primary text-primary-foreground border-0 shadow-medium text-xs">
                  Featured
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="gradient-accent text-accent-foreground border-0 shadow-medium text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
          </div>
        </Link>
      </div>

      <CardHeader className="pb-3 flex-shrink-0">
        {/* Category */}
        {product.category && (
          <div className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
            {product.category.name}
          </div>
        )}
        
        {/* Product Name */}
        <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors duration-200">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 flex-grow flex flex-col">
        {/* Rating */}
        {product.averageRating && (
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.averageRating || 0)
                      ? "text-primary fill-current"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl font-bold text-gradient">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${Number(product.comparePrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full gradient-primary hover:shadow-strong mt-auto"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  )
}