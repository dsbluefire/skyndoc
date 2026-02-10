import { Shield, Truck, RotateCcw, Award } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Sourced directly from Korea",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Free on orders $40+",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Award,
    title: "500K+ Happy Customers",
    description: "4.9★ rated service",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-8 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div key={badge.title} className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-secondary/20 rounded-full">
                <badge.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold text-sm text-foreground">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
