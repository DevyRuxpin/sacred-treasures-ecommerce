"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cart"
import { WishlistButton } from "@/components/ui/wishlist-button"
import { ShoppingCart, Heart, Star, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SimilarProducts, FrequentlyBoughtTogether } from "@/components/recommendations/recommendation-section"
import { generateProductMetadata } from "@/lib/seo"
import { ProductStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  sku: string
  quantity: number
  images: string[]
  tags: string[]
  averageRating: number
  reviewCount: number
  category: {
    name: string
    slug: string
  }
  variants: Array<{
    id: string
    name: string
    value: string
    price?: number
    sku?: string
    quantity: number
    image?: string
  }>
  reviews: Array<{
    id: string
    rating: number
    title?: string
    comment?: string
    user: {
      name: string
      image?: string
    }
    createdAt: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/${params.slug}`)
    const data = await response.json()
    
    if (data.success && data.data) {
      return generateProductMetadata(data.data)
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  return {
    title: 'Product Not Found',
    description: 'The requested product could not be found.'
  }
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
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
      const variant = product.variants.find(v => v.id === selectedVariant)
      const finalPrice = variant?.price || product.price
      
      addItem({
        productId: product.id,
        variantId: selectedVariant || undefined,
        quantity,
        price: Number(finalPrice),
        name: product.name,
        image: product.images[0],
        variant: variant ? `${variant.name}: ${variant.value}` : undefined,
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 0)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg animate-pulse" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
            <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
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
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  const discountPercentage = product.comparePrice
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
    : 0

  const finalPrice = selectedVariant 
    ? Number(product.variants.find(v => v.id === selectedVariant)?.price || product.price)
    : Number(product.price)

  return (
    <>
      {/* Structured Data */}
      {product && (
        <>
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
        </>
      )}
      
      <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={product.images[selectedImage] || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/800x600/cccccc/666666?text=Image+Not+Available";
              }}
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/200x200/cccccc/666666?text=Image+Not+Available";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href={`/categories/${product.category.slug}`}
                className="text-sm text-primary hover:underline"
              >
                {product.category.name}
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.shortDescription}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.averageRating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              ${Number(finalPrice).toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${Number(product.comparePrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Options</h3>
              <div className="space-y-3">
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    <label className="text-sm font-medium">{variant.name}</label>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`px-3 py-2 border rounded-md text-sm ${
                          selectedVariant === variant.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {variant.value}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <div className="flex items-center gap-2 w-fit">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center"
                min="1"
                max={product.quantity}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.quantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {product.quantity} in stock
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
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
                price: product.price,
                image: product.images[0],
                slug: product.slug,
                category: product.category
              }}
              variant="outline"
              size="lg"
              showText={false}
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">SSL encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Description */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {product.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{product.category.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock</span>
                <span className="font-medium">{product.quantity}</span>
              </div>
              {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
                <div>
                  <span className="text-muted-foreground block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {review.user.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {review.user.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.title && (
                      <h4 className="font-medium mb-2">{review.title}</h4>
                    )}
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-16 space-y-12">
        <SimilarProducts productId={product.id} />
        <FrequentlyBoughtTogether productId={product.id} />
      </div>
    </div>
    </>
  )
}
