"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cart"
import { WishlistButton } from "@/components/ui/wishlist-button"
import { ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SimilarProducts, FrequentlyBoughtTogether } from "@/components/recommendations/recommendation-section"
import { ProductStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  variants: Array<{
    id: string
    name: string
    value: string
    price: number
    quantity: number
  }>
  quantity: number
  averageRating: number
  reviewCount: number
  reviews: Array<{
    id: string
    rating: number
    comment: string
    user: {
      name: string
      image?: string
    }
    createdAt: string
  }>
}

export default function ProductClient() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.slug}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          setProduct(data.data)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  const handleAddToCart = async () => {
    if (!product) return
    
    setIsAddingToCart(true)
    try {
        addItem({
          productId: product.id,
          quantity,
          price: finalPrice,
          name: product.name,
          image: product.images?.[0] || "/images/placeholder.jpg",
          variant: selectedVariant ? product.variants.find(v => v.id === selectedVariant)?.name : undefined,
        })
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  const finalPrice = selectedVariant 
    ? Number(product.variants.find(v => v.id === selectedVariant)?.price || product.price)
    : Number(product.price)

  return (
    <>
      {/* Structured Data */}
      <ProductStructuredData 
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: finalPrice,
          images: product.images,
          category: product.category,
          slug: product.slug,
          averageRating: product.averageRating,
          reviewCount: product.reviewCount,
          availability: product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }}
      />
      <BreadcrumbStructuredData 
        items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: product.category.name, url: `/categories/${product.category.slug}` },
          { name: product.name, url: `/products/${product.slug}` }
        ]}
      />
      
      <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={product.images?.[selectedImageIndex] || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square relative overflow-hidden rounded-md border-2 ${
                    selectedImageIndex === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span className="mx-2">/</span>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-primary">
              {product.category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Category */}
          <Badge variant="outline">{product.category.name}</Badge>

          {/* Title */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            ${finalPrice.toFixed(2)}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Options</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedVariant === variant.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium">{variant.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {variant.value}
                    </div>
                    {variant.price !== product.price && (
                      <div className="text-sm font-semibold text-primary">
                        ${variant.price.toFixed(2)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-semibold">Quantity</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
            </p>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.quantity === 0}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            
            <WishlistButton
              product={{
                id: product.id,
                name: product.name,
                price: finalPrice,
                image: product.images?.[0] || "/images/placeholder.jpg",
                slug: product.slug,
                category: product.category
              }}
              variant="outline"
              size="lg"
              showText={false}
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Free Shipping</div>
                <div className="text-sm text-muted-foreground">On orders over $50</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Secure Payment</div>
                <div className="text-sm text-muted-foreground">100% secure checkout</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Easy Returns</div>
                <div className="text-sm text-muted-foreground">30-day return policy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        
        {product.reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {product.reviews.slice(0, 3).map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold">
                          {review.user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{review.user.name}</div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
            
            {product.reviews.length > 3 && (
              <Button variant="outline" className="w-full">
                View All {product.reviewCount} Reviews
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="mt-16 space-y-12">
        <SimilarProducts productId={product.id} />
        <FrequentlyBoughtTogether productId={product.id} />
      </div>
    </div>
    </>
  )
}
