/**
 * Supabase Client for Authentication and Data Management
 * 
 * Setup Instructions:
 * 1. Create a Supabase account at supabase.com
 * 2. Create a new project
 * 3. Run the SQL migration in supabase/migrations/001_create_user_data_tables.sql
 * 4. Enable Email Auth in Supabase Dashboard (Authentication > Providers)
 * 5. Add your Supabase URL and anon key to .env file:
 *    VITE_SUPABASE_URL=your-project-url
 *    VITE_SUPABASE_ANON_KEY=your-anon-key
 * 6. Run: npm install @supabase/supabase-js
 */

import { createClient, Session, User, AuthError } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      user_carts: {
        Row: {
          id: string;
          user_id: string;
          shopify_cart_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          shopify_cart_id: string;
        };
        Update: {
          shopify_cart_id?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          product_handle: string;
          variant_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
          product_handle: string;
          variant_id?: string | null;
        };
        Update: {
          product_id?: string;
          product_handle?: string;
          variant_id?: string | null;
        };
      };
      waitlist_signups: {
        Row: {
          id: string;
          created_at: string;
          phone_number: string;
          box_type: string;
          formatted_phone: string | null;
          country_code: string;
        };
      };
    };
  };
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export interface WaitlistSignup {
  id?: string;
  created_at?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  box_type: 'general' | 'explore' | 'glow' | 'custom';
  formatted_phone?: string;
  country_code?: string;
}

/**
 * Submit a phone number to the waitlist
 */
export async function submitToWaitlist(data: WaitlistSignup): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
    // For development: log to console
    console.log('📝 Waitlist signup (not saved - Supabase not configured):', data);
    return { success: true }; // Return success in dev mode
  }

  try {
    const { error } = await supabase
      .from('waitlist_signups')
      .insert([
        {
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          box_type: data.box_type,
          formatted_phone: data.formatted_phone,
          country_code: data.country_code || '+1',
        }
      ]);

    if (error) {
      console.error('Error submitting to waitlist:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Successfully submitted to waitlist:', data.box_type);
    return { success: true };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get waitlist count (optional - for showing social proof)
 */
export async function getWaitlistCount(boxType?: string): Promise<number> {
  if (!supabase) return 0;

  try {
    let query = supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true });

    if (boxType) {
      query = query.eq('box_type', boxType);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error getting waitlist count:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('Unexpected error:', err);
    return 0;
  }
}

// ============================================================================
// Authentication Functions
// ============================================================================

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp({ email, password, fullName }: SignUpData): Promise<AuthResponse> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: data.user ?? undefined,
      session: data.session ?? undefined,
    };
  } catch (err) {
    console.error('Sign up error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn({ email, password }: SignInData): Promise<AuthResponse> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (err) {
    console.error('Sign in error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Sign out error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;

  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (err) {
    console.error('Get session error:', err);
    return null;
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;

  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (err) {
    console.error('Get user error:', err);
    return null;
  }
}

/**
 * Reset password for a user
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Reset password error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Update password error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Google sign in error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ============================================================================
// User Cart Functions
// ============================================================================

export interface UserCart {
  id: string;
  user_id: string;
  shopify_cart_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get user's cart from database
 */
export async function getUserCart(userId: string): Promise<UserCart | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('user_carts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error getting user cart:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
}

/**
 * Save or update user's cart in database
 */
export async function saveUserCart(userId: string, shopifyCartId: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('user_carts')
      .upsert({
        user_id: userId,
        shopify_cart_id: shopifyCartId,
      });

    if (error) {
      console.error('Error saving user cart:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// ============================================================================
// Wishlist Functions
// ============================================================================

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product_handle: string;
  variant_id: string | null;
  created_at: string;
}

/**
 * Get user's wishlist items
 */
export async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error:', err);
    return [];
  }
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(
  userId: string,
  productId: string,
  productHandle: string,
  variantId?: string
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: productId,
        product_handle: productHandle,
        variant_id: variantId || null,
      });

    if (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(userId: string, productId: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

/**
 * Check if product is in wishlist
 */
export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  if (!supabase) return false;  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking wishlist:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}