import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { Star, Shield, Truck, Heart, Sparkles, Award, Users, CheckCircle, ArrowRight } from "lucide-react"
import { TrendingProducts } from "@/components/recommendations/recommendation-section"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Modern & Clean */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <div className="container mx-auto px-4 py-20 lg:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
                <Icon>
                  <Sparkles className="h-4 w-4 mr-2" />
                </Icon>
                Authentic Religious Artifacts
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
                <span className="text-gradient">Sacred Treasures</span>
                <br />
                <span className="text-slate-900">for Every Faith</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover authentic religious artifacts, spiritual jewelry, and sacred items from Muslim, Hindu, Sikh, Christian, Buddhist, and Jewish traditions. 
                Each piece is carefully sourced and blessed for your spiritual journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/products" className="flex items-center">
                    Shop Collections
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-2 border-slate-300 hover:border-primary hover:bg-primary/5 text-lg px-8 py-6 h-auto rounded-xl transition-all duration-300">
                  <Link href="/categories" className="flex items-center">
                    Browse Categories
                    <Award className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>10,000+ Happy Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>50+ Countries Served</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Authentic & Blessed Items</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Modern */}
        <section className="py-24 lg:py-32 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100/30 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.7))] -z-10" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-slate-900 leading-tight">
                Why Choose <span className="text-gradient">Sacred Treasures</span>?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                We&apos;re committed to providing authentic, high-quality religious items with exceptional service and spiritual significance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <div className="text-center group">
                <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Icon>
                    <Star className="h-12 w-12 text-white" />
                  </Icon>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Authentic Quality</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every item is carefully sourced and verified for authenticity, ensuring you receive genuine religious artifacts.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Icon>
                    <Shield className="h-12 w-12 text-white" />
                  </Icon>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Blessed & Consecrated</h3>
                <p className="text-slate-600 leading-relaxed">
                  Many items are blessed by religious leaders, adding spiritual significance to your purchase.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Icon>
                    <Truck className="h-12 w-12 text-white" />
                  </Icon>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Fast & Secure</h3>
                <p className="text-slate-600 leading-relaxed">
                  Worldwide shipping with secure packaging to ensure your sacred items arrive safely and quickly.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Icon>
                    <Heart className="h-12 w-12 text-white" />
                  </Icon>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Community Support</h3>
                <p className="text-slate-600 leading-relaxed">
                  Join our community of faithful believers sharing their spiritual journey through sacred artifacts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators - Subtle */}
        <section className="py-12 lg:py-16 bg-white/50 backdrop-blur-sm border-y border-slate-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors duration-300">10K+</div>
                <div className="text-sm text-slate-500 font-medium">Happy Customers</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors duration-300">5K+</div>
                <div className="text-sm text-slate-500 font-medium">Sacred Items</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors duration-300">50+</div>
                <div className="text-sm text-slate-500 font-medium">Countries Served</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors duration-300">24/7</div>
                <div className="text-sm text-slate-500 font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Modern & Streamlined */}
        <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-slate-900 leading-tight">
                Shop by <span className="text-gradient">Religious Tradition</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Discover authentic artifacts and sacred items from diverse faith communities around the world
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Muslim Collection */}
              <Card className="group border-0 shadow-soft hover:shadow-strong transition-all duration-500 hover-lift bg-white/80 backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.3))]"></div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white relative z-10">Muslim</h3>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-slate-600 mb-8 leading-relaxed text-base">
                    Prayer beads, prayer mats, Quran holders, Islamic jewelry, and blessed artifacts for your spiritual journey.
                  </p>
                  <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Link href="/categories/muslim" className="flex items-center justify-center font-medium">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Hindu Collection */}
              <Card className="group border-0 shadow-soft hover:shadow-strong transition-all duration-500 hover-lift bg-white/80 backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20"></div>
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.3))]"></div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white relative z-10">Hindu</h3>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-slate-600 mb-8 leading-relaxed text-base">
                    Mala beads, sacred idols, incense, traditional jewelry, and consecrated items for devotion and worship.
                  </p>
                  <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Link href="/categories/hindu" className="flex items-center justify-center font-medium">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Sikh Collection */}
              <Card className="group border-0 shadow-soft hover:shadow-strong transition-all duration-500 hover-lift bg-white/80 backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.3))]"></div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white relative z-10">Sikh</h3>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-slate-600 mb-8 leading-relaxed text-base">
                    Kirpans, turbans, prayer books, Sikh jewelry, and sacred artifacts honoring the Sikh tradition.
                  </p>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Link href="/categories/sikh" className="flex items-center justify-center font-medium">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trending Products - Modern */}
        <section className="py-24 lg:py-32 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))] -z-10" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-slate-900 leading-tight">
                <span className="text-gradient">Trending</span> Sacred Items
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Discover the most beloved spiritual artifacts chosen by our community of faithful believers
              </p>
            </div>
            <TrendingProducts />
          </div>
        </section>

        {/* CTA Section - Streamlined */}
        <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-white leading-tight">
                Begin Your <span className="text-gradient">Sacred Journey</span> Today
              </h2>
              <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                Discover authentic spiritual treasures that connect you to your faith. 
                Each item is carefully sourced and blessed to enhance your spiritual practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white text-lg px-12 py-6 h-auto rounded-2xl shadow-2xl hover:shadow-strong transition-all duration-300 group">
                  <Link href="/products" className="flex items-center font-semibold">
                    Explore Collections
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-2 border-white/30 hover:border-white/50 hover:bg-white/10 text-white text-lg px-12 py-6 h-auto rounded-2xl transition-all duration-300 group backdrop-blur-sm">
                  <Link href="/contact" className="flex items-center font-semibold">
                    Get Support
                    <Users className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
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