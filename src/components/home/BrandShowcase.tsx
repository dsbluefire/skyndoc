const brands = [
  { name: "COSRX" },
  { name: "Beauty of Joseon" },
  { name: "Anua" },
  { name: "Round Lab" },
  { name: "Some By Mi" },
  { name: "Innisfree" },
  { name: "Skin1004" },
  { name: "I'm From" },
  { name: "Torriden" },
  { name: "Medicube" },
];

const BrandShowcase = () => {
  return (
    <section className="py-8 bg-card border-y border-border">
      <div className="container">
        <h2 className="section-title text-center mb-6">Featured Brands</h2>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {brands.map((brand) => (
            <a
              key={brand.name}
              href="#"
              className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors min-w-[100px]"
            >
              <span className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground">
                {brand.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {brand.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
