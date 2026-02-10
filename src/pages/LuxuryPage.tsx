import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBanner from "@/components/layout/TopBanner";
import ProductCard from "@/components/home/ProductCard";
import { useProducts } from "@/hooks/useShopify";

const LuxuryPage = () => {
  const { products: shopifyProducts, loading, error } = useProducts('luxury-samples', 50);

  const products = shopifyProducts
    .filter((product) => product && product.handle) // Filter out invalid products
    .map((product, index) => {
      const price = parseFloat(product.priceRange?.minVariantPrice?.amount || '0');
      const compareAtPrice = parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || '0');
      const discount = compareAtPrice > price 
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) 
        : 0;

      return {
        id: index, // Use index as numeric ID for ProductCard
        name: product.title || 'Product',
        brand: product.tags?.find(tag => tag.startsWith('brand:'))?.replace('brand:', '') || 'Luxury',
        price,
        originalPrice: discount > 0 ? compareAtPrice : undefined,
        image: product.images?.edges?.[0]?.node?.url || '/placeholder.jpg',
        discount: discount > 0 ? discount : undefined,
        badge: product.tags?.includes('new') ? 'NEW' : undefined,
        rating: Math.round((Math.random() * (5.0 - 3.8) + 3.8) * 10) / 10,
        reviews: Math.floor(Math.random() * 500) + 100,
        handle: product.handle,
        variantId: product.variants?.edges?.[0]?.node?.id || '',
      };
    });

  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-8">Luxury Samples</h1>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Experience premium K-beauty with our curated collection of luxury sample-sized products. Discover high-end skincare and beauty essentials.
          </p>
          
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading products. Please try again.</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product, idx) => (
                <ProductCard key={`product-${idx}-${product.handle}`} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LuxuryPage;
