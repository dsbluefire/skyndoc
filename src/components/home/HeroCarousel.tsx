import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PromoCard = {
  id: number;
  title: string;
  description: string;
  cta: string;
  bgGradient: string;
  textBg: string;
  imageSrc?: string;
  imageAlt?: string;
  link?: string;
};

const promoCards: PromoCard[] = [
  {
    id: 1,
    title: "Try Before You Commit",
    description: "Get 10-15 premium K-beauty samples delivered monthly.",
    cta: "JOIN OUR WAITLIST »",
    bgGradient: "bg-gradient-to-br from-pink-200 via-purple-200 to-pink-300",
    textBg: "bg-[#FFC5D3]",
    imageSrc: "/corner 1.png",
    imageAlt: "K-beauty samples",
    link: "/waitlist",
  },
  {
    id: 2,
    title: "Weekly Subscription Boxes",
    description: "Featuring COSRX, Beauty of Joseon, Anua & more bestsellers.",
    cta: "SHOP NOW »",
    bgGradient: "bg-gradient-to-br from-blue-200 via-sky-300 to-blue-400",
    textBg: "bg-[#CCCCFF]",
    imageSrc: "/cover_photo.png",
    imageAlt: "Subscription boxes",
  },
  {
    id: 4,
    title: "Sample-Sized Products",
    description: "Try before you buy with our curated sample collection.",
    cta: "SHOP NOW »",
    bgGradient: "bg-gradient-to-br from-orange-200 via-amber-200 to-orange-300",
    textBg: "bg-[#E3BC9A]",
    imageSrc: "/carousel3.png",
    imageAlt: "Product samples",
  },
  {
    id: 3,
    title: "Discover Korean Skincare",
    description: "Sample-sized products for a price you can't find on Amazon.",
    cta: "SHOP NOW »",
    bgGradient: "bg-gradient-to-br from-purple-300 via-indigo-300 to-purple-400",
    textBg: "bg-black",
    imageSrc: "/corner 3.png",
    imageAlt: "Korean skincare products",
  },
];

const HeroCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const cardsToShow = 4;

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? promoCards.length - cardsToShow : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= promoCards.length - cardsToShow ? 0 : prev + 1));
  };

  const visibleCards = promoCards;

  return (
    <div className="relative py-4 md:py-6 bg-background">
      <div className="w-full px-4 md:px-6">
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 hidden lg:block"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 hidden lg:block"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>

          {/* Cards Scrollable */}
          <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {visibleCards.map((card, index) => (
              <div
                key={`${card.id}-${index}`}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex flex-col flex-shrink-0 w-[85vw] md:w-[480px] h-auto md:h-[510px]"
              >
                {/* Image Section */}
                <div className={`relative ${card.bgGradient} h-[280px] md:h-[360px] flex ${card.id === 2 ? 'items-end justify-center' : 'items-center justify-center'} p-0 overflow-hidden w-full`}>
                  {/* Background Layer for Card 2 */}
                  {card.id === 2 && (
                    <img
                      src="/corner 2.png"
                      alt="Background"
                      className="absolute inset-0 w-full h-full object-cover z-0"
                      style={{ transform: 'translateY(3px) scale(1.1)' }}
                      loading="eager"
                    />
                  )}
                  
                  {card.imageSrc && (
                    <img
                      src={card.imageSrc}
                      alt={card.imageAlt ?? ""}
                      className={`${card.id === 2 ? 'h-[240px] md:h-[312px] w-auto object-contain relative z-10' : 'absolute inset-0 w-full h-full object-cover z-10'} group-hover:scale-105 transition-transform duration-300`}
                      loading="eager"
                    />
                  )}
                </div>

                {/* Text Section */}
                <div className={`${card.textBg} p-4 md:p-5 h-[120px] md:h-[150px] flex flex-col justify-center`}>
                  <h3 className={`${card.id === 1 || card.id === 2 || card.id === 4 ? 'text-black' : 'text-white'} text-base md:text-xl font-bold mb-1 line-clamp-2`}>
                    {card.title}
                  </h3>
                  <p className={`${card.id === 1 || card.id === 2 || card.id === 4 ? 'text-black/90' : 'text-white/90'} text-xs md:text-sm mb-2 line-clamp-2`}>
                    {card.description}
                  </p>
                  {card.link ? (
                    <Link to={card.link}>
                      <button className={`${card.id === 1 || card.id === 2 || card.id === 4 ? 'text-black' : 'text-white'} font-bold text-sm tracking-wide hover:underline text-left`}>
                        {card.cta}
                      </button>
                    </Link>
                  ) : (
                    <button className={`${card.id === 1 || card.id === 2 || card.id === 4 ? 'text-black' : 'text-white'} font-bold text-sm tracking-wide hover:underline text-left`}>
                      {card.cta}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
