export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  name: string
  image?: string
  variant?: string
}

export interface ProductFilters {
  category?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  inStock?: boolean
  tags?: string[]
  search?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ProductVariant {
  name: string
  value: string
  price?: number
  sku?: string
  quantity: number
  image?: string
}

export interface ProductDimensions {
  length?: number
  width?: number
  height?: number
}

export interface PrismaWhereClause {
  isActive?: boolean
  category?: {
    slug: string
  }
  price?: {
    gte?: number
    lte?: number
  }
  quantity?: {
    gt: number
  }
  tags?: {
    contains: string
    mode?: 'insensitive'
  }
  OR?: Array<{
    name?: { contains: string; mode: "insensitive" }
    description?: { contains: string; mode: "insensitive" }
    tags?: { contains: string; mode?: 'insensitive' }
  }>
}

export interface PrismaOrderBy {
  [key: string]: 'asc' | 'desc'
}

export interface PrismaOrderByComplex {
  reviews?: {
    _count?: 'asc' | 'desc'
    rating?: 'asc' | 'desc'
  }
  isFeatured?: 'asc' | 'desc'
  createdAt?: 'asc' | 'desc'
  name?: 'asc' | 'desc'
  price?: 'asc' | 'desc'
}
