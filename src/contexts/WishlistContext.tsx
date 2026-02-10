import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  getWishlistItems,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
  WishlistItem,
} from '@/lib/supabase';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string, productHandle: string, variantId?: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string, productHandle: string, variantId?: string) => Promise<void>;
  wishlistCount: number;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, user]);

  const loadWishlist = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const items = await getWishlistItems(user.id);
      setWishlistItems(items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (
    productId: string,
    productHandle: string,
    variantId?: string
  ) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      // Extract clean product ID from Shopify GID if needed
      const cleanProductId = productId.includes('gid://') 
        ? productId.split('/').pop() || productId
        : productId;

      const success = await addToWishlistApi(user.id, cleanProductId, productHandle, variantId);
      
      if (success) {
        // Optimistically update local state
        const newItem: WishlistItem = {
          id: crypto.randomUUID(),
          user_id: user.id,
          product_id: cleanProductId,
          product_handle: productHandle,
          variant_id: variantId || null,
          created_at: new Date().toISOString(),
        };
        setWishlistItems((prev) => [newItem, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      // Extract clean product ID from Shopify GID if needed
      const cleanProductId = productId.includes('gid://') 
        ? productId.split('/').pop() || productId
        : productId;

      const success = await removeFromWishlistApi(user.id, cleanProductId);
      
      if (success) {
        // Optimistically update local state
        setWishlistItems((prev) => prev.filter((item) => item.product_id !== cleanProductId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const toggleWishlist = async (
    productId: string,
    productHandle: string,
    variantId?: string
  ) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    // Extract clean product ID for comparison
    const cleanProductId = productId.includes('gid://') 
      ? productId.split('/').pop() || productId
      : productId;

    const inWishlist = wishlistItems.some((item) => item.product_id === cleanProductId);
    
    if (inWishlist) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId, productHandle, variantId);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    // Extract clean product ID for comparison
    const cleanProductId = productId.includes('gid://') 
      ? productId.split('/').pop() || productId
      : productId;
    return wishlistItems.some((item) => item.product_id === cleanProductId);
  };

  const refreshWishlist = async () => {
    await loadWishlist();
  };

  const value = {
    wishlistItems,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    wishlistCount: wishlistItems.length,
    refreshWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
