import { Heart, Plus, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  handle?: string; // Shopify product handle for URL
  variantId?: string; // Shopify variant ID for adding to cart
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  badgeType?: "sale" | "deal" | "new";
}

interface ProductCardProps {
  product: Product;
  rank?: number;
}

const ProductCard = ({ product, rank }: ProductCardProps) => {
  const productUrl = product.handle ? `/products/${product.handle}` : '#';
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  const inWishlist = isInWishlist(String(product.id));

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.variantId || isAdding || justAdded) {
      return;
    }

    try {
      setIsAdding(true);
      const result = await addToCart(product.variantId, 1);
      
      if (result) {
        // Show success animation
        setIsAdding(false);
        setJustAdded(true);
        
        // Reset after animation
        const timer = setTimeout(() => {
          setJustAdded(false);
        }, 1500);
        
        return () => clearTimeout(timer);
      } else {
        setIsAdding(false);
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };
  
  return (
    <div className="product-card group relative cursor-pointer overflow-visible">
      {/* Rank Badge */}
      {rank && (
        <div className="absolute top-2 left-2 z-10 w-7 h-7 bg-navy text-primary-foreground rounded-md flex items-center justify-center font-bold text-sm">
          {rank}
        </div>
      )}

      {/* Wishlist */}
      <button 
        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all ${
          inWishlist 
            ? 'bg-red-50 opacity-100' 
            : 'bg-card/80 opacity-0 group-hover:opacity-100 hover:bg-card'
        }`}
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (!isAuthenticated) {
            toast({
              title: "Sign in required",
              description: "Please sign in to save items to your wishlist",
            });
            navigate('/login', { state: { from: location.pathname } });
            return;
          }
          
          if (product.handle && !wishlistLoading) {
            try {
              setWishlistLoading(true);
              await toggleWishlist(String(product.id), product.handle, product.variantId);
              toast({
                description: inWishlist 
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
          }
        }}
        disabled={wishlistLoading}
      >
        <Heart 
          className={`h-4 w-4 transition-all ${
            wishlistLoading ? 'animate-pulse' : ''
          } ${
            inWishlist 
              ? 'fill-red-500 text-red-500' 
              : 'text-muted-foreground hover:text-red-500'
          }`} 
        />
      </button>

      {/* Clickable Product Link */}
      <Link to={productUrl} className="block">
        {/* Image */}
        <div className="aspect-square bg-muted overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-xs text-muted-foreground font-medium mb-1">
            {product.brand}
          </p>
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 min-h-[40px]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-foreground">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="price-original">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-black text-black"
                      : "fill-none text-black stroke-black"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews})
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button (outside Link to prevent nested navigation) */}
      <div className="px-3 pb-3 relative">
        <Button 
          size="icon" 
          variant="ghost" 
          className={`h-10 w-10 absolute bottom-3 right-3 transition-all duration-300 rounded-full ${
            justAdded 
              ? 'bg-green-500 text-white scale-125 shadow-lg shadow-green-300 ring-4 ring-green-200 animate-in zoom-in-50 duration-200' 
              : isAdding
              ? 'bg-black text-white scale-90'
              : 'bg-white border-2 border-gray-200 text-gray-900 hover:bg-black hover:text-white hover:border-black hover:scale-110 shadow-md'
          }`}
          onClick={handleAddToCart}
          disabled={isAdding || justAdded}
        >
          {justAdded ? (
            <Check className="h-5 w-5 stroke-[3]" />
          ) : isAdding ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="h-5 w-5 stroke-[2.5]" />
          )}
        </Button>
        
        {/* Success ripple effect */}
        {justAdded && (
          <div className="absolute bottom-3 right-3 h-10 w-10 bg-green-500 rounded-full animate-ping opacity-75 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
