"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  showValue?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export function RatingStars({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  interactive = false, 
  showValue = false,
  onChange,
  className 
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const [tempRating, setTempRating] = useState(rating)

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  }

  const handleClick = (starRating: number) => {
    if (!interactive) return
    setTempRating(starRating)
    onChange?.(starRating)
  }

  const handleMouseEnter = (starRating: number) => {
    if (!interactive) return
    setHoverRating(starRating)
  }

  const handleMouseLeave = () => {
    if (!interactive) return
    setHoverRating(0)
  }

  const displayRating = hoverRating || tempRating

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starRating = index + 1
          const isFilled = starRating <= displayRating
          const isHalfFilled = starRating - 0.5 <= displayRating && starRating > displayRating
          
          return (
            <button
              key={index}
              type="button"
              className={cn(
                "transition-colors duration-150",
                interactive && "cursor-pointer hover:scale-110",
                !interactive && "cursor-default"
              )}
              onClick={() => handleClick(starRating)}
              onMouseEnter={() => handleMouseEnter(starRating)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled && "text-yellow-400 fill-current",
                  isHalfFilled && "text-yellow-400 fill-current opacity-50",
                  !isFilled && !isHalfFilled && "text-gray-300"
                )}
              />
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground ml-2">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

// Review statistics component
interface ReviewStatsProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: Array<{
    rating: number
    count: number
    percentage: number
  }>
  className?: string
}

export function ReviewStats({ 
  averageRating, 
  totalReviews, 
  ratingDistribution,
  className 
}: ReviewStatsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall Rating */}
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {averageRating.toFixed(1)}
        </div>
        <RatingStars rating={averageRating} size="lg" />
        <div className="text-sm text-muted-foreground mt-2">
          Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {ratingDistribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium w-6">{rating}</span>
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground w-8 text-right">
              {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
