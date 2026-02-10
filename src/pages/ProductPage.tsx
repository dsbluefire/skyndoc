import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useProduct } from "@/hooks/useShopify";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Minus, Plus, Star, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { product, loading, error } = useProduct(handle || "");
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <TopBanner />
        <Header />
        <div className="container py-12 bg-white">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-muted rounded-lg h-[500px]" />
              <div className="space-y-4">
                <div className="bg-muted rounded h-8 w-3/4" />
                <div className="bg-muted rounded h-12 w-1/4" />
                <div className="bg-muted rounded h-32" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <TopBanner />
        <Header />
        <div className="container py-12 bg-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.edges.map(edge => edge.node);
  const variants = product.variants.edges.map(edge => edge.node);
  const selectedVariant = variants[selectedVariantIndex];
  
  const price = parseFloat(selectedVariant.priceV2.amount);
  const compareAtPrice = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
  const hasDiscount = compareAtPrice > price;
  const discountPercent = hasDiscount 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!selectedVariant.availableForSale) return;
    
    try {
      await addToCart(selectedVariant.id, quantity);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant.availableForSale) return;
    
    try {
      // Add to cart
      const updatedCart = await addToCart(selectedVariant.id, quantity);
      
      // Redirect immediately to Shopify checkout
      // This is where Shop Pay, PayPal, Apple Pay, etc. will be available
      if (updatedCart?.checkoutUrl) {
        console.log('Original checkout URL:', updatedCart.checkoutUrl);
        console.log('Cart ID:', updatedCart.id);
        
        // Use the original checkoutUrl provided by Shopify
        let checkoutUrl = updatedCart.checkoutUrl;
        
        // If it's a shop.app URL (Shop Pay), try to convert to web checkout
        if (checkoutUrl.includes('shop.app')) {
          // Extract the token from shop.app URL if possible
          const urlMatch = checkoutUrl.match(/checkout\/([^?]+)/);
          if (urlMatch && urlMatch[1]) {
            const token = urlMatch[1];
            const shopDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
            // Try using the web checkout URL with the token
            checkoutUrl = `https://${shopDomain}/checkouts/${token}`;
            console.log('Converted Shop Pay URL to web checkout:', checkoutUrl);
          }
        }
        
        console.log('Final checkout URL:', checkoutUrl);
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.error('Error processing buy now:', err);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-white">
      <TopBanner />
      <Header />
      
      <main className="bg-white">
        {/* Promo Banner */}
        <div className="bg-muted/30 border-b">
          <div className="container py-2 flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="font-medium">📦 Free shipping over $60</span>
            </span>
            <span className="hidden md:block text-muted-foreground">|</span>
            <span className="hidden md:flex items-center gap-2">
              <span className="font-medium">💝 SAVE $20 with OLIVE YOUNG APP !</span>
            </span>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="border-b">
          <div className="container py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button onClick={() => navigate("/")} className="hover:text-foreground transition-colors">
                Home
              </button>
              <span>/</span>
              <span className="text-foreground">{product.title}</span>
            </div>
          </div>
        </div>

        <div className="container py-4 md:py-6">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {/* Product Images */}
          <div className="space-y-2">
            {/* Main Image */}
            <div className="aspect-square bg-white border border-border rounded-lg overflow-hidden">
              <img
                src={images[selectedImageIndex]?.url || '/placeholder-product.png'}
                alt={images[selectedImageIndex]?.altText || product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 flex-shrink-0 bg-white border rounded-lg overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? 'border-2 border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 px-2 py-0.5 rounded">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                {product.tags[0] || 'K-Beauty'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl font-semibold text-foreground leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < 4
                          ? "fill-black text-black"
                          : "fill-none text-black stroke-black"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">4.7</span>
              </div>
              <span className="text-xs text-muted-foreground">
                | 16,983 reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              {hasDiscount && (
                <span className="text-base font-semibold text-primary">
                  {discountPercent}%
                </span>
              )}
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
              <div className="text-2xl font-bold text-foreground">
                ${price.toFixed(2)}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="py-2 border-y space-y-0.5">
              <p className="text-sm text-foreground">
                Deliver to <span className="font-semibold">U.S.A</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Estimated to arrive in <span className="font-semibold">5 - 7 days</span> via FedEx/UPS.
              </p>
              <p className="text-xs text-muted-foreground">
                Free shipping is available from <span className="font-semibold">$60</span>
              </p>
            </div>

            {/* Variants (if multiple) */}
            {variants.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Select a Type
                </label>
                <select
                  value={selectedVariantIndex}
                  onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded text-sm text-foreground bg-white focus:border-primary focus:outline-none"
                >
                  {variants.map((variant, index) => (
                    <option 
                      key={variant.id} 
                      value={index}
                      disabled={!variant.availableForSale}
                    >
                      {variant.title} {!variant.availableForSale && '(Sold Out)'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Cart with Quantity - Integrated Design */}
            <div className="flex items-center gap-3 max-w-md">
              <div className="flex-1 flex items-center bg-red-600 hover:bg-red-700 rounded-full overflow-hidden transition-colors">
                {/* Quantity Selector - Left Side */}
                <div className="flex items-center px-3 py-2">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-transparent text-white font-semibold text-sm border-none outline-none cursor-pointer appearance-none pr-1"
                    style={{ backgroundImage: 'none' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num} className="bg-red-600 text-white">
                        {num}
                      </option>
                    ))}
                  </select>
                  <svg className="w-3 h-3 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Divider */}
                <div className="w-px h-6 bg-white/30" />
                
                {/* Add to Cart Button - Right Side */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant.availableForSale || cartLoading}
                  className="flex-1 px-4 py-2 text-white font-semibold text-sm disabled:opacity-50"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-sm">
                      {cartLoading ? 'Adding...' : !selectedVariant.availableForSale ? 'Out of Stock' : 'Add to Cart'}
                    </span>
                    <span className="text-xs opacity-90">Get It Shipped</span>
                  </div>
                </button>
              </div>
              
              {/* Wishlist Heart Icon */}
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 rounded-full border-2 transition-all ${
                  isInWishlist(product.id)
                    ? 'border-red-500 bg-red-50 hover:bg-red-100'
                    : 'border-border hover:bg-muted'
                }`}
                onClick={async () => {
                  if (!isAuthenticated) {
                    toast({
                      title: "Sign in required",
                      description: "Please sign in to save items to your wishlist",
                    });
                    navigate('/login', { state: { from: location.pathname } });
                    return;
                  }
                  
                  if (wishlistLoading) return;
                  
                  try {
                    setWishlistLoading(true);
                    const wasInWishlist = isInWishlist(product.id);
                    await toggleWishlist(product.id, handle || '', selectedVariant.id);
                    toast({
                      description: wasInWishlist 
                        ? `Removed from your liked items` 
                        : `Added to your liked items`,
                    });
                  } catch (error) {
                    toast({
                      description: "Something went wrong. Try again?",
                      variant: "destructive",
                    });
                  } finally {
                    setWishlistLoading(false);
                  }
                }}
                disabled={wishlistLoading}
              >
                <Heart 
                  className={`h-5 w-5 transition-all ${
                    wishlistLoading ? 'animate-pulse' : ''
                  } ${
                    isInWishlist(product.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-muted-foreground'
                  }`} 
                />
              </Button>
            </div>

            {/* Buy Now Button */}
            <Button
              size="lg"
              variant="outline"
              className="w-full max-w-md font-semibold text-sm py-3 border-2 rounded-full"
              onClick={handleBuyNow}
              disabled={!selectedVariant.availableForSale || cartLoading}
            >
              {cartLoading ? 'Processing...' : 'Buy it now'}
            </Button>

            {/* Expandable Sections */}
            <div className="space-y-0 pt-2 border-t">
              {/* Product Description */}
              <details className="group border-b">
                <summary className="flex items-center justify-between py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium text-foreground">Product Details</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <div 
                  className="prose prose-sm max-w-none text-muted-foreground pb-3 text-xs"
                  dangerouslySetInnerHTML={{ 
                    __html: product.descriptionHtml || product.description || 'No description available.' 
                  }}
                />
              </details>

              {/* Shipping & Returns */}
              <details className="group border-b">
                <summary className="flex items-center justify-between py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium text-foreground">Shipping & Returns</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <div className="prose prose-sm max-w-none text-muted-foreground pb-3 space-y-1 text-xs">
                  <p><strong>Free Shipping:</strong> Orders over $60</p>
                  <p><strong>Standard Shipping:</strong> 5-7 business days</p>
                  <p><strong>Express Shipping:</strong> 2-3 business days (additional fee)</p>
                  <p><strong>Returns:</strong> 30-day return policy for unopened items</p>
                  <p><strong>Exchanges:</strong> Free exchanges within 30 days</p>
                </div>
              </details>

              {/* How to Use */}
              <details className="group border-b">
                <summary className="flex items-center justify-between py-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium text-foreground">How to Use</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <div className="prose prose-sm max-w-none text-muted-foreground pb-3 space-y-1 text-xs">
                  <ol className="list-decimal ml-4 space-y-0.5">
                    <li>Cleanse and tone your skin</li>
                    <li>Apply a small amount to your face</li>
                    <li>Gently pat until fully absorbed</li>
                    <li>Follow with moisturizer and sunscreen (AM routine)</li>
                  </ol>
                </div>
              </details>
            </div>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
