import { X, Truck, Gift } from "lucide-react";
import { useState } from "react";

const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white py-2 relative overflow-hidden">
      <div className="container flex items-center justify-center gap-6 text-sm font-medium">
        <div className="flex items-center gap-2 animate-fade-in">
          <Truck className="h-4 w-4" />
          <span>FREE Shipping on orders $40+</span>
        </div>
        <span className="hidden md:inline text-white/60">|</span>
        <div className="hidden md:flex items-center gap-2 animate-fade-in">
          <Gift className="h-4 w-4" />
          <span>Subscribe & Save 20%</span>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TopBanner;
