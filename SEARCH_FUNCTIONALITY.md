# Search Functionality Documentation

## Overview
The search functionality allows users to search for products across your Shopify store by product title, tags, or product type.

## Features

### 1. **Desktop Search**
   - Visible search bar in the header on medium and larger screens
   - Submit search by pressing Enter or clicking submit button
   - Automatically navigates to search results page

### 2. **Mobile Search**
   - Toggle search bar by clicking the search icon in mobile view
   - Full-width search input with auto-focus
   - Same functionality as desktop search

### 3. **Search Results Page**
   - Displays matching products in a responsive grid
   - Shows product count
   - Loading skeletons for better UX
   - Error handling with retry option
   - Empty state messaging
   - Back button to return to previous page

## How It Works

### Search Query
The search uses Shopify's GraphQL API with the following query pattern:
```
title:*{query}* OR tag:*{query}* OR product_type:*{query}*
```

This searches across:
- Product titles (e.g., "Cleanser", "Moisturizer")
- Product tags (e.g., "Anti-Aging", "Hydrating", brand names)
- Product types (e.g., "Serum", "Toner")

### Files Modified/Created

1. **src/pages/SearchPage.tsx** (NEW)
   - Main search results page component
   - Handles search query from URL parameters
   - Fetches products from Shopify API
   - Displays results in product card grid

2. **src/components/layout/Header.tsx** (MODIFIED)
   - Added search state management
   - Added search form submission handler
   - Added mobile search toggle
   - Connected to React Router for navigation

3. **src/App.tsx** (MODIFIED)
   - Added `/search` route
   - Imported SearchPage component

## Usage

### For Users
1. Click on the search bar in the header
2. Type your search query (e.g., "cleanser", "COSRX", "serum")
3. Press Enter or submit the form
4. View results on the search page

### For Developers

#### Customizing Search Behavior
Edit the search query in `SearchPage.tsx`:

```typescript
const searchQuery = `
  query searchProducts($query: String!) {
    products(first: 20, query: $query) {
      // ... fields
    }
  }
`;
```

#### Adjusting Search Scope
Modify the query variable to change what fields are searched:

```typescript
const data = await shopifyFetch(searchQuery, {
  query: `title:*${query}* OR tag:*${query}* OR product_type:*${query}*`,
});
```

#### Changing Results Limit
Change `first: 20` to a different number to return more/fewer results.

## Search Features

✅ **Real-time Shopify integration** - Searches actual products from your store
✅ **Multi-field search** - Searches titles, tags, and product types
✅ **Mobile-responsive** - Works on all screen sizes
✅ **Loading states** - Skeleton loaders while fetching
✅ **Error handling** - Graceful error messages with retry
✅ **Empty states** - User-friendly messages when no results found
✅ **Navigation** - Back button to return to previous page
✅ **URL-based** - Shareable search result URLs

## Future Enhancements

Consider adding:
- **Search autocomplete** - Suggest products as user types
- **Filters** - Filter by price, brand, category after search
- **Search history** - Store recent searches locally
- **Trending searches** - Show popular search terms
- **Search analytics** - Track what users are searching for
- **Voice search** - Allow voice input for searches
- **Fuzzy search** - Better handle typos and misspellings

## Testing

1. **Basic Search**: Search for "cleanser" - should return all cleansing products
2. **Brand Search**: Search for brand names (e.g., "COSRX") - should return products from that brand (if tagged correctly)
3. **Empty Search**: Submit empty search - should show "Start your search" message
4. **No Results**: Search for nonsense - should show "No products found" message
5. **Mobile**: Test on mobile device - search icon should toggle search bar

## Troubleshooting

### No Results Showing
- Check that products in Shopify have titles, tags, or product types that match the query
- Verify Shopify API credentials in `.env` file
- Check browser console for API errors

### Search Not Submitting
- Ensure form submission handler is properly connected
- Check that React Router is properly configured
- Verify `/search` route exists in `App.tsx`

### Slow Search Results
- Consider reducing the `first: 20` limit to fetch fewer products
- Add pagination for better performance with large catalogs
- Implement debouncing for autocomplete (if added)

## API Rate Limits

Shopify Storefront API has rate limits:
- **Standard**: 2 queries per second
- **Burst**: Up to 60 queries per minute

The current implementation should stay well within these limits for normal usage.
