"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { Search, X, TrendingUp, Clock } from "lucide-react"

interface SearchSuggestion {
  id: string
  name: string
  type: "product" | "category" | "tag"
  slug?: string
}

interface SearchFilters {
  categories: Array<{
    id: string
    name: string
    slug: string
    _count: { products: number }
  }>
  tags: string[]
  priceRange: {
    min: number
    max: number
  }
}

export function AdvancedSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [trendingSearches, setTrendingSearches] = useState<string[]>([])
  const [, setFilters] = useState<SearchFilters | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Load trending searches
  useEffect(() => {
    const loadTrendingSearches = async () => {
      try {
        const response = await fetch("/api/search?q=&limit=0")
        const data = await response.json()
        if (data.success && data.filters) {
          setFilters(data.filters)
          // Generate trending searches from popular categories and tags
          const trending = [
            ...data.filters.categories.slice(0, 3).map((cat: { name: string }) => cat.name),
            ...data.filters.tags.slice(0, 3),
          ]
          setTrendingSearches(trending)
        }
      } catch (error) {
        console.error("Error loading trending searches:", error)
      }
    }

    loadTrendingSearches()
  }, [])

  // Handle search input
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`)
      const data = await response.json()
      
      if (data.success) {
        const searchSuggestions: SearchSuggestion[] = []
        
        // Add product suggestions
        data.data.forEach((product: { id: string; name: string; category: { name: string } }) => {
          searchSuggestions.push({
            id: product.id,
            name: product.name,
            type: "product",
             slug: product.id,
          })
        })

        // Add category suggestions
        if (data.filters?.categories) {
          data.filters.categories.forEach((category: { name: string; slug: string }) => {
            if (category.name.toLowerCase().includes(searchQuery.toLowerCase())) {
              searchSuggestions.push({
                id: category.slug,
                name: category.name,
                type: "category",
                slug: category.slug,
              })
            }
          })
        }

        // Add tag suggestions
        if (data.filters?.tags) {
          data.filters.tags.forEach((tag: string) => {
            if (tag.toLowerCase().includes(searchQuery.toLowerCase())) {
              searchSuggestions.push({
                id: tag,
                name: tag,
                type: "tag",
              })
            }
          })
        }

        setSuggestions(searchSuggestions.slice(0, 8))
      }
    } catch (error) {
      console.error("Error fetching search suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query)
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "product") {
      router.push(`/products/${suggestion.slug}`)
    } else if (suggestion.type === "category") {
      router.push(`/categories/${suggestion.slug}`)
    } else if (suggestion.type === "tag") {
      router.push(`/products?tags=${suggestion.name}`)
    }
    
    // Add to recent searches
    const newRecentSearches = [suggestion.name, ...recentSearches.filter(s => s !== suggestion.name)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))
    
    setIsOpen(false)
    setQuery("")
  }

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
      
      // Add to recent searches
      const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
      setRecentSearches(newRecentSearches)
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))
      
      setIsOpen(false)
      setQuery("")
    }
  }

  // Handle clear search
  const handleClear = () => {
    setQuery("")
    setSuggestions([])
    inputRef.current?.focus()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Icon>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </Icon>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, categories..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Suggestions
                </div>
                {suggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-3"
                  >
                    <Icon>
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </Icon>
                    <div className="flex-1">
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {suggestion.type}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.type}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-muted-foreground">
                No results found for &quot;{query}&quot;
              </div>
            ) : (
              <div className="py-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Recent Searches
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search)
                          handleSearch(search)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-3"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Trending Searches */}
                {trendingSearches.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <TrendingUp className="h-3 w-3" />
                      Trending
                    </div>
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search)
                          handleSearch(search)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-3"
                      >
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}