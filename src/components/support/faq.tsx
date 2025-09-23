"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Search, HelpCircle, ThumbsUp, ThumbsDown, Eye } from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  viewCount: number
  helpfulCount: number
  notHelpfulCount: number
}

interface FAQProps {
  className?: string
}

export function FAQ({ className }: FAQProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set())

  const fetchFAQs = async (category?: string, search?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.append("category", category)
      if (search) params.append("search", search)

      const response = await fetch(`/api/support/faq?${params}`)
      const data = await response.json()

      if (data.success) {
        setFaqs(data.data.faqs)
        setCategories(data.data.categories)
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFAQs()
  }, [])

  const handleSearch = () => {
    fetchFAQs(selectedCategory, searchTerm)
  }

  const handleCategoryFilter = (category: string) => {
    const newCategory = selectedCategory === category ? null : category
    setSelectedCategory(newCategory)
    fetchFAQs(newCategory, searchTerm)
  }

  const toggleExpanded = (faqId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId)
    } else {
      newExpanded.add(faqId)
      // Track view
      trackFAQView(faqId)
    }
    setExpandedItems(newExpanded)
  }

  const trackFAQView = async (faqId: string) => {
    try {
      await fetch("/api/support/faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "view",
          faqId
        })
      })
    } catch (error) {
      console.error("Error tracking FAQ view:", error)
    }
  }

  const handleFeedback = async (faqId: string, helpful: boolean) => {
    if (feedbackGiven.has(faqId)) return

    try {
      await fetch("/api/support/faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "feedback",
          faqId,
          helpful
        })
      })

      setFeedbackGiven(prev => new Set([...prev, faqId]))
      
      // Update local state
      setFaqs(prev => prev.map(faq => 
        faq.id === faqId 
          ? {
              ...faq,
              helpfulCount: helpful ? faq.helpfulCount + 1 : faq.helpfulCount,
              notHelpfulCount: !helpful ? faq.notHelpfulCount + 1 : faq.notHelpfulCount
            }
          : faq
      ))
    } catch (error) {
      console.error("Error submitting feedback:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading FAQs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm font-medium text-muted-foreground mr-2">Categories:</span>
            {categories.map((category) => (
              <Badge
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCategoryFilter(category.name)}
              >
                {category.name} ({category.count})
              </Badge>
            ))}
            {selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategoryFilter("")}
              >
                Clear Filter
              </Button>
            )}
          </div>
        )}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No FAQs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or browse different categories.
              </p>
            </CardContent>
          </Card>
        ) : (
          faqs.map((faq) => (
            <Card key={faq.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleExpanded(faq.id)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg pr-8">
                    {faq.question}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {faq.category}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      {expandedItems.has(faq.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedItems.has(faq.id) && (
                <CardContent className="pt-0">
                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="whitespace-pre-wrap">{faq.answer}</p>
                  </div>

                  {/* Tags */}
                  {faq.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {faq.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Feedback */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {faq.viewCount} views
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {faq.helpfulCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" />
                        {faq.notHelpfulCount}
                      </div>
                    </div>

                    {!feedbackGiven.has(faq.id) && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(faq.id, true)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(faq.id, false)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Not Helpful
                        </Button>
                      </div>
                    )}

                    {feedbackGiven.has(faq.id) && (
                      <Badge variant="secondary" className="text-xs">
                        Thank you for your feedback!
                      </Badge>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
