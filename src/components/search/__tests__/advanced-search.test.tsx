import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdvancedSearch } from '@/components/search/advanced-search'

// Mock fetch
global.fetch = jest.fn()

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('AdvancedSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders search input', () => {
    render(<AdvancedSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search products, categories/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('shows search suggestions when typing', async () => {
    const mockSuggestions = [
      { id: '1', name: 'Tasbih', type: 'product', slug: 'tasbih' },
      { id: '2', name: 'Prayer Beads', type: 'category', slug: 'prayer-beads' },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: true,
        data: mockSuggestions,
        suggestions: ['Tasbih', 'Prayer Beads'],
      }),
    })

    const user = userEvent.setup()
    render(<AdvancedSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search products, categories/i)
    await user.type(searchInput, 'tasbih')

    await waitFor(() => {
      expect(screen.getByText('Tasbih')).toBeInTheDocument()
      expect(screen.getByText('Prayer Beads')).toBeInTheDocument()
    })
  })

  it('handles suggestion clicks', async () => {
    const mockSuggestions = [
      { id: '1', name: 'Tasbih', type: 'product', slug: 'tasbih' },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: true,
        data: mockSuggestions,
      }),
    })

    const user = userEvent.setup()
    render(<AdvancedSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search products, categories/i)
    await user.type(searchInput, 'tasbih')

    await waitFor(() => {
      expect(screen.getByText('Tasbih')).toBeInTheDocument()
    })

    const suggestion = screen.getByText('Tasbih')
    await user.click(suggestion)

    // The router push would be called (tested in integration tests)
    expect(searchInput).toHaveValue('')
  })

  it('saves recent searches to localStorage', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search products, categories/i)
    await user.type(searchInput, 'test search')
    await user.keyboard('{Enter}')

    expect(localStorage.getItem('recentSearches')).toBe('["test search"]')
  })

  it('loads recent searches from localStorage', () => {
    localStorage.setItem('recentSearches', JSON.stringify(['recent search 1', 'recent search 2']))
    
    render(<AdvancedSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search products, categories/i)
    userEvent.click(searchInput)

    expect(screen.getByText('recent search 1')).toBeInTheDocument()
    expect(screen.getByText('recent search 2')).toBeInTheDocument()
  })

  it('shows trending searches', async () => {
    const mockTrendingData = {
      success: true,
      filters: {
        categories: [
          { name: 'Prayer Beads', slug: 'prayer-beads' },
          { name: 'Mala Beads', slug: 'mala-beads' },
        ],
        tags: ['tasbih', 'rudraksha'],
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockTrendingData),
    })

    render(<AdvancedSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search products, categories/i)
    userEvent.click(searchInput)

    await waitFor(() => {
      expect(screen.getByText(/trending/i)).toBeInTheDocument()
    })
  })

  it('handles search form submission', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search products, categories/i)
    await user.type(searchInput, 'test search')
    await user.keyboard('{Enter}')

    // The router push would be called (tested in integration tests)
    expect(searchInput).toHaveValue('')
  })

  it('clears search input when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search products, categories/i)
    await user.type(searchInput, 'test search')

    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)

    expect(searchInput).toHaveValue('')
  })

  it('handles API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    const user = userEvent.setup()
    render(<AdvancedSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search products, categories/i)
    await user.type(searchInput, 'test search')

    // Should not crash and should handle error silently
    await waitFor(() => {
      expect(searchInput).toBeInTheDocument()
    })
  })

  it('debounces search requests', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search products, categories/i)
    
    // Type multiple characters quickly
    await user.type(searchInput, 'tasbih', { delay: 50 })

    // Should only make one API call after debounce
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })
})
