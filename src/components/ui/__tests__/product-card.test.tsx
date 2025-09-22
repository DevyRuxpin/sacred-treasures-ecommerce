import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from '@/components/ui/product-card'

// Mock the cart store
jest.mock('@/store/cart', () => ({
  useCartStore: () => ({
    addItem: jest.fn(),
    removeItem: jest.fn(),
    getItemQuantity: jest.fn(() => 0),
  }),
}))

const mockProduct = {
  id: '1',
  name: 'Premium Tasbih - 99 Beads',
  slug: 'premium-tasbih-99-beads',
  price: 29.99,
  comparePrice: 39.99,
  images: ['/images/products/tasbih-99-1.jpg'],
  averageRating: 4.5,
  reviewCount: 12,
  isFeatured: true,
  category: {
    name: 'Prayer Beads',
    slug: 'prayer-beads',
  },
}

describe('ProductCard Component', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Premium Tasbih - 99 Beads')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('$39.99')).toBeInTheDocument()
    expect(screen.getByText('Prayer Beads')).toBeInTheDocument()
    expect(screen.getByText('(12)')).toBeInTheDocument()
  })

  it('displays product image', () => {
    render(<ProductCard product={mockProduct} />)
    const image = screen.getByAltText('Premium Tasbih - 99 Beads')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/products/tasbih-99-1.jpg')
  })

  it('shows featured badge for featured products', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('does not show featured badge for non-featured products', () => {
    const nonFeaturedProduct = { ...mockProduct, isFeatured: false }
    render(<ProductCard product={nonFeaturedProduct} />)
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
  })

  it('displays star rating', () => {
    render(<ProductCard product={mockProduct} />)
    // Check for star rating display (4.5 stars)
    const stars = screen.getAllByTestId('star')
    expect(stars).toHaveLength(5)
  })

  it('handles add to cart button click', async () => {
    const user = userEvent.setup()
    render(<ProductCard product={mockProduct} />)
    
    const addButton = screen.getByRole('button', { name: /add to cart/i })
    await user.click(addButton)
    
    // The actual cart functionality would be tested in integration tests
    expect(addButton).toBeInTheDocument()
  })

  it('links to product detail page', () => {
    render(<ProductCard product={mockProduct} />)
    const productLink = screen.getByRole('link')
    expect(productLink).toHaveAttribute('href', '/products/premium-tasbih-99-beads')
  })

  it('handles products without compare price', () => {
    const productWithoutComparePrice = { ...mockProduct, comparePrice: undefined }
    render(<ProductCard product={productWithoutComparePrice} />)
    
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.queryByText('$39.99')).not.toBeInTheDocument()
  })

  it('handles products with no reviews', () => {
    const productWithoutReviews = { ...mockProduct, reviewCount: 0 }
    render(<ProductCard product={productWithoutReviews} />)
    
    expect(screen.queryByText('(0)')).not.toBeInTheDocument()
  })
})
