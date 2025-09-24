import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CartSidebar } from '../cart-sidebar'
import { useCartStore } from '@/store/cart'

// Mock the cart store
jest.mock('@/store/cart')

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>

const mockCartItems = [
  {
    id: '1',
    productId: '1',
    quantity: 2,
    price: 29.99,
    name: 'Test Product 1',
    image: 'https://example.com/image1.jpg',
    variant: 'Red',
  },
  {
    id: '2',
    productId: '2',
    quantity: 1,
    price: 39.99,
    name: 'Test Product 2',
    image: 'https://example.com/image2.jpg',
  },
]

describe('CartSidebar', () => {
  const mockUpdateQuantity = jest.fn()
  const mockRemoveItem = jest.fn()
  const mockClearCart = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockUseCartStore.mockReturnValue({
      items: mockCartItems,
      getTotalItems: () => 3, // Total quantity
      getTotalPrice: () => 99.97, // Total price
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      addItem: jest.fn(),
    })

    jest.clearAllMocks()
  })

  it('renders cart header with correct total items', () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
    expect(screen.getByText('3 items')).toBeInTheDocument()
  })

  it('renders all cart items', () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
    expect(screen.getByText('Test Product 2')).toBeInTheDocument()
    expect(screen.getByText('Red')).toBeInTheDocument() // Variant
  })

  it('displays correct prices and quantities', () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('$39.99')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Quantity for first item
    expect(screen.getByText('1')).toBeInTheDocument() // Quantity for second item
  })

  it('shows empty cart message when no items', () => {
    mockUseCartStore.mockReturnValue({
      items: [],
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      addItem: jest.fn(),
    })

    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(screen.getByText("Looks like you haven't added any items yet.")).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls updateQuantity when quantity is changed', async () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    const quantityInput = screen.getAllByDisplayValue('2')[0] // First item quantity
    fireEvent.change(quantityInput, { target: { value: '3' } })

    await waitFor(() => {
      expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3)
    })
  })

  it('calls removeItem when remove button is clicked', async () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    fireEvent.click(removeButtons[0]) // Remove first item

    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith('1')
    })
  })

  it('calls clearCart when clear cart button is clicked', async () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    const clearButton = screen.getByText('Clear Cart')
    fireEvent.click(clearButton)

    await waitFor(() => {
      expect(mockClearCart).toHaveBeenCalledTimes(1)
    })
  })

  it('displays correct total price', () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('$99.97')).toBeInTheDocument() // Total price
  })

  it('shows checkout button with correct link', () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    const checkoutButton = screen.getByText('Checkout')
    expect(checkoutButton.closest('a')).toHaveAttribute('href', '/checkout')
  })

  it('shows view cart button with correct link', () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    const viewCartButton = screen.getByText('View Cart')
    expect(viewCartButton.closest('a')).toHaveAttribute('href', '/cart')
  })

  it('handles quantity validation', async () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    const quantityInput = screen.getAllByDisplayValue('2')[0]
    
    // Test invalid quantity (negative)
    fireEvent.change(quantityInput, { target: { value: '-1' } })
    await waitFor(() => {
      expect(mockUpdateQuantity).not.toHaveBeenCalledWith('1', -1)
    })

    // Test invalid quantity (zero)
    fireEvent.change(quantityInput, { target: { value: '0' } })
    await waitFor(() => {
      expect(mockUpdateQuantity).not.toHaveBeenCalledWith('1', 0)
    })

    // Test valid quantity
    fireEvent.change(quantityInput, { target: { value: '5' } })
    await waitFor(() => {
      expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 5)
    })
  })

  it('displays product images correctly', () => {
    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    const images = screen.getAllByAltText(/test product/i)
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg')
    expect(images[1]).toHaveAttribute('src', 'https://example.com/image2.jpg')
  })

  it('handles missing variant gracefully', () => {
    const itemsWithoutVariant = [
      {
        ...mockCartItems[0],
        variant: undefined,
      },
    ]

    mockUseCartStore.mockReturnValue({
      items: itemsWithoutVariant,
      getTotalItems: () => 2,
      getTotalPrice: () => 59.98,
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      addItem: jest.fn(),
    })

    render(<CartSidebar isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
    // Should not crash when variant is undefined
  })

  it('applies correct CSS classes for open/closed state', () => {
    const { rerender } = render(<CartSidebar isOpen={true} onClose={mockOnClose} />)
    
    let sidebar = screen.getByRole('dialog')
    expect(sidebar).toHaveClass('translate-x-0') // Open state

    rerender(<CartSidebar isOpen={false} onClose={mockOnClose} />)
    
    sidebar = screen.getByRole('dialog')
    expect(sidebar).toHaveClass('translate-x-full') // Closed state
  })
})
