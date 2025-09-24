"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { 
  Star, 
  Shield, 
  Truck, 
  Heart, 
  Sparkles, 
  Award, 
  Users, 
  CheckCircle, 
  ArrowRight
} from "lucide-react"
import { TrendingProducts } from "@/components/recommendations/recommendation-section"

// Mock featured products data
const featuredProducts = [
  {
    id: "1",
    name: "Premium Amber Tasbih",
    price: 49.99,
    comparePrice: 69.99,
    image: "/images/products/tasbih-amber.jpg",
    rating: 4.8,
    reviewCount: 127,
    category: "Islamic",
    badge: "Best Seller"
  },
  {
    id: "2", 
    name: "Rudraksha Mala 108 Beads",
    price: 39.99,
    comparePrice: null,
    image: "/images/products/rudraksha-mala.jpg",
    rating: 4.9,
    reviewCount: 89,
    category: "Hindu",
    badge: "New"
  },
  {
    id: "3",
    name: "Wooden Cross Pendant",
    price: 24.99,
    comparePrice: 34.99,
    image: "/images/products/wooden-cross.jpg", 
    rating: 4.7,
    reviewCount: 116,
    category: "Christian",
    badge: "Premium"
  },
  {
    id: "4",
    name: "Buddha Meditation Bowl",
    price: 89.99,
    comparePrice: null,
    image: "/images/products/buddha-bowl.jpg",
    rating: 4.6,
    reviewCount: 43,
    category: "Buddhist",
    badge: "Featured"
  }
]

// Mock categories data
const categories = [
  {
    name: "Islamic",
    slug: "islamic",
    icon: "☪️",
    color: "bg-blue-500", 
    productCount: 8,
    description: "Prayer beads, rugs, and blessed artifacts"
  },
  {
    name: "Hindu",
    slug: "hindu",
    icon: "🕉️",
    color: "bg-orange-500",
    productCount: 6,
    description: "Mala beads, idols, and sacred items"
  },
  {
    name: "Christian",
    slug: "christian",
    icon: "✝️",
    color: "bg-purple-500",
    productCount: 5,
    description: "Crosses, rosaries, and prayer items"
  },
  {
    name: "Buddhist",
    slug: "buddhist",
    icon: "🧘",
    color: "bg-yellow-500",
    productCount: 4,
    description: "Meditation bowls and Buddha statues"
  },
  {
    name: "Sikh",
    slug: "sikh",
    icon: "🦁",
    color: "bg-amber-500", 
    productCount: 3,
    description: "Kirpans, karas, and Sikh artifacts"
  },
  {
    name: "Judaic",
    slug: "judaic",
    icon: "✡️",
    color: "bg-indigo-500",
    productCount: 2,
    description: "Mezuzahs, tallits, and Jewish items"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-16 lg:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium border border-amber-200">
                  <Sparkles className="h-4 w-4 mr-2" suppressHydrationWarning />
                  Authentic Religious Artifacts
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Sacred Treasures for Every Faith
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  Discover authentic religious artifacts, spiritual jewelry, and sacred items from Muslim, Hindu, Sikh, Christian, Buddhist, and Jewish traditions. Each piece is carefully sourced and blessed for your spiritual journey.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href="/products" className="flex items-center">
                      Shop All Products
                      <ArrowRight className="ml-2 h-5 w-5" suppressHydrationWarning />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="border-2 border-gray-300 hover:border-amber-600 hover:bg-amber-50 text-lg px-8 py-6 h-auto rounded-xl transition-all duration-300">
                    <Link href="/categories" className="flex items-center">
                      Browse Categories
                      <Award className="ml-2 h-5 w-5" suppressHydrationWarning />
                    </Link>
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" suppressHydrationWarning />
                    <span>10,000+ Happy Customers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" suppressHydrationWarning />
                    <span>50+ Countries Served</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" suppressHydrationWarning />
                    <span>Authentic & Blessed Items</span>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Featured Product */}
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 lg:p-12">
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-600 text-white text-sm font-medium mb-4">
                      <Star className="h-4 w-4 mr-1" suppressHydrationWarning />
                      Best Seller
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Amber Tasbih</h3>
                    <p className="text-gray-600 mb-4">Handcrafted prayer beads from authentic amber</p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} suppressHydrationWarning />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">(127 reviews)</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-6">
                      $49.99 <span className="text-lg text-gray-500 line-through">$69.99</span>
                    </div>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Shop by Religious Tradition
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover authentic artifacts and sacred items from diverse faith communities around the world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.slug} className="group border-2 border-gray-100 hover:border-amber-200 transition-all duration-300 hover:shadow-lg">
                  <div className="rounded-lg overflow-hidden">
                    <div className={`${category.color} p-6 text-center`}>
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-white/90 text-sm mb-3">{category.productCount} products</p>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                      <Button asChild className="w-full bg-gray-100 hover:bg-amber-600 hover:text-white text-gray-700 rounded-lg transition-all duration-300">
                        <Link href={`/categories/${category.slug}`} className="flex items-center justify-center font-medium">
                          Explore Collection
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" suppressHydrationWarning />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Handpicked sacred items chosen by our community of faithful believers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group border border-gray-200 hover:border-amber-200 transition-all duration-300 hover:shadow-lg">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                      <div className="text-4xl text-gray-400">📿</div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                        product.badge === 'Best Seller' ? 'bg-red-500' :
                        product.badge === 'New' ? 'bg-green-500' :
                        product.badge === 'Premium' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`}>
                        {product.badge}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-gray-50"
                    >
                      <Heart className="h-4 w-4" suppressHydrationWarning />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} suppressHydrationWarning />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">${product.price}</span>
                        {product.comparePrice && (
                          <span className="text-xs text-gray-500 line-through">${product.comparePrice}</span>
                        )}
                      </div>
                    </div>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all duration-300">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg" className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-4 rounded-xl transition-all duration-300">
                <Link href="/products" className="flex items-center">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" suppressHydrationWarning />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Sacred Treasures?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We are committed to providing authentic, blessed items that enhance your spiritual journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Star className="h-8 w-8 text-white" suppressHydrationWarning />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Authentic Quality</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Every item is carefully sourced and verified for authenticity by religious leaders.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Shield className="h-8 w-8 text-white" suppressHydrationWarning />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Blessed & Consecrated</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Many items are blessed by religious leaders for spiritual significance and protection.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Truck className="h-8 w-8 text-white" suppressHydrationWarning />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Fast & Secure</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Worldwide shipping with secure packaging for safe delivery of your sacred items.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Heart className="h-8 w-8 text-white" suppressHydrationWarning />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Community Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Join our community of faithful believers sharing their spiritual journey and experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-amber-600 to-orange-600">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Begin Your Sacred Journey Today
              </h2>
              <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
                Discover authentic spiritual treasures that connect you to your faith. Each item is carefully sourced and blessed to enhance your spiritual practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 group">
                  <Link href="/products" className="flex items-center font-semibold">
                    Explore Collections
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" suppressHydrationWarning />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-2 border-white hover:border-amber-400 hover:bg-amber-400 hover:text-gray-900 text-white text-lg px-8 py-4 h-auto rounded-xl transition-all duration-300 group">
                  <Link href="/support" className="flex items-center font-semibold">
                    Get Support
                    <Users className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" suppressHydrationWarning />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}