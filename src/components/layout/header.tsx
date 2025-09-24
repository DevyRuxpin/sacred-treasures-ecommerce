"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ShoppingCart, 
  User, 
  Menu, 
  Heart, 
  Sparkles, 
  ChevronDown,
  Search,
  X,
  UserCircle,
  LogOut,
  Settings,
  Package,
  Truck,
  Shield
} from "lucide-react"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { AdvancedSearch } from "@/components/search/advanced-search"
import { CartSidebar } from "@/components/cart/cart-sidebar"

const categories = [
  {
    name: "Islamic",
    slug: "islamic",
    icon: "🕌",
    subcategories: [
      { name: "Prayer Beads (Tasbih)", slug: "tasbih" },
      { name: "Prayer Mats", slug: "prayer-mats" },
      { name: "Quran Holders", slug: "quran-holders" },
      { name: "Islamic Jewelry", slug: "islamic-jewelry" },
      { name: "Misbaha", slug: "misbaha" }
    ]
  },
  {
    name: "Hindu",
    slug: "hindu", 
    icon: "🕉️",
    subcategories: [
      { name: "Mala Beads", slug: "mala-beads" },
      { name: "Sacred Idols", slug: "sacred-idols" },
      { name: "Incense & Aarti", slug: "incense-aarti" },
      { name: "Traditional Jewelry", slug: "traditional-jewelry" },
      { name: "Puja Items", slug: "puja-items" }
    ]
  },
  {
    name: "Christian",
    slug: "christian",
    icon: "✝️", 
    subcategories: [
      { name: "Crosses & Crucifixes", slug: "crosses-crucifixes" },
      { name: "Rosaries", slug: "rosaries" },
      { name: "Prayer Candles", slug: "prayer-candles" },
      { name: "Christian Jewelry", slug: "christian-jewelry" },
      { name: "Bibles & Books", slug: "bibles-books" }
    ]
  },
  {
    name: "Buddhist",
    slug: "buddhist",
    icon: "☸️",
    subcategories: [
      { name: "Bodhi Mala", slug: "bodhi-mala" },
      { name: "Buddha Statues", slug: "buddha-statues" },
      { name: "Meditation Bowls", slug: "meditation-bowls" },
      { name: "Prayer Wheels", slug: "prayer-wheels" },
      { name: "Tibetan Items", slug: "tibetan-items" }
    ]
  },
  {
    name: "Sikh",
    slug: "sikh",
    icon: "🦁",
    subcategories: [
      { name: "Kirpans", slug: "kirpans" },
      { name: "Karas", slug: "karas" },
      { name: "Turbans", slug: "turbans" },
      { name: "Sikh Jewelry", slug: "sikh-jewelry" },
      { name: "Prayer Books", slug: "prayer-books" }
    ]
  },
  {
    name: "Judaic",
    slug: "judaic",
    icon: "✡️",
    subcategories: [
      { name: "Mezuzahs", slug: "mezuzahs" },
      { name: "Tallits", slug: "tallits" },
      { name: "Kippahs", slug: "kippahs" },
      { name: "Jewish Jewelry", slug: "jewish-jewelry" },
      { name: "Torah Items", slug: "torah-items" }
    ]
  }
]

export function Header() {
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const getWishlistItems = useWishlistStore((state) => state.getTotalItems)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-xl">
        {/* Top Bar */}
        <div className="bg-amber-600 text-white py-2">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" suppressHydrationWarning />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <Shield className="h-4 w-4" suppressHydrationWarning />
                  <span>Secure checkout</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/support" className="hover:underline">Support</Link>
                <Link href="/blog" className="hover:underline">Blog</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 flex items-center justify-center shadow-md">
                <Sparkles className="h-4 w-4 text-white" suppressHydrationWarning />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Sacred Treasures</span>
              </div>
            </Link>

            {/* Desktop Navigation with Dropdowns */}
            <nav className="hidden lg:flex items-center space-x-8">
              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredCategory('categories')}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Button variant="ghost" className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors duration-200">
                  <span>Categories</span>
                  <ChevronDown className="h-4 w-4" suppressHydrationWarning />
                </Button>
                
                {hoveredCategory === 'categories' && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50">
                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((category) => (
                        <div key={category.slug} className="space-y-2">
                          <Link 
                            href={`/categories/${category.slug}`}
                            className="flex items-center space-x-2 text-sm font-semibold text-gray-900 hover:text-yellow-600 transition-colors"
                          >
                            <span className="text-lg">{category.icon}</span>
                            <span>{category.name}</span>
                          </Link>
                          <div className="space-y-1 ml-6">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/categories/${category.slug}/${sub.slug}`}
                                className="block text-xs text-gray-600 hover:text-yellow-600 transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Other Navigation Links */}
              <Link 
                href="/products" 
                className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors duration-200"
              >
                All Products
              </Link>
              <Link 
                href="/deals" 
                className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors duration-200"
              >
                Deals
              </Link>
              <Link 
                href="/new-arrivals" 
                className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors duration-200"
              >
                New Arrivals
              </Link>
              <Link 
                href="/about" 
                className="text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors duration-200"
              >
                About
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <AdvancedSearch />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200 relative" asChild>
                <Link href="/wishlist">
                  <Heart className="h-4 w-4" suppressHydrationWarning />
                  {getWishlistItems() > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">
                      {getWishlistItems()}
                    </span>
                  )}
                </Link>
              </Button>

              {/* User Menu */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden sm:flex hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-4 w-4" suppressHydrationWarning />
                </Button>
                
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                    <div className="space-y-1">
                      <Link href="/auth/login" className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-amber-50 rounded-md transition-colors">
                        <UserCircle className="h-4 w-4" suppressHydrationWarning />
                        <span>Sign In</span>
                      </Link>
                      <Link href="/auth/register" className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-amber-50 rounded-md transition-colors">
                        <UserCircle className="h-4 w-4" suppressHydrationWarning />
                        <span>Create Account</span>
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <Link href="/dashboard" className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-amber-50 rounded-md transition-colors">
                        <Package className="h-4 w-4" suppressHydrationWarning />
                        <span>My Orders</span>
                      </Link>
                      <Link href="/wishlist" className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-amber-50 rounded-md transition-colors">
                        <Heart className="h-4 w-4" suppressHydrationWarning />
                        <span>Wishlist</span>
                      </Link>
                      <Link href="/settings" className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-amber-50 rounded-md transition-colors">
                        <Settings className="h-4 w-4" suppressHydrationWarning />
                        <span>Settings</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" suppressHydrationWarning />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" suppressHydrationWarning /> : <Menu className="h-4 w-4" suppressHydrationWarning />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <AdvancedSearch />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
              <div className="space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  <Link 
                    href="/products" 
                    className="block py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    All Products
                  </Link>
                  <Link 
                    href="/categories" 
                    className="block py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  <Link 
                    href="/deals" 
                    className="block py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Deals
                  </Link>
                  <Link 
                    href="/new-arrivals" 
                    className="block py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    New Arrivals
                  </Link>
                  <Link 
                    href="/about" 
                    className="block py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </div>

                {/* Mobile Categories */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="flex items-center space-x-2 py-2 px-3 text-sm text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}