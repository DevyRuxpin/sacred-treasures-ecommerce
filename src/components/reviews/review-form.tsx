"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RatingStars } from "./rating-stars"
import { useToastStore } from "@/components/ui/toast"
import { Star, MessageSquare, User } from "lucide-react"

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000, "Comment must be less than 1000 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  productId: string
  productName: string
  onSubmit: (data: ReviewFormData) => Promise<void>
  className?: string
}

export function ReviewForm({ productId, productName, onSubmit, className }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error } = useToastStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
      name: "",
      email: "",
    },
    mode: "onChange"
  })

  const currentRating = watch("rating")

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating, { shouldValidate: true })
  }

  const handleFormSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      success("Review submitted successfully", "Thank you for your feedback!")
      reset()
    } catch (err) {
      console.error("Error submitting review:", err)
      error("Failed to submit review", "Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Write a Review
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your experience with {productName}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating *</label>
            <RatingStars
              rating={currentRating}
              interactive
              showValue
              onChange={handleRatingChange}
            />
            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Review Title *
            </label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Summarize your experience"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Your Review *
            </label>
            <textarea
              id="comment"
              {...register("comment")}
              rows={4}
              placeholder="Tell others about your experience with this product..."
              className={`w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.comment ? "border-red-500" : ""
              }`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Share details about your experience</span>
              <span>{watch("comment")?.length || 0}/1000</span>
            </div>
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment.message}</p>
            )}
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Your Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your name"
                  className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="your.email@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full"
            size="lg"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {isSubmitting ? "Submitting Review..." : "Submit Review"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your review will be published after moderation. We reserve the right to edit or remove reviews that violate our guidelines.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
