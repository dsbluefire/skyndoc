# Authentication & User Data Setup Guide

This guide will help you set up authentication with persistent cart and wishlist functionality for your Skyndoc e-commerce site.

## Overview

The authentication system includes:
- ✅ Email/password authentication via Supabase Auth
- ✅ User session management with automatic refresh
- ✅ Persistent shopping cart linked to user accounts
- ✅ Wishlist/liked products functionality
- ✅ Protected routes and user-specific data
- ✅ Cart merging when users log in
- ✅ Beautiful login/signup pages with validation

## Setup Instructions

### 1. Run the Database Migration

You need to create the necessary database tables in your Supabase project:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_create_user_data_tables.sql`
4. Paste and run the SQL script

This will create:
- `user_profiles` table - Extended user information
- `user_carts` table - Links users to their Shopify carts
- `wishlist_items` table - Stores liked/saved products
- Row Level Security (RLS) policies - Ensures users can only access their own data
- Auto-triggers for profile creation on signup

### 2. Enable Email Authentication in Supabase

1. Go to **Authentication > Providers** in your Supabase dashboard
2. Enable **Email** provider
3. Configure email templates (optional):
   - Confirmation email
   - Password recovery email
   - Change email confirmation

### 3. Configure Site URL (Important!)

For proper redirect handling after email confirmation:

1. Go to **Authentication > URL Configuration** in Supabase
2. Add your site URL to **Site URL**: `http://localhost:5173` (for development)
3. Add redirect URLs to **Redirect URLs**:
   - `http://localhost:5173/**`
   - Your production URL when ready

### 4. Environment Variables

Your `.env` file should already have:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

These are used for both authentication and data storage.

### 5. Test the System

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test signup:**
   - Click "Sign In" in the header
   - Click "Sign up" to create an account
   - Fill in the form and submit
   - Check your email for confirmation (if enabled)

3. **Test cart persistence:**
   - Add items to cart while logged out
   - Sign in
   - Your cart should be preserved
   - Sign out and back in - cart should persist

4. **Test wishlist:**
   - Click the heart icon on any product
   - View your wishlist from the header menu
   - Add items to cart from wishlist
   - Remove items from wishlist

## Features Implemented

### Authentication
- **Login Page** (`/login`) - Email/password sign in with error handling
- **Signup Page** (`/signup`) - Account creation with validation
- **Session Management** - Automatic token refresh, persistent sessions
- **Protected Routes** - Wishlist redirects to login if not authenticated

### User Cart
- **Cart Syncing** - Cart automatically linked to user account on login
- **Cart Merging** - Smart merging when user has both guest and saved carts
- **Persistence** - Cart saved to database, accessible across devices

### Wishlist
- **Add/Remove** - Click heart icon on products to save
- **Wishlist Page** (`/wishlist`) - View all saved products
- **Product Details** - Click items to view full product page
- **Quick Add to Cart** - Add wishlist items directly to cart
- **Badge Counters** - Shows number of items in wishlist

### UI Updates
- **Header Component** - Dynamic user menu with login/logout
- **Product Cards** - Interactive heart icons with visual feedback
- **Product Pages** - Heart button with wishlist state
- **User Dropdown** - Access account and wishlist when logged in

## File Structure

### New Files Created
```
src/
├── contexts/
│   ├── AuthContext.tsx         # Authentication state management
│   └── WishlistContext.tsx     # Wishlist state management
├── pages/
│   ├── Login.tsx              # Login page
│   ├── Signup.tsx             # Signup page
│   └── Wishlist.tsx           # Wishlist page
└── lib/
    └── supabase.ts            # Updated with auth & data functions

supabase/
└── migrations/
    └── 001_create_user_data_tables.sql  # Database schema
```

### Updated Files
- `src/App.tsx` - Added AuthProvider, WishlistProvider, new routes
- `src/contexts/CartContext.tsx` - Added cart syncing with user accounts
- `src/components/layout/Header.tsx` - Auth UI, user menu, wishlist link
- `src/components/home/ProductCard.tsx` - Wishlist heart button
- `src/pages/ProductPage.tsx` - Wishlist heart button

## API Functions Available

### Authentication (`src/lib/supabase.ts`)
- `signUp(data)` - Create new user account
- `signIn(data)` - Sign in existing user
- `signOut()` - Sign out current user
- `getSession()` - Get current session
- `getCurrentUser()` - Get current user
- `resetPassword(email)` - Send password reset email
- `updatePassword(newPassword)` - Update user password

### Cart Management
- `getUserCart(userId)` - Get user's saved cart
- `saveUserCart(userId, cartId)` - Save/update user's cart

### Wishlist Management
- `getWishlistItems(userId)` - Get user's wishlist
- `addToWishlist(userId, productId, handle, variantId)` - Add to wishlist
- `removeFromWishlist(userId, productId)` - Remove from wishlist
- `isInWishlist(userId, productId)` - Check if item is in wishlist

## Usage in Components

### Using Authentication
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.email}</p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

### Using Wishlist
```tsx
import { useWishlist } from '@/contexts/WishlistContext';

function ProductComponent({ productId, productHandle }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  return (
    <button onClick={() => toggleWishlist(productId, productHandle)}>
      {isInWishlist(productId) ? '❤️ Saved' : '🤍 Save'}
    </button>
  );
}
```

## Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Automatic Profile Creation** - Profile created on signup via database trigger
- **Session-based Auth** - Secure token management with auto-refresh
- **Protected Routes** - Wishlist requires authentication

## Next Steps (Optional Enhancements)

1. **OAuth Providers** - Add Google, Facebook, Apple sign-in
2. **Email Verification** - Require email verification before access
3. **Profile Management** - Add page for users to update profile
4. **Order History** - Track user orders
5. **Favorites Collections** - Allow users to organize wishlists
6. **Password Reset Page** - Custom page for password reset flow
7. **Remember Me** - Extended session persistence option

## Troubleshooting

### "Supabase not configured" error
- Check that environment variables are set in `.env`
- Restart dev server after adding env variables

### Email confirmation not working
- Check Supabase email provider settings
- Verify site URL and redirect URLs are configured
- Check spam folder for confirmation emails

### Cart not syncing
- Verify database migration ran successfully
- Check browser console for errors
- Ensure RLS policies are enabled

### Wishlist not saving
- Ensure user is logged in
- Check database migration created `wishlist_items` table
- Verify RLS policies allow insert/delete operations

## Support

For issues or questions, check:
- Supabase documentation: https://supabase.com/docs
- React Query docs: https://tanstack.com/query/latest
- Your Supabase project logs and SQL editor

---

**Setup complete!** Your authentication system is now ready to use. Users can create accounts, save their carts, and build wishlists. 🎉
