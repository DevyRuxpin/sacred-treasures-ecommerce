"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Heart } from "lucide-react"
import { useWishlistStore } from "@/store/wishlist"

interface WishlistButtonProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    slug: string
    category?: {
      name: string
      slug: string
    }
  }
  variant?: "default" | "icon" | "outline"
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function WishlistButton({ 
  product, 
  variant = "default", 
  size = "sm", 
  showText = true,
  className 
}: WishlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addItem, removeItem, isInWishlist } = useWishlistStore()
  
  const inWishlist = isInWishlist(product.id)
  
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      if (inWishlist) {
        removeItem(product.id)
      } else {
        addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug,
          category: product.category,
        })
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isLoading}
        className={`hover:bg-primary/10 hover:text-primary transition-colors duration-200 ${className}`}
      >
        <Icon>
          <Heart 
            className={`h-4 w-4 transition-colors duration-200 ${
              inWishlist ? "fill-current text-red-500" : ""
            }`} 
          />
        </Icon>
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={`transition-colors duration-200 ${
        inWishlist ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : ""
      } ${className}`}
    >
      <Icon>
        <Heart 
          className={`h-4 w-4 mr-2 transition-colors duration-200 ${
            inWishlist ? "fill-current text-red-500" : ""
          }`} 
        />
      </Icon>
      {showText && (
        <span>
          {isLoading 
            ? "Loading..." 
            : inWishlist 
              ? "In Wishlist" 
              : "Add to Wishlist"
          }
        </span>
      )}
    </Button>
  )
}
