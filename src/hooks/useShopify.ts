/**
 * React hooks for Shopify Storefront API
 */

import { useState, useEffect } from 'react';
import {
  getProducts,
  getProduct,
  createCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  updateCartLine as updateCartLineApi,
  getCart,
  ShopifyProduct,
  ShopifyCart,
} from '@/lib/shopify';

/**
 * Hook to fetch products
 */
export function useProducts(collectionHandle?: string, first = 20) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts(first, collectionHandle);
        setProducts(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [collectionHandle, first]);

  return { products, loading, error };
}

/**
 * Hook to fetch a single product
 */
export function useProduct(handle: string) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getProduct(handle);
        setProduct(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    if (handle) {
      fetchProduct();
    }
  }, [handle]);

  return { product, loading, error };
}

/**
 * Hook to manage shopping cart
 */
export function useCart() {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize cart from localStorage or create new one
  useEffect(() => {
    async function initCart() {
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
        // Set an empty cart structure to prevent errors
        setCart(null);
      }
    }

    initCart();
  }, []);

  const addToCart = async (merchandiseId: string, quantity = 1) => {
    if (!cart) return null;

    try {
      setLoading(true);
      const updatedCart = await addToCartApi(cart.id, merchandiseId, quantity);
      setCart(updatedCart);
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
      setCart(updatedCart);
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
      setCart(updatedCart);
    } catch (err) {
      setError(err as Error);
      console.error('Error updating cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart?.lines.edges.reduce(
    (total, { node }) => total + node.quantity,
    0
  ) || 0;

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartLine,
    cartCount,
    loading,
    error,
  };
}
