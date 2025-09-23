import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useToastStore } from '@/components/ui/toast'

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  slug: string
  category?: {
    name: string
    slug: string
  }
  addedAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  getTotalItems: () => number
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(i => i.productId === item.productId)
        
        if (existingItem) {
          // Item already in wishlist
          useToastStore.getState().info(
            "Already in wishlist",
            `${item.name} is already in your wishlist`
          )
          return
        }
        
        const newItem: WishlistItem = {
          ...item,
          id: crypto.randomUUID(),
          addedAt: new Date().toISOString(),
        }
        
        set({ items: [...items, newItem] })
        
        // Show success toast
        useToastStore.getState().success(
          "Added to wishlist",
          `${item.name} has been added to your wishlist`
        )
      },
      
      removeItem: (productId) => {
        const items = get().items
        const itemToRemove = items.find(item => item.productId === productId)
        set({ items: items.filter(item => item.productId !== productId) })
        
        // Show toast for item removal
        if (itemToRemove) {
          useToastStore.getState().warning(
            "Removed from wishlist",
            `${itemToRemove.name} has been removed from your wishlist`
          )
        }
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId)
      },
      
      getTotalItems: () => {
        return get().items.length
      },
      
      clearWishlist: () => {
        const itemCount = get().items.length
        set({ items: [] })
        
        // Show toast for wishlist clearing
        if (itemCount > 0) {
          useToastStore.getState().info(
            "Wishlist cleared",
            `${itemCount} items have been removed from your wishlist`
          )
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
