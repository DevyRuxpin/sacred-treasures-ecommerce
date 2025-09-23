"use client"

import { generateProductStructuredData, generateOrganizationStructuredData, generateBreadcrumbStructuredData, generateWebsiteStructuredData } from "@/lib/seo"

interface StructuredDataProps {
  type: "product" | "organization" | "breadcrumb" | "website"
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData: any

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
