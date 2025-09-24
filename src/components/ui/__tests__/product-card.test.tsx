import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductCard } from '../product-card'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'

// Mock the stores
jest.mock('@/store/cart')
jest.mock('@/store/wishlist')

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>
const mockUseWishlistStore = useWishlistStore as jest.MockedFunction<typeof useWishlistStore>

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

const mockProduct = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  price: 29.99,
  comparePrice: 39.99,
  images: ['https://example.com/image.jpg'],
  averageRating: 4.5,
  reviewCount: 10,
  category: {
    name: 'Test Category',
    slug: 'test-category',
  },
  isFeatured: true,
}

describe('ProductCard', () => {
  const mockAddItem = jest.fn()
  const mockToggleItem = jest.fn()

  beforeEach(() => {
    mockUseCartStore.mockReturnValue({
      addItem: mockAddItem,
      items: [],
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
    })

    mockUseWishlistStore.mockReturnValue({
      addItem: jest.fn(),
      removeItem: jest.fn(),
      isInWishlist: jest.fn(() => false),
      toggleItem: mockToggleItem,
      items: [],
      getTotalItems: () => 0,
      clearWishlist: jest.fn(),
    })

    jest.clearAllMocks()
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('$39.99')).toBeInTheDocument() // Compare price
    expect(screen.getByText('Test Category')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument() // Rating
    expect(screen.getByText('(10)')).toBeInTheDocument() // Review count
  })

  it('displays product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />)

    const image = screen.getByAltText('Test Product')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('shows sale badge when compare price is higher', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Sale')).toBeInTheDocument()
  })

  it('shows featured badge when product is featured', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('calls addItem when add to cart button is clicked', async () => {
    render(<ProductCard product={mockProduct} />)

    const addToCartButton = screen.getByText('Add to Cart')
    fireEvent.click(addToCartButton)

    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith({
        productId: '1',
        quantity: 1,
        price: 29.99,
        name: 'Test Product',
        image: 'https://example.com/image.jpg',
      })
    })
  })

  it('calls toggleItem when wishlist button is clicked', async () => {
    render(<ProductCard product={mockProduct} />)

    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i })
    fireEvent.click(wishlistButton)

    await waitFor(() => {
      expect(mockToggleItem).toHaveBeenCalledWith({
        id: '1',
        name: 'Test Product',
        price: 29.99,
        image: 'https://example.com/image.jpg',
        slug: 'test-product',
        category: {
          name: 'Test Category',
          slug: 'test-category',
        },
      })
    })
  })

  it('handles missing images gracefully', () => {
    const productWithoutImages = {
      ...mockProduct,
      images: [],
    }

    render(<ProductCard product={productWithoutImages} />)

    const image = screen.getByAltText('Test Product')
    expect(image).toHaveAttribute('src', '/images/placeholder.jpg')
  })

  it('handles undefined images gracefully', () => {
    const productWithUndefinedImages = {
      ...mockProduct,
      images: undefined as any,
    }

    render(<ProductCard product={productWithUndefinedImages} />)

    const image = screen.getByAltText('Test Product')
    expect(image).toHaveAttribute('src', '/images/placeholder.jpg')
  })

  it('displays correct link to product page', () => {
    render(<ProductCard product={mockProduct} />)

    const productLink = screen.getByRole('link', { name: /test product/i })
    expect(productLink).toHaveAttribute('href', '/products/test-product')
  })

  it('shows loading state when adding to cart', async () => {
    mockUseCartStore.mockReturnValue({
      addItem: jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))),
      items: [],
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
    })

    render(<ProductCard product={mockProduct} />)

    const addToCartButton = screen.getByText('Add to Cart')
    fireEvent.click(addToCartButton)

    expect(screen.getByText('Adding...')).toBeInTheDocument()
  })

  it('displays wishlist button with correct state', () => {
    mockUseWishlistStore.mockReturnValue({
      addItem: jest.fn(),
      removeItem: jest.fn(),
      isInWishlist: jest.fn(() => true), // Item is in wishlist
      toggleItem: mockToggleItem,
      items: [],
      getTotalItems: () => 1,
      clearWishlist: jest.fn(),
    })

    render(<ProductCard product={mockProduct} />)

    const wishlistButton = screen.getByRole('button', { name: /remove from wishlist/i })
    expect(wishlistButton).toBeInTheDocument()
  })

  it('handles zero review count', () => {
    const productWithNoReviews = {
      ...mockProduct,
      reviewCount: 0,
      averageRating: 0,
    }

    render(<ProductCard product={productWithNoReviews} />)

    expect(screen.getByText('0.0')).toBeInTheDocument()
    expect(screen.getByText('(0)')).toBeInTheDocument()
  })

  it('handles missing category', () => {
    const productWithoutCategory = {
      ...mockProduct,
      category: undefined,
    }

    render(<ProductCard product={productWithoutCategory} />)

    // Should not crash and still render other elements
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })
})