import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FormFillingAnimation from "@/components/animations/FormFillingAnimation";
import ProductSelectionAnimation from "@/components/animations/ProductSelectionAnimation";

const boxes = [
  {
    name: "Explore Box",
    price: 14.99,
    samples: "5–7 samples",
    frequency: "Weekly",
    description: "Try something new every week",
    features: [
      "Trusted brands only",
      "New products each week",
      "Covers every step of your routine"
    ],
    badge: null,
    popular: false,
    waitlistLink: "/waitlist/explore",
    icon: "📦",
  },
  {
    name: "Personalized Box",
    price: 19.99,
    samples: "9-12 samples",
    frequency: "Weekly",
    description: "We analyze your skin and tailor your routine weekly.",
    features: [
      "Everything in explore box",
      "Weekly trials structured by Skyndoc specialists",
      "Weekly check-ins with personalized recommendations"
    ],
    badge: "MOST POPULAR",
    popular: true,
    waitlistLink: "/waitlist/glow",
    icon: "✨",
  },
  {
    name: "Custom Box",
    price: 24.99,
    samples: "Your exact routine",
    frequency: "Weekly",
    description: "Only what works. Nothing extra.",
    features: [
      "Choose your proven favorites",
      "Full weekly routine quantities",
      "Swap anytime"
    ],
    badge: null,
    popular: false,
    waitlistLink: "/waitlist/custom",
    icon: "⚙️",
  },
];

const SubscriptionBoxes = () => {
  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="container">
        <h2 className="section-title mb-6">Subscription Boxes</h2>

        <div className="grid md:grid-cols-3 gap-0 border border-gray-200 rounded-lg overflow-hidden max-w-7xl mx-auto">
          {boxes.map((box, index) => (
            <div
              key={box.name}
              className={`relative flex flex-col bg-white p-8 ${
                index !== boxes.length - 1 ? 'border-r border-gray-200' : ''
              } hover:shadow-lg transition-shadow duration-200`}
            >
              {/* Graphic/Icon */}
              {box.name === "Personalized Box" ? (
                <div className="mb-6 h-48 flex items-center justify-center">
                  <FormFillingAnimation />
                </div>
              ) : box.name === "Custom Box" ? (
                <div className="mb-6 h-48 flex items-center justify-center">
                  <ProductSelectionAnimation />
                </div>
              ) : (
                <div className="flex items-center justify-center mb-6 h-48">
                  <img 
                    src="/done.png" 
                    alt={box.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl text-black mb-2 min-h-[2rem]">{box.name}</h3>
                <p className="text-sm text-gray-600 mb-6 min-h-[2.5rem]">{box.description}</p>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl text-black font-light">
                    ${box.price}
                  </span>
                  <span className="text-base text-gray-600">/ week</span>
                </div>

                <Link to={box.waitlistLink} className="block">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg text-base">
                    Get {box.name}
                  </Button>
                </Link>
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-900 mb-4">
                  {box.samples} • {box.frequency}
                </p>
                <ul className="space-y-3">
                  {box.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-black" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionBoxes;
