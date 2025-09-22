import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'
import { useToastStore } from '@/components/ui/toast'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        )
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
          // Show toast for quantity update
          useToastStore.getState().success(
            "Item quantity updated",
            `${item.name} quantity increased to ${existingItem.quantity + item.quantity}`
          )
        } else {
          set({
            items: [...items, { ...item, id: crypto.randomUUID() }],
          })
          // Show toast for new item
          useToastStore.getState().success(
            "Added to cart",
            `${item.name} has been added to your cart`
          )
        }
      },
      
      removeItem: (id) => {
        const items = get().items
        const itemToRemove = items.find(item => item.id === id)
        set({ items: items.filter((item) => item.id !== id) })
        
        // Show toast for item removal
        if (itemToRemove) {
          useToastStore.getState().warning(
            "Item removed",
            `${itemToRemove.name} has been removed from your cart`
          )
        }
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },
      
      clearCart: () => {
        const itemCount = get().items.length
        set({ items: [] })
        
        // Show toast for cart clearing
        if (itemCount > 0) {
          useToastStore.getState().info(
            "Cart cleared",
            `${itemCount} items have been removed from your cart`
          )
        }
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
