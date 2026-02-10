import ProductCard from "./ProductCard";

const products = [
  {
    id: 7,
    name: "Mugwort Essence Calming Sample",
    brand: "I'm From",
    price: 4.99,
    rating: 4.6,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=300&h=300&fit=crop",
    badge: "NEW",
    badgeType: "new" as const,
  },
  {
    id: 8,
    name: "Madagascar Centella Ampoule",
    brand: "Skin1004",
    price: 5.99,
    rating: 4.8,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=300&h=300&fit=crop",
    badge: "NEW",
    badgeType: "new" as const,
  },
  {
    id: 9,
    name: "Galactomyces Pure Vitamin C Glow",
    brand: "Some By Mi",
    price: 3.99,
    rating: 4.5,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&h=300&fit=crop",
    badge: "NEW",
    badgeType: "new" as const,
  },
  {
    id: 10,
    name: "Green Tea Seed Serum Trial",
    brand: "Innisfree",
    price: 4.49,
    rating: 4.7,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=300&h=300&fit=crop",
    badge: "NEW",
    badgeType: "new" as const,
  },
  {
    id: 11,
    name: "Relief Sun Rice + Probiotics SPF50+",
    brand: "Beauty of Joseon",
    price: 5.49,
    rating: 4.9,
    reviews: 2103,
    image: "https://images.unsplash.com/photo-1556228994-2f0cc25a7ec6?w=300&h=300&fit=crop",
    badge: "TRENDING",
    badgeType: "deal" as const,
  },
  {
    id: 12,
    name: "Propolis Light Ampoule Sample",
    brand: "COSRX",
    price: 4.29,
    rating: 4.6,
    reviews: 445,
    image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=300&h=300&fit=crop",
    badge: "NEW",
    badgeType: "new" as const,
  },
];

const NewArrivals = () => {
  return (
    <section className="py-8 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">New Arrivals</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
