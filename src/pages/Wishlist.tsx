import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TopBanner from '@/components/layout/TopBanner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { getProduct } from '@/lib/shopify';

interface WishlistProductData {
  id: string;
  handle: string;
  title: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        priceV2: {
          amount: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
}

export default function Wishlist() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { wishlistItems, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const [productsData, setProductsData] = useState<Record<string, WishlistProductData>>({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/wishlist' } } });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load product details for wishlist items
  useEffect(() => {
    const loadProducts = async () => {
      if (wishlistItems.length === 0) {
        setLoadingProducts(false);
        return;
      }

      try {
        const productPromises = wishlistItems.map(async (item) => {
          try {
            const product = await getProduct(item.product_handle);
            return { handle: item.product_handle, product };
          } catch (err) {
            console.error(`Error loading product ${item.product_handle}:`, err);
            return null;
          }
        });

        const results = await Promise.all(productPromises);
        const productsMap: Record<string, WishlistProductData> = {};

        results.forEach((result) => {
          if (result && result.product) {
            productsMap[result.handle] = result.product as WishlistProductData;
          }
        });

        setProductsData(productsMap);
      } catch (error) {
        console.error('Error loading wishlist products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [wishlistItems]);

  const handleAddToCart = async (productId: string, variantId?: string) => {
    const product = Object.values(productsData).find((p) => p.id === productId);
    if (!product) return;

    const defaultVariant = product.variants.edges[0]?.node;
    const targetVariantId = variantId || defaultVariant?.id;

    if (targetVariantId) {
      try {
        await addToCart(targetVariantId, 1);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  if (authLoading || wishlistLoading || loadingProducts) {
    return (
      <div className="min-h-screen bg-white">
        <TopBanner />
        <Header />
        <div className="container py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBanner />
      <Header />
      
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Liked Items</h1>
          <span className="text-muted-foreground">
            ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
          </span>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <h2 className="text-2xl font-semibold mb-2">No liked items yet</h2>
              <p className="text-muted-foreground mb-6">
                Start adding products you love!
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="rounded-full px-8 py-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all text-sm"
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {wishlistItems.map((item) => {
              const product = productsData[item.product_handle];
              
              if (!product) {
                return (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <p className="text-muted-foreground">Loading product...</p>
                    </CardContent>
                  </Card>
                );
              }

              const price = parseFloat(product.priceRange.minVariantPrice.amount);
              const defaultVariant = product.variants.edges[0]?.node;
              const featuredImage = product.images?.edges?.[0]?.node;

              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div
                        className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/products/${item.product_handle}`)}
                      >
                        {featuredImage ? (
                          <img
                            src={featuredImage.url}
                            alt={featuredImage.altText || product.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground text-xs">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-lg mb-1 cursor-pointer hover:text-primary line-clamp-2"
                          onClick={() => navigate(`/products/${item.product_handle}`)}
                        >
                          {product.title}
                        </h3>
                        <p className="text-xl font-bold mb-3">
                          ${price.toFixed(2)}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product.id, item.variant_id || undefined)}
                            disabled={!defaultVariant?.availableForSale}
                            className="flex-1 sm:flex-none"
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {defaultVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemove(item.product_id)}
                            className="flex-1 sm:flex-none"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
