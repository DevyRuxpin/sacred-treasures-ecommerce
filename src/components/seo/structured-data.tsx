"use client"

import { generateProductStructuredData, generateOrganizationStructuredData, generateBreadcrumbStructuredData, generateWebsiteStructuredData, generateBlogPostStructuredData } from "@/lib/seo"

interface StructuredDataProps {
  type: "product" | "organization" | "breadcrumb" | "website" | "blog-post"
  data: Record<string, unknown>
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData: Record<string, unknown>

  switch (type) {
    case "product":
      structuredData = generateProductStructuredData(data)
      break
    case "organization":
      structuredData = generateOrganizationStructuredData()
      break
    case "breadcrumb":
      structuredData = generateBreadcrumbStructuredData(data)
      break
    case "website":
      structuredData = generateWebsiteStructuredData()
      break
    case "blog-post":
      structuredData = generateBlogPostStructuredData(data)
      break
    default:
      return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

// Product structured data component
interface ProductStructuredDataProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    category: { name: string }
    slug: string
    averageRating?: number
    reviewCount?: number
    availability?: string
  }
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  return <StructuredData type="product" data={product} />
}

// Breadcrumb structured data component
interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  return <StructuredData type="breadcrumb" data={items} />
}

// Organization structured data component
export function OrganizationStructuredData() {
  return <StructuredData type="organization" data={null} />
}

// Website structured data component
export function WebsiteStructuredData() {
  return <StructuredData type="website" data={null} />
}

// Blog post structured data component
interface BlogPostStructuredDataProps {
  post: {
    id: string
    title: string
    excerpt?: string
    content: string
    featuredImage?: string
    publishedAt?: string
    author: { name: string }
    tags: string[]
    slug: string
    readTime?: number
  }
}

export function BlogPostStructuredData({ post }: BlogPostStructuredDataProps) {
  return <StructuredData type="blog-post" data={post} />
}
