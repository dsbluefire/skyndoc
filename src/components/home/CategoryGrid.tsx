const categories = [
  { name: "Cleansers", count: "45+ samples" },
  { name: "Toners", count: "38+ samples" },
  { name: "Serums", count: "62+ samples" },
  { name: "Moisturizers", count: "41+ samples" },
  { name: "Sunscreens", count: "29+ samples" },
  { name: "Sheet Masks", count: "85+ samples" },
  { name: "Eye Care", count: "22+ samples" },
  { name: "Lip Care", count: "18+ samples" },
];

const CategoryGrid = () => {
  return (
    <section className="py-8 bg-muted/30">
      <div className="container">
        <h2 className="section-title mb-6">Shop by Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#"
              className="category-card text-center group hover:border-primary"
            >
              <p className="font-semibold text-xs md:text-sm text-foreground">{category.name}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">{category.count}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
