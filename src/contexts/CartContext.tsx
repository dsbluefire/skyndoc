import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  updateCartLine as updateCartLineApi,
  getCart,
  ShopifyCart,
} from '@/lib/shopify';
import {
  getUserCart,
  saveUserCart,
} from '@/lib/supabase';

interface CartContextType {
  cart: ShopifyCart | null;
  addToCart: (merchandiseId: string, quantity?: number) => Promise<ShopifyCart | null>;
  removeFromCart: (lineIds: string[]) => Promise<void>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  cartCount: number;
  loading: boolean;
  error: Error | null;
  syncCartWithUser: (userId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  userId?: string | null;
}

export function CartProvider({ children, userId }: CartProviderProps) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize cart from localStorage or create new one
  useEffect(() => {
    async function initCart() {
      if (initialized) return;
      
      try {
        const storedCartId = localStorage.getItem('shopify_cart_id');
        
        if (storedCartId) {
          try {
            const existingCart = await getCart(storedCartId);
            setCart(existingCart);
          } catch (err) {
            // If cart is invalid, create a new one
            console.warn('Invalid cart, creating new one');
            const newCart = await createCart();
            setCart(newCart);
            localStorage.setItem('shopify_cart_id', newCart.id);
          }
        } else {
          const newCart = await createCart();
          setCart(newCart);
          localStorage.setItem('shopify_cart_id', newCart.id);
        }
      } catch (err) {
        console.error('Failed to initialize cart:', err);
        setError(err as Error);
        setCart(null);
      } finally {
        setInitialized(true);
      }
    }

    initCart();
  }, [initialized]);

  // Sync cart with user when they log in
  useEffect(() => {
    if (userId && initialized && cart) {
      syncCartWithUser(userId);
    }
  }, [userId, initialized, cart]);

  const addToCart = async (merchandiseId: string, quantity = 1) => {
    if (!cart) {
      console.error('No cart available');
      return null;
    }

    try {
      setLoading(true);
      const updatedCart = await addToCartApi(cart.id, merchandiseId, quantity);
      
      // Force a new object reference to trigger re-render
      setCart({ ...updatedCart });
      
      // Save cart to database if user is logged in
      if (userId) {
        await saveUserCart(userId, updatedCart.id);
      }
      
      return updatedCart;
    } catch (err) {
      setError(err as Error);
      console.error('Error adding to cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (lineIds: string[]) => {
    if (!cart) return;

    try {
      setLoading(true);
      const updatedCart = await removeFromCartApi(cart.id, lineIds);
      setCart({ ...updatedCart });
      
      // Save cart to database if user is logged in
      if (userId) {
        await saveUserCart(userId, updatedCart.id);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartLine = async (lineId: string, quantity: number) => {
    if (!cart) return;

    try {
      setLoading(true);
      const updatedCart = await updateCartLineApi(cart.id, lineId, quantity);
      setCart({ ...updatedCart });
      
      // Save cart to database if user is logged in
      if (userId) {
        await saveUserCart(userId, updatedCart.id);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error updating cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync cart with user account
  const syncCartWithUser = async (userId: string) => {
    if (!cart) return;

    try {
      // Check if user has a saved cart in database
      const userCart = await getUserCart(userId);

      if (userCart) {
        // User has a saved cart - try to load it
        try {
          const savedCart = await getCart(userCart.shopify_cart_id);
          
          // Always prefer the saved cart (source of truth from database)
          console.log('Loading user\'s saved cart from database');
          setCart(savedCart);
          localStorage.setItem('shopify_cart_id', savedCart.id);
        } catch (err) {
          // Saved cart is invalid or expired - save current cart as new
          console.warn('Saved cart invalid, creating new saved cart for user');
          await saveUserCart(userId, cart.id);
          localStorage.setItem('shopify_cart_id', cart.id);
        }
      } else {
        // User doesn't have a saved cart yet - save current cart
        console.log('No saved cart found, saving current cart for user');
        await saveUserCart(userId, cart.id);
        localStorage.setItem('shopify_cart_id', cart.id);
      }
    } catch (error) {
      console.error('Error syncing cart with user:', error);
    }
  };

  // Memoize cart count to ensure it updates
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    const count = (cart?.lines?.edges || []).reduce(
      (total, { node }) => total + node.quantity,
      0
    );
    setCartCount(count);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartLine,
        cartCount,
        loading,
        error,
        syncCartWithUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

