"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { ShoppingCart, User, Menu, Heart, Sparkles } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"
import { AdvancedSearch } from "@/components/search/advanced-search"
import { CartSidebar } from "@/components/cart/cart-sidebar"

export function Header() {
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const getWishlistItems = useWishlistStore((state) => state.getTotalItems)
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-medium">
              <Icon>
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </Icon>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-gradient">Sacred Treasures</span>
            </div>
          </Link>

          {/* Search - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <AdvancedSearch />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 shrink-0">
            <Link 
              href="/products" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              Products
            </Link>
            <Link 
              href="/categories" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              Categories
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-primary/10 hover:text-primary transition-colors duration-200 relative" asChild>
              <Link href="/wishlist">
                <Icon>
                  <Heart className="h-4 w-4" />
                </Icon>
                {getWishlistItems() > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full gradient-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {getWishlistItems()}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-primary/10 hover:text-primary transition-colors duration-200">
              <Icon>
                <User className="h-4 w-4" />
              </Icon>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              onClick={() => setIsCartOpen(true)}
            >
              <Icon>
                <ShoppingCart className="h-4 w-4" />
              </Icon>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full gradient-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10 hover:text-primary transition-colors duration-200">
              <Icon>
                <Menu className="h-4 w-4" />
              </Icon>
            </Button>
          </div>
        </div>

        {/* Mobile Search - Shown only on mobile */}
        <div className="md:hidden pb-4">
          <AdvancedSearch />
        </div>
      </div>
    </header>
    
    <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}