import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { shopifyFetch } from "@/lib/shopify";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/home/ProductCard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchProduct {
  id: string;
  handle: string;
  title: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  tags: string[];
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchQuery = `
          query searchProducts($query: String!) {
            products(first: 20, query: $query) {
              edges {
                node {
                  id
                  handle
                  title
                  tags
                  priceRange {
                    minVariantPrice {
                      amount
                    }
                  }
                  compareAtPriceRange {
                    minVariantPrice {
                      amount
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const data = await shopifyFetch<{ products: { edges: Array<{ node: SearchProduct }> } }>({
          query: searchQuery,
          variables: {
            query: `title:*${query}* OR tag:*${query}* OR product_type:*${query}*`,
          },
        });

        setProducts(data.products.edges.map((edge) => edge.node));
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  const mapToProductCard = (product: SearchProduct) => {
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const compareAtPrice = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
    const hasDiscount = compareAtPrice > price;
    const brand = product.tags[0] || "K-Beauty";

    return {
      id: product.id,
      handle: product.handle,
      name: product.title,
      brand,
      price,
      originalPrice: hasDiscount ? compareAtPrice : undefined,
      image: product.images.edges[0]?.node.url || "/placeholder-product.png",
      rating: 4.5, // Mock rating
      reviews: 0, // Mock reviews
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header />

      <main className="container py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {query ? `Search Results for "${query}"` : "Search Products"}
          </h1>
          {!loading && products.length > 0 && (
            <p className="text-muted-foreground">
              Found {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64 mb-4" />
                <div className="bg-muted rounded h-4 w-3/4 mb-2" />
                <div className="bg-muted rounded h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && query && products.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground mb-6">
              Try searching with different keywords or browse our categories
            </p>
            <Button onClick={() => navigate("/")}>Browse All Products</Button>
          </div>
        )}

        {/* No Query State */}
        {!loading && !query && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Start your search</h2>
            <p className="text-muted-foreground">
              Enter a product name, brand, or category to find what you're looking for
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={mapToProductCard(product)} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
