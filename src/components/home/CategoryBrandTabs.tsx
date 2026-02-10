import { useState } from "react";

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

const CategoryBrandTabs = () => {
  const [activeTab, setActiveTab] = useState<"categories" | "brands">("categories");

  return (
    <section className="py-6 md:py-8 bg-black">
      <div className="container">
        <div className="flex items-center justify-center gap-8 mb-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "categories"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Shop by Category
            {activeTab === "categories" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "brands"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Featured Brands
            {activeTab === "brands" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
        </div>

        {activeTab === "categories" && (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {categories.map((category) => (
              <a
                key={category.name}
                href="#"
                className="category-card text-center group hover:border-white bg-gray-900 border-gray-800"
              >
                <p className="font-semibold text-xs md:text-sm text-white">{category.name}</p>
                <p className="text-[10px] md:text-xs text-gray-400 hidden md:block">{category.count}</p>
              </a>
            ))}
          </div>
        )}

        {activeTab === "brands" && (
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {brands.map((brand) => (
              <a
                key={brand.name}
                href="#"
                className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-900 transition-colors min-w-[100px]"
              >
                <span className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-semibold text-white">
                  {brand.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  {brand.name}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryBrandTabs;
