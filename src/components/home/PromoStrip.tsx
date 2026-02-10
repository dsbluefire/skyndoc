import { Gift, Clock, Star, Percent } from "lucide-react";

const promos = [
  {
    icon: Gift,
    title: "First Box Special",
    subtitle: "25% OFF + Free Gift",
    bgClass: "bg-coral-light",
  },
  {
    icon: Clock,
    title: "Flash Sale",
    subtitle: "Ends in 3h 24m",
    bgClass: "bg-mint-light",
  },
  {
    icon: Star,
    title: "Member Exclusive",
    subtitle: "Extra 10% OFF",
    bgClass: "bg-cream",
  },
  {
    icon: Percent,
    title: "Bundle & Save",
    subtitle: "Up to 40% OFF",
    bgClass: "bg-coral-light",
  },
];

const PromoStrip = () => {
  return (
    <div className="py-4 bg-card border-b border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {promos.map((promo) => (
            <a
              key={promo.title}
              href="#"
              className={`${promo.bgClass} rounded-lg p-3 md:p-4 flex items-center gap-3 hover:shadow-md transition-all group cursor-pointer`}
            >
              <div className="p-2 bg-card rounded-full group-hover:scale-110 transition-transform">
                <promo.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{promo.title}</p>
                <p className="text-xs text-muted-foreground">{promo.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoStrip;
