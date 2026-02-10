import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useRef } from "react";
import { useProducts } from "@/hooks/useShopify";

const BestSellers = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Fetch products from Shopify "Full Size" collection
  const { products: shopifyProducts, loading, error } = useProducts('full-size', 20);
  
  // Map Shopify products to ProductCard format
  const products = shopifyProducts.map((product, index) => {
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const compareAtPrice = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
    const hasDiscount = compareAtPrice > price;
    
    // Calculate discount percentage
    let discountBadge = null;
    if (hasDiscount) {
      const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
      discountBadge = `-${discount}%`;
    }
    
    return {
      id: index + 1, // Use index as simple ID
      handle: product.handle, // Shopify product handle for URL
      variantId: product.variants.edges[0]?.node.id, // First variant ID for adding to cart
      name: product.title,
      brand: product.tags[0] || 'K-Beauty', // Use first tag as brand, or default
      price: price,
      originalPrice: hasDiscount ? compareAtPrice : undefined,
      rating: Math.round((Math.random() * (5.0 - 3.8) + 3.8) * 10) / 10, // Random rating between 3.8 and 5.0
      reviews: Math.floor(Math.random() * 1000) + 500, // Generate random review count
      image: product.images.edges[0]?.node.url || '/placeholder-product.png',
      badge: discountBadge || undefined,
      badgeType: hasDiscount ? 'sale' as const : undefined,
    };
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-8 bg-card">
        <div className="container">
          <h2 className="section-title mb-6">Our Full-Sized Bottles</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[200px] md:min-w-[220px]">
                <div className="bg-muted animate-pulse rounded-lg h-[300px]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state (but don't block the page)
  if (error) {
    console.error('Error loading products:', error);
    return (
      <section className="py-8 bg-card">
        <div className="container">
          <h2 className="section-title mb-6">Our Full-Sized Bottles</h2>
          <p className="text-muted-foreground">
            Unable to load products. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!products || products.length === 0) {
    return (
      <section className="py-8 bg-card">
        <div className="container">
          <h2 className="section-title mb-6">Our Full-Sized Bottles</h2>
          <p className="text-muted-foreground">
            No products available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-8 bg-card">
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Our Full-Sized Bottles</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg hover:bg-muted transition-all"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg hover:bg-muted transition-all"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[200px] md:min-w-[220px] max-w-[200px] md:max-w-[220px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
