import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartPage } from '@/app/cart/page'

// Mock the cart store
const mockCartStore = {
  items: [
    {
      id: '1',
      name: 'Premium Tasbih - 99 Beads',
      price: 29.99,
      quantity: 2,
      image: '/images/products/tasbih-99-1.jpg',
    },
    {
      id: '2',
      name: 'Crystal Tasbih - 33 Beads',
      price: 19.99,
      quantity: 1,
      image: '/images/products/crystal-tasbih-1.jpg',
    },
  ],
  getTotalItems: jest.fn(() => 3),
  getTotalPrice: jest.fn(() => 79.97),
  updateQuantity: jest.fn(),
  removeItem: jest.fn(),
  clearCart: jest.fn(),
}

jest.mock('@/store/cart', () => ({
  useCartStore: () => mockCartStore,
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('Cart Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays cart items correctly', () => {
    render(<CartPage />)
    
    expect(screen.getByText('Premium Tasbih - 99 Beads')).toBeInTheDocument()
    expect(screen.getByText('Crystal Tasbih - 33 Beads')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('$19.99')).toBeInTheDocument()
  })

  it('shows correct quantities', () => {
    render(<CartPage />)
    
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
  })

  it('displays total price correctly', () => {
    render(<CartPage />)
    
    expect(screen.getByText('$79.97')).toBeInTheDocument()
  })

  it('handles quantity updates', async () => {
    const user = userEvent.setup()
    render(<CartPage />)
    
    const quantityInput = screen.getByDisplayValue('2')
    await user.clear(quantityInput)
    await user.type(quantityInput, '3')
    
    expect(mockCartStore.updateQuantity).toHaveBeenCalledWith('1', 3)
  })

  it('handles item removal', async () => {
    const user = userEvent.setup()
    render(<CartPage />)
    
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    await user.click(removeButtons[0])
    
    expect(mockCartStore.removeItem).toHaveBeenCalledWith('1')
  })

  it('handles cart clearing', async () => {
    const user = userEvent.setup()
    render(<CartPage />)
    
    const clearButton = screen.getByRole('button', { name: /clear cart/i })
    await user.click(clearButton)
    
    expect(mockCartStore.clearCart).toHaveBeenCalled()
  })

  it('shows empty cart message when no items', () => {
    const emptyCartStore = {
      ...mockCartStore,
      items: [],
      getTotalItems: jest.fn(() => 0),
      getTotalPrice: jest.fn(() => 0),
    }

    jest.mocked(await import('@/store/cart').useCartStore).mockReturnValue(emptyCartStore)

    render(<CartPage />)
    
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument()
  })

  it('disables checkout button when cart is empty', () => {
    const emptyCartStore = {
      ...mockCartStore,
      items: [],
      getTotalItems: jest.fn(() => 0),
      getTotalPrice: jest.fn(() => 0),
    }

    jest.mocked(await import('@/store/cart').useCartStore).mockReturnValue(emptyCartStore)

    render(<CartPage />)
    
    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i })
    expect(checkoutButton).toBeDisabled()
  })

  it('enables checkout button when cart has items', () => {
    render(<CartPage />)
    
    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i })
    expect(checkoutButton).not.toBeDisabled()
  })
})
