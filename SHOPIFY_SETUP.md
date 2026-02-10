# Shopify Integration Setup Guide

This guide will help you connect your React app to Shopify using the Storefront API.

**Latest API Version:** 2026-01 (as of January 2026)

## Quick Start Checklist

- [ ] Create/access your Shopify store
- [ ] Add products and organize into collections
- [ ] Create a custom app in Shopify admin
- [ ] Configure Storefront API scopes
- [ ] Get your Storefront API access token
- [ ] Create `.env` file with credentials
- [ ] Restart dev server
- [ ] Test API connection
- [ ] Update components to use real Shopify data

**Estimated setup time:** 15-20 minutes

## Understanding Shopify Storefront API

The Storefront API has two access modes:

### Tokenless Access (Basic Features)
- No access token required
- Query complexity limit: 1,000
- Available features:
  - Products and Collections
  - Selling Plans
  - Search
  - Pages, Blogs, Articles
  - Cart (read/write)

### Token-Based Access (Full Features)
- Requires Storefront API access token
- Additional features:
  - Product Tags
  - Metaobjects and Metafields
  - Menu (Online Store navigation)
  - Customers
  - Higher query complexity

**For a production store, you'll want token-based access.**

## Step 1: Set Up Your Shopify Store

1. Go to [shopify.com](https://www.shopify.com/) and create a store (or use an existing one)
2. Add your products to the store
3. Organize products into collections (e.g., "best-sellers", "new-arrivals", "subscription-boxes")
4. Ensure products are published to the **Online Store** sales channel

## Step 2: Get Your Storefront API Credentials

**Note:** Shopify's admin UI updates frequently, so your interface might look slightly different. Look for similar options if exact button names don't match.

### 2.1: Create a Custom App

1. In your Shopify admin, go to **Settings** → **Apps and sales channels**
2. Click **Develop apps** (top right)
   - Or look for **App development** in the settings sidebar
3. If prompted, click **Allow custom app development**
4. Click **Create an app**
5. Give it a name (e.g., "Skyndoc Storefront")
6. Click **Create app**

### 2.2: Configure Storefront API Scopes

1. After creating your app, you'll be on the app overview page
2. Look for the **Access** section at the bottom
3. Click **Select scopes** next to "Scopes"
4. In the Storefront API section, enable the following scopes:
   - `unauthenticated_read_product_listings` - Read products
   - `unauthenticated_read_product_inventory` - Check stock
   - `unauthenticated_read_product_tags` - Access product tags
   - `unauthenticated_read_product_pickup_locations` - Pickup locations
   - `unauthenticated_write_checkouts` - Create checkouts
   - `unauthenticated_read_checkouts` - Read checkout data
   - `unauthenticated_write_customers` - Create customers
   - `unauthenticated_read_customers` - Read customer data
   - `unauthenticated_read_customer_tags` - Customer tags
   - `unauthenticated_read_selling_plans` - Subscriptions

   **Note:** If you don't see a "Select scopes" button, the scopes might be automatically granted for storefront apps. You can proceed to the next step.

5. Click **Save** if prompted

### 2.3: Configure Your App (Optional Settings)

You might see additional settings on the app configuration page:

- **App URL:** You can leave this as `https://example.com` for now (only needed for embedded apps)
- **Webhooks API Version:** Set to `2026-01` to match your Storefront API version
- **Embed app in Shopify admin:** You can leave this unchecked (not needed for headless storefronts)

Click **Save** when done.

### 2.4: Install the App (Required to Generate Token)

Before you can get the access token, you need to install the app:

1. Look for an **"Install app"** button (usually top right corner of the app page)
2. Click **"Install app"**
3. Confirm the installation when prompted
4. After installation, you should be redirected to the app overview page

### 2.5: Get Your Storefront Access Token

**After installing the app**, the token should be generated:

**Method 1: Check API Credentials Tab**
1. In your app's navigation (left sidebar), look for **"API credentials"** tab
2. Scroll down to find **"Storefront API access token"** section
3. Copy the token (starts with `shpat_`)

**Method 2: If No API Credentials Tab Visible**
If you only see "Home", "Versions", "Monitoring", "Logs", "Settings" in the sidebar:

1. Go back to **Shopify Settings** → **Apps and sales channels**
2. Click on **"Develop apps"**
3. Find your app in the list and click on it
4. Look for **"API credentials"** tab at the top
5. Scroll to **"Storefront API access token"** section

**Method 3: Generate Token Manually (If Not Auto-Generated)**
1. In the API credentials section
2. Look for a button like **"Create Storefront API token"** or **"Reveal token"**
3. Click it to generate/view the token

**What you should copy:**
- The token that starts with `shpat_` followed by random characters
- Example: `shpat_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`
- ⚠️ **Important:** Save this token securely - you might not be able to see it again!

**Also note your store domain:**
- Format: `your-store.myshopify.com`
- Find it in your browser's address bar or in Settings → General

**Your credentials will look like:**
- Store Domain: `your-store.myshopify.com`
- Access Token: `shpat_xxxxxxxxxxxxxxxxxxxxx` (starts with "shpat_")

### ⚠️ IMPORTANT: Which Token to Use

In the Shopify admin, you'll see different types of credentials:

#### ✅ USE THIS: Storefront API Access Token
- Usually starts with `shpat_` or similar
- Found under **"Storefront API access token"** section
- **Safe to use in frontend code** (it's designed for this!)
- This is what you need for `.env`

**Two ways to get a Storefront API token:**

1. **Via Shopify Headless App (Recommended)**
   - Install the "Headless" app from Shopify admin
   - Go to Apps → Headless → Manage Storefront API
   - Copy the **private access token**
   - ✅ Already configured correctly in this project

2. **Via Custom App**
   - Create a custom app in Settings → Apps and sales channels
   - Configure Storefront API scopes
   - Get the access token from API credentials tab

#### ❌ DO NOT USE: Admin API Access Token or API Secret Key
- Found under **"Admin API access token"** or **"API credentials"**
- Usually labeled as "API secret key" or "Admin API token"
- **NEVER use in frontend code** - these are for server-side only
- If exposed, someone could access your entire store admin

**Look for:** A section specifically labeled **"Storefront API"** or **"Storefront API access token"**

**If you can't find the Storefront token:**
- Make sure you configured the **Storefront API scopes** (not Admin API scopes)
- Look for "API credentials" tab, then scroll down to find the Storefront section
- The Storefront token section is usually separate from Admin API credentials

**What you should see:**
```
API credentials
├── Admin API access token ❌ (Don't use this)
│   └── API key
│   └── API secret key ❌ (Don't use this)
│
└── Storefront API access token ✅ (Use this one!)
    └── shpat_xxxxx... ✅ (This is what you need!)
```

## Step 3: Configure Your React App

### 3.1: Install Shopify Storefront API Client (Optional but Recommended)

Shopify provides an official lightweight client that you can use instead of raw fetch calls:

```bash
npm install @shopify/storefront-api-client
```

**Note:** The integration code I've provided works with or without this package. You can add it later if you want to use Shopify's official client.

### 3.2: Create Environment File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
   ```

   **Important:** Replace with your actual values from Step 2.4!

   Example:
   ```env
   VITE_SHOPIFY_STORE_DOMAIN=skyndoc-demo.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_abc123def456ghi789jkl012mno345pqr678
   ```

### 3.3: Verify Environment Variables

Make sure your `.env` file:
- ✅ Is in the root directory of your project (same level as `package.json`)
- ✅ Variables start with `VITE_` prefix (required for Vite to expose them)
- ✅ Has no quotes around the values
- ✅ Is listed in `.gitignore` (already done)

### 3.4: Restart Development Server

After creating the `.env` file, **you must restart** your dev server for the environment variables to be loaded:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 4: Update Your Components

I've created two main utilities for you:

### Shopify Client (`src/lib/shopify.ts`)
- `getProducts()` - Fetch all products or by collection
- `getProduct(handle)` - Get a single product
- `createCart()` - Initialize a cart
- `addToCart()` - Add items to cart
- `removeFromCart()` - Remove items from cart
- `updateCartLine()` - Update item quantities
- `getCart()` - Retrieve existing cart

### React Hooks (`src/hooks/useShopify.ts`)
- `useProducts(collectionHandle?, first?)` - Fetch products with loading states
- `useProduct(handle)` - Fetch single product with loading states
- `useCart()` - Complete cart management with:
  - `addToCart(variantId, quantity)`
  - `removeFromCart(lineIds)`
  - `updateCartLine(lineId, quantity)`
  - `cartCount` - Total items in cart
  - `cart.checkoutUrl` - Redirect to Shopify checkout

## Step 5: Example Usage

### Fetch and Display Products

```tsx
import { useProducts } from '@/hooks/useShopify';

function ProductList() {
  const { products, loading, error } = useProducts('best-sellers', 10);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <img src={product.images.edges[0]?.node.url} alt={product.title} />
          <h3>{product.title}</h3>
          <p>${product.priceRange.minVariantPrice.amount}</p>
        </div>
      ))}
    </div>
  );
}
```

### Add to Cart

```tsx
import { useCart } from '@/hooks/useShopify';

function ProductCard({ product }) {
  const { addToCart, loading } = useCart();

  const handleAddToCart = () => {
    const variantId = product.variants.edges[0].node.id;
    addToCart(variantId, 1);
  };

  return (
    <div>
      <h3>{product.title}</h3>
      <button onClick={handleAddToCart} disabled={loading}>
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

### Cart and Checkout

```tsx
import { useCart } from '@/hooks/useShopify';

function CartButton() {
  const { cart, cartCount } = useCart();

  return (
    <div>
      <button>Cart ({cartCount})</button>
      {cart && (
        <a href={cart.checkoutUrl}>
          Checkout - ${cart.cost.totalAmount.amount}
        </a>
      )}
    </div>
  );
}
```

## Step 6: Set Up Shopify Collections

To use collections (e.g., "Best Sellers", "New Arrivals"):

1. In Shopify admin, go to **Products** → **Collections**
2. Create collections with handles like:
   - `best-sellers`
   - `new-arrivals`
   - `subscription-boxes`
3. Use these handles in your code:
   ```tsx
   const { products } = useProducts('best-sellers');
   ```

## Step 7: Set Up Subscriptions

For subscription boxes, Shopify has built-in subscription support via **Selling Plans**:

### Option 1: Native Shopify Subscriptions (Recommended)
Shopify has native subscription support in the Storefront API via `SellingPlan` objects. This is available with:
- **Shopify Plus** stores
- Or stores with subscription apps installed

### Option 2: Subscription Apps
If you're not on Shopify Plus, install a subscription app:

1. **Recharge Subscriptions** (most popular)
   - [Shopify App Store](https://apps.shopify.com/subscription-payments)
   - Integrates with Storefront API
   - Handles recurring billing

2. **Seal Subscriptions**
   - [Shopify App Store](https://apps.shopify.com/seal-subscriptions)
   - More affordable alternative
   - Good for smaller stores

3. **Bold Subscriptions**
   - [Shopify App Store](https://apps.shopify.com/recurring-orders)
   - Feature-rich option

These apps integrate with the Storefront API and handle recurring billing automatically.

## Testing

### Test Mode (Mock Data)
You can test without real products by keeping the `.env` file empty. The app will use mock data.

### Tokenless Testing (Optional)
You can test with tokenless access (no credentials needed) for basic features:
- Products and collections
- Cart functionality
- Basic product info

Just make a request to `https://your-store.myshopify.com/api/2026-01/graphql.json` without the access token header.

**Query complexity limit:** 1,000 (sufficient for most basic queries)

### Live Mode (Full Access)
Once you add your Shopify credentials to `.env`, the app will:
- ✅ Fetch real products from your store
- ✅ Access all Storefront API features
- ✅ Support customer accounts
- ✅ Read product tags and metafields
- ✅ Higher query complexity limits

## API Version

The integration is currently set to use **API version 2026-01** (latest as of January 2026).

Shopify releases new API versions quarterly. To update the API version in the future:

1. Open `/src/lib/shopify.ts`
2. Find the line: `const STOREFRONT_API_URL = ...`
3. Update the version number: `/api/2026-01/graphql.json`

**Note:** Shopify maintains each version for 12 months after release.

[View Shopify API versioning documentation](https://shopify.dev/api/usage/versioning)

## Next Steps

Now that Shopify is integrated, here's how to connect your components:

### 1. Update Best Sellers to Use Real Products

```tsx
// In src/components/home/BestSellers.tsx
import { useProducts } from '@/hooks/useShopify';

const BestSellers = () => {
  const { products, loading, error } = useProducts('best-sellers', 10);
  
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;
  
  // Map Shopify products to your ProductCard format
  // ...
}
```

### 2. Add Cart to Header

```tsx
// In src/components/layout/Header.tsx
import { useCart } from '@/hooks/useShopify';
import { ShoppingCart } from 'lucide-react';

function Header() {
  const { cartCount, cart } = useCart();
  
  return (
    <button onClick={() => window.location.href = cart?.checkoutUrl}>
      <ShoppingCart />
      {cartCount > 0 && <span>{cartCount}</span>}
    </button>
  );
}
```

### 3. Link Subscription Boxes to Shopify Products

In Shopify admin:
1. Create products for each subscription tier (Explore, Glow, Custom)
2. Add them to a "subscription-boxes" collection
3. Use selling plans for recurring billing
4. Update `SubscriptionBoxes.tsx` to fetch from Shopify:

```tsx
const { products } = useProducts('subscription-boxes');
```

### 4. Create Product Detail Pages

```tsx
// src/pages/ProductPage.tsx
import { useProduct } from '@/hooks/useShopify';
import { useParams } from 'react-router-dom';

function ProductPage() {
  const { handle } = useParams();
  const { product, loading } = useProduct(handle);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      {/* Add to cart button, variants, etc. */}
    </div>
  );
}
```

### 5. Set Up Collections for Categories

In Shopify admin:
- Create collections with handles matching your site:
  - `best-sellers`
  - `new-arrivals`
  - `subscription-boxes`
  - `cleansers`, `toners`, `serums`, etc.

Then use `useProducts(collectionHandle)` to fetch each category.

## Troubleshooting

### "Shopify API credentials are not configured"
**Symptoms:** Console warning about missing credentials, app using mock data

**Solutions:**
- ✅ Make sure `.env` file exists in the project root
- ✅ Verify environment variables start with `VITE_` prefix
- ✅ Check that values don't have quotes around them
- ✅ **Restart your dev server** after creating/modifying `.env`
- ✅ Clear browser cache and refresh

### CORS Errors
**Symptoms:** Browser console shows CORS policy errors

**Solutions:**
- ✅ Shopify Storefront API allows all origins by default
- ✅ Verify you're using the correct API endpoint format
- ✅ Check that your access token is valid
- ✅ Ensure you're not using Admin API token (different from Storefront API)

### Products Not Showing
**Symptoms:** Empty product arrays, products returning null

**Solutions:**
- ✅ Verify products are published to **"Online Store"** sales channel in Shopify admin
- ✅ Check collection handles match exactly (they're case-sensitive)
- ✅ Ensure products have inventory and are available for sale
- ✅ Test the query in [Shopify's GraphiQL explorer](https://shopify.dev/custom-storefronts/tools/graphiql-storefront-api)
- ✅ Check that products have variants (all Shopify products need at least one variant)

### "Throttled" or Rate Limit Errors
**Symptoms:** API returns throttled error or 430 status code

**Good news:** The Storefront API has **no request rate limits**! However:
- 🤖 Malicious/bot traffic may be blocked (returns `430 Shopify Security Rejection`)
- 🔍 Tokenless access has a query complexity limit of 1,000

**Solutions:**
- ✅ Include the correct [Buyer IP header](https://shopify.dev/api/usage/authentication#optional-ip-header) for server-side requests
- ✅ Use token-based access for complex queries
- ✅ Reduce query complexity if using tokenless access

### "Query Complexity Exceeded" (Tokenless Access)
**Symptoms:** `MAX_COMPLEXITY_EXCEEDED` error with tokenless requests

**Solution:**
- ✅ Use token-based authentication (add your access token)
- ✅ Or reduce the number of fields/nested objects in your query
- ✅ Tokenless limit is 1,000 complexity points

### Cart Issues
**Symptoms:** Cart not persisting, items disappearing

**Solutions:**
- ✅ Verify `localStorage` is working (cart ID is stored there)
- ✅ Check that cart hasn't expired (Shopify carts expire after inactivity)
- ✅ Ensure you're passing valid variant IDs (not product IDs)
- ✅ Verify products are available for sale

### 402 Payment Required
**Symptoms:** All API requests failing with 402 status

**Solution:**
- ⚠️ Your Shopify store subscription payment is overdue
- 💳 Log into Shopify admin and update billing information
- 🔓 Store will be unfrozen after payment

## Security Notes

### ✅ Safe to Expose (Frontend Use)
- **Storefront API access tokens** - Designed for public/frontend use
- **Store domain** - Public information
- **GraphQL queries** - Can be visible in browser network tab
- **Cart data** - Managed by Shopify, secure

### ⚠️ Never Expose
- **Admin API tokens** - NEVER use in frontend code (not used in this integration)
- **API keys and secrets** - Keep server-side only
- **Customer access tokens** - Handle securely, don't log

### 🔒 Best Practices
- ✅ Checkout happens on Shopify's secure domain (PCI compliant)
- ✅ `.env` file is in `.gitignore` (credentials won't be committed)
- ✅ Use environment variables (never hardcode credentials)
- ✅ Storefront API has built-in bot protection
- ✅ Use HTTPS in production (enforced by Shopify)

**Note:** Unlike Admin API tokens, Storefront API access tokens are specifically designed to be used in frontend applications like React, mobile apps, and browsers.

## Rate Limits & Performance

### No Request Rate Limits! 🎉
The Storefront API has **no limits** on the number of requests you can make. It's designed to scale with:
- Flash sales
- Traffic surges
- High-volume stores
- Busy shopping periods

### What About Rate Limiting?
- 🤖 **Bot Protection:** Malicious traffic is automatically detected and blocked
- 🔢 **Query Complexity:** Tokenless access limited to 1,000 complexity points
- 🔐 **Token-Based:** No complexity limits with access token

[Learn more about Storefront API rate limits](https://shopify.dev/docs/api/usage/rate-limits)

## Useful Resources

### Official Documentation
- 📚 [Storefront API Reference (2026-01)](https://shopify.dev/docs/api/storefront/2026-01) - Complete API docs
- 🚀 [Getting Started Guide](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api) - Official walkthrough
- 🎓 [Storefront Learning Kit](https://github.com/Shopify/storefront-api-learning-kit) - Sample queries
- 🧪 [GraphiQL Explorer](https://shopify.dev/custom-storefronts/tools/graphiql-storefront-api) - Test queries interactively

### Developer Tools
- 🔧 [Shopify GraphiQL App](https://shopify-graphiql-app.shopifycloud.com/) - Query your actual store data
- 📦 [Storefront API Client](https://github.com/Shopify/shopify-app-js/tree/main/packages/api-clients/storefront-api-client) - Official JS client
- ⚛️ [Hydrogen](https://shopify.dev/custom-storefronts/hydrogen) - Shopify's React framework

### Community & Support
- 💬 [Shopify Community Forums](https://community.shopify.com/)
- 🐛 [GitHub Issues](https://github.com/Shopify/shopify-app-js/issues) - Report bugs
- 📝 [Developer Changelog](https://shopify.dev/changelog) - API updates
- ⚡ [Shopify Status](https://www.shopifystatus.com) - Service status

### Examples & Tutorials
- 💡 [International Pricing Examples](https://shopify.dev/api/examples/international-pricing)
- 🌍 [Multiple Languages Support](https://shopify.dev/api/examples/multiple-languages)
- 🏢 [B2B Storefronts](https://shopify.dev/custom-storefronts/headless/b2b)
- 📱 [Mobile Apps](https://shopify.dev/custom-storefronts/tools#mobile-sdks)
