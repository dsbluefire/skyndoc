import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import SearchPage from "./pages/SearchPage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import SubscriptionBoxesPage from "./pages/SubscriptionBoxesPage";
import LuxuryPage from "./pages/LuxuryPage";
import SamplesPage from "./pages/SamplesPage";
import Waitlist from "./pages/Waitlist";
import WaitlistExplore from "./pages/WaitlistExplore";
import WaitlistGlow from "./pages/WaitlistGlow";
import WaitlistCustom from "./pages/WaitlistCustom";
import RequestProduct from "./pages/RequestProduct";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WishlistPage from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AuthContextWrapper />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Wrapper component to access auth context and pass userId to CartProvider
function AuthContextWrapper() {
  const { user } = useAuth();
  
  return (
    <CartProvider userId={user?.id}>
      <WishlistProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products/:handle" element={<ProductPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/subscription-boxes" element={<SubscriptionBoxesPage />} />
          <Route path="/luxury" element={<LuxuryPage />} />
          <Route path="/samples" element={<SamplesPage />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/waitlist/explore" element={<WaitlistExplore />} />
          <Route path="/waitlist/glow" element={<WaitlistGlow />} />
          <Route path="/waitlist/custom" element={<WaitlistCustom />} />
          <Route path="/request-product" element={<RequestProduct />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
