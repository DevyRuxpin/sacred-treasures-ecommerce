import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { Facebook, Instagram, Twitter, Mail, Heart, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-muted/50 to-muted/30 border-t border-border/40">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-medium">
                <Icon>
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </Icon>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gradient">Sacred Treasures</h3>
                <p className="text-xs text-muted-foreground">Divine Collections</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Connecting faithful believers with authentic religious artifacts and sacred items 
              from Muslim, Hindu, and Sikh traditions worldwide.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="#" 
                className="h-10 w-10 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center hover:scale-110"
              >
                <Icon>
                  <Facebook className="h-5 w-5" />
                </Icon>
              </Link>
              <Link 
                href="#" 
                className="h-10 w-10 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center hover:scale-110"
              >
                <Icon>
                  <Instagram className="h-5 w-5" />
                </Icon>
              </Link>
              <Link 
                href="#" 
                className="h-10 w-10 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center hover:scale-110"
              >
                <Icon>
                  <Twitter className="h-5 w-5" />
                </Icon>
              </Link>
              <Link 
                href="#" 
                className="h-10 w-10 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center hover:scale-110"
              >
                <Icon>
                  <Mail className="h-5 w-5" />
                </Icon>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Religious Collections */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Collections</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/categories/muslim" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Muslim Items
                </Link>
              </li>
              <li>
                <Link href="/categories/hindu" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Hindu Items
                </Link>
              </li>
              <li>
                <Link href="/categories/sikh" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Sikh Items
                </Link>
              </li>
              <li>
                <Link href="/categories/jewelry" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Spiritual Jewelry
                </Link>
              </li>
              <li>
                <Link href="/categories/books" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Sacred Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/40 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-muted-foreground mb-4 md:mb-0">
              <Icon>
                <Heart className="h-4 w-4 text-primary" />
              </Icon>
              <span className="text-sm">
                Made with devotion for the faithful community
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Sacred Treasures. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}