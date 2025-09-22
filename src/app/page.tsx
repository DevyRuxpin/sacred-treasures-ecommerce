import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { Star, Shield, Truck, Heart, Sparkles, Award, Users } from "lucide-react"
import { TrendingProducts } from "@/components/recommendations/recommendation-section"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <Icon>
                  <Sparkles className="h-4 w-4 mr-2" />
                </Icon>
                Divine Collections for Every Faith
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gradient">Sacred Treasures</span>
                <br />
                <span className="text-foreground/90">Await Your Discovery</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover authentic religious artifacts, spiritual jewelry, and sacred items from Muslim, Hindu, and Sikh traditions. 
                Each piece tells a story of faith, devotion, and divine connection.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gradient-primary hover:shadow-strong text-lg px-8 py-6">
                  <Link href="/products">
                    Explore Collections
                    <Icon>
                      <Sparkles className="ml-2 h-5 w-5" />
                    </Icon>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="hover:shadow-medium text-lg px-8 py-6">
                  <Link href="/categories">
                    Browse Categories
                    <Icon>
                      <Award className="ml-2 h-5 w-5" />
                    </Icon>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Why Choose <span className="text-gradient">Sacred Treasures</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We&apos;re committed to providing authentic, high-quality religious items with exceptional service
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <Card className="text-center hover:shadow-medium transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-medium">
                    <Icon>
                      <Star className="h-8 w-8 text-primary-foreground" />
                    </Icon>
                  </div>
                  <CardTitle className="text-xl">Authentic Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Every item is carefully sourced and verified for authenticity, ensuring you receive genuine religious artifacts.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-medium transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mb-4 shadow-medium">
                    <Icon>
                      <Shield className="h-8 w-8 text-accent-foreground" />
                    </Icon>
                  </div>
                  <CardTitle className="text-xl">Blessed & Consecrated</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Many items are blessed by religious leaders, adding spiritual significance to your purchase.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-medium transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center mb-4 shadow-medium">
                    <Icon>
                      <Truck className="h-8 w-8 text-secondary-foreground" />
                    </Icon>
                  </div>
                  <CardTitle className="text-xl">Fast & Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Worldwide shipping with secure packaging to ensure your sacred items arrive safely and quickly.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-medium transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 shadow-medium">
                    <Icon>
                      <Heart className="h-8 w-8 text-white" />
                    </Icon>
                  </div>
                  <CardTitle className="text-xl">Community Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Join our community of faithful believers sharing their spiritual journey through sacred artifacts.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">10K+</div>
                <div className="text-muted-foreground font-medium">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">5K+</div>
                <div className="text-muted-foreground font-medium">Sacred Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">50+</div>
                <div className="text-muted-foreground font-medium">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">24/7</div>
                <div className="text-muted-foreground font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Shop by <span className="text-gradient">Religious Tradition</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our carefully organized collections for different faith communities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <Card className="overflow-hidden hover:shadow-medium transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white relative z-10">Muslim Items</h3>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Prayer beads, prayer mats, Quran holders, Islamic jewelry, and blessed artifacts for your spiritual journey.
                  </p>
                  <Button asChild className="w-full gradient-primary hover:shadow-strong">
                    <Link href="/categories/muslim">Explore Muslim Collection</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-medium transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white relative z-10">Hindu Items</h3>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Mala beads, sacred idols, incense, traditional jewelry, and consecrated items for devotion and worship.
                  </p>
                  <Button asChild className="w-full gradient-accent hover:shadow-strong">
                    <Link href="/categories/hindu">Explore Hindu Collection</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-medium transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white relative z-10">Sikh Items</h3>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Kirpans, turbans, prayer books, Sikh jewelry, and sacred artifacts honoring the Sikh tradition.
                  </p>
                  <Button asChild className="w-full gradient-secondary hover:shadow-strong">
                    <Link href="/categories/sikh">Explore Sikh Collection</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trending Products */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="text-gradient">Trending</span> Sacred Items
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover what our community is loving right now
              </p>
            </div>
            <TrendingProducts />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Begin Your <span className="text-gradient">Sacred Journey</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Join thousands of faithful believers who have found their perfect sacred items with us. 
                Start exploring our collections today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gradient-primary hover:shadow-strong text-lg px-8 py-6">
                  <Link href="/products">
                    Start Shopping
                    <Icon>
                      <Sparkles className="ml-2 h-5 w-5" />
                    </Icon>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="hover:shadow-medium text-lg px-8 py-6">
                  <Link href="/contact">
                    Contact Us
                    <Icon>
                      <Users className="ml-2 h-5 w-5" />
                    </Icon>
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