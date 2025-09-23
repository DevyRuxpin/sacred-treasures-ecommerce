"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RatingStars, ReviewStats } from "./rating-stars"
import { MessageSquare, Filter, SortAsc, SortDesc, ChevronDown } from "lucide-react"
import Image from "next/image"

interface Review {
  id: string
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
  user: {
    name: string
    image?: string
  }
  createdAt: string
}

interface ReviewListProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  className?: string
}

type SortOption = "newest" | "oldest" | "highest" | "lowest" | "helpful"
type FilterOption = "all" | "5" | "4" | "3" | "2" | "1"

export function ReviewList({ reviews, averageRating, totalReviews, className }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
    return { rating, count, percentage }
  })

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => filterBy === "all" || review.rating.toString() === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        default:
          return 0
      }
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={className}>
      {/* Review Stats */}
      <div className="mb-8">
        <ReviewStats
          averageRating={averageRating}
          totalReviews={totalReviews}
          ratingDistribution={ratingDistribution}
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter by Rating
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
          
          {showFilters && (
            <div className="absolute z-10 mt-1 bg-background border rounded-md shadow-lg p-2">
              <div className="flex gap-1">
                {(["all", "5", "4", "3", "2", "1"] as FilterOption[]).map((filter) => (
                  <Button
                    key={filter}
                    variant={filterBy === filter ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterBy(filter)}
                    className="text-xs"
                  >
                    {filter === "all" ? "All" : `${filter} stars`}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1 border border-input bg-background rounded-md text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-muted-foreground">
          Showing {filteredReviews.length} of {totalReviews} reviews
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                {filterBy === "all" 
                  ? "Be the first to review this product!" 
                  : `No ${filterBy}-star reviews found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {review.user.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {review.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{review.user.name}</h4>
                      {review.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {review.title && (
                      <h5 className="font-medium text-sm mb-2">{review.title}</h5>
                    )}

                    {review.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More Button (if needed) */}
      {filteredReviews.length >= 10 && (
        <div className="text-center mt-8">
          <Button variant="outline">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  )
}
