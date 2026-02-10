import { Search, ShoppingCart, User, Heart, Menu, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, FormEvent, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import CartDrawer from "@/components/cart/CartDrawer";

const categories = [
  { name: "New Arrivals", path: "/new-arrivals" },
  { name: "Subscription Boxes", path: "/subscription-boxes" },
  { name: "Luxury", path: "/luxury" },
  { name: "Samples", path: "/samples" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const { wishlistCount } = useWishlist();
  const prevCountRef = useRef(cartCount);

  // Animate cart badge when count changes
  useEffect(() => {
    if (cartCount > prevCountRef.current && prevCountRef.current !== undefined) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 500);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Main Header */}
      <div className="container py-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <a href="/" className="flex-shrink-0 flex items-center">
            <img
              src="/skyndoc.svg"
              alt="Skyndoc"
              className="h-8 md:h-9 w-auto"
              loading="eager"
            />
          </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="pl-10 pr-4 h-9 py-0 bg-white border border-gray-900 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-900 text-sm"
                />
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6 ml-auto">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden p-0 hover:bg-transparent"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search style={{ width: '28px', height: '28px' }} className="text-gray-900 stroke-[1]" />
            </Button>
            
            {/* Desktop User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center gap-3 p-0 hover:bg-transparent">
                    <User style={{ width: '32px', height: '32px' }} className="text-gray-900 stroke-[1]" />
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-sm font-medium text-gray-900">
                        {user?.email?.split('@')[0] || 'Account'}
                      </span>
                      <span className="text-xs text-gray-600">My Account</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="hidden md:flex items-center gap-3 p-0 hover:bg-transparent"
                onClick={() => navigate('/login')}
              >
                <User style={{ width: '32px', height: '32px' }} className="text-gray-900 stroke-[1]" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium text-gray-900">Sign In</span>
                  <span className="text-xs text-gray-600">or sign up</span>
                </div>
              </Button>
            )}
            
            {/* Mobile User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden p-0 hover:bg-transparent">
                    <User style={{ width: '32px', height: '32px' }} className="text-gray-900 stroke-[1]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden p-0 hover:bg-transparent"
                onClick={() => navigate('/login')}
              >
                <User style={{ width: '32px', height: '32px' }} className="text-gray-900 stroke-[1]" />
              </Button>
            )}
            
            {/* Wishlist Button (Desktop only, shown when authenticated) */}
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:inline-flex p-0 hover:bg-transparent relative"
                onClick={() => navigate('/wishlist')}
              >
                <Heart style={{ width: '32px', height: '32px' }} className="text-gray-900 stroke-[1]" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            )}
            
            {/* Cart Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-0 hover:bg-transparent relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart 
                style={{ width: '32px', height: '32px' }} 
                className={`text-gray-900 stroke-[1] transition-transform ${cartBounce ? 'animate-bounce' : ''}`} 
              />
              {cartCount > 0 && (
                <Badge className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-black text-white rounded-full transition-all ${
                  cartBounce ? 'scale-125 bg-green-500' : 'scale-100'
                }`}>
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-muted/50 border-t border-border">
        <div className="container">
          <ul className="flex items-center gap-1 py-1 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <li key={category.name}>
                <a
                  href={category.path}
                  className="nav-link whitespace-nowrap flex items-center gap-1"
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Search */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <div className="container py-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="pl-10 pr-4 h-9 py-0 bg-white border border-gray-900 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-900 text-sm"
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-card border-t border-border animate-fade-in">
          <ul className="container py-2 space-y-1">
            {categories.map((category) => (
              <li key={category.name}>
                <a
                  href={category.path}
                  className="nav-link block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Header;
