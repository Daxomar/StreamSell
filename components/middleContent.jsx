"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown,ChevronRight, Star } from "lucide-react";
import Link from "next/link"

// ── Helpers ────────────────────────────────────────────────────────────────

const extractCategories = (products = []) => {
  const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
  return ["All Products", ...cats.sort()];
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount);

// ── Product Card ───────────────────────────────────────────────────────────
const ProductCard = ({ product }) => (
  <Link href={`shop/${product._id}`} className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-green-200 transition-all duration-200">
    <div className="relative h-44 bg-slate-50 overflow-hidden">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.target.style.display = "none")}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">
          📦
        </div>
      )}
      {product.Data && (
        <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {product.Data}
        </span>
      )}
    </div>

    <div className="p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-0.5">
        {product.category}
      </p>
      <p className="text-sm font-bold text-slate-800 leading-snug mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
        {product.name}
      </p>
      {product.rating && (
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              className={
                i < Math.round(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
              }
            />
          ))}
          <span className="text-[10px] text-slate-400 ml-0.5">
            ({product.reviewCount || 0})
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-green-600 font-extrabold text-sm">
          {formatCurrency(product.price)}
        </p>
        <div className="w-8 h-8 rounded-full bg-green-50 group-hover:bg-green-600 flex items-center justify-center transition-colors">
          <ChevronRight size={16} className="text-green-600 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  </Link>
)

// ── Collection Bar ─────────────────────────────────────────────────────────

const CollectionBar = ({ total, filtered, sortBy, onSortChange }) => (
  <div className="flex justify-between items-center border border-slate-200 bg-white p-4 rounded-2xl mb-4">
    <div>
      <p className="text-sm font-black text-slate-800">Collection View</p>
      <p className="text-xs text-slate-400 font-medium">
        Showing {filtered} of {total} products
      </p>
    </div>
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-slate-500 hidden sm:block">
        Sort by
      </label>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-green-500 cursor-pointer"
      >
        <option value="default">Default</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  </div>
);

// ── Sidebar ────────────────────────────────────────────────────────────────

const Sidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
  minRating,
  onRatingChange,
  onShowResults,
  pendingCount,
}) => (
  <div className="flex flex-col gap-6">
    {/* Categories */}
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
        Categories
      </p>
      <ul className="flex flex-col gap-1">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => onCategoryChange(cat)}
              className={`w-full text-left text-sm font-semibold px-3 py-2 rounded-xl transition-all ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "text-slate-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>

    {/* Max Price */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Max Price
        </p>
        <span className="text-xs font-bold text-green-700">
          GH₵ {maxPrice.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={5000}
        step={50}
        value={maxPrice}
        onChange={(e) => onMaxPriceChange(Number(e.target.value))}
        className="w-full accent-green-600 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
        <span>GH₵ 0</span>
        <span>GH₵ 5,000</span>
      </div>
    </div>

    {/* Ratings */}
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
        Min Rating
      </p>
      <div className="flex flex-col gap-1.5">
        {[0, 3, 4, 5].map((r) => (
          <button
            key={r}
            onClick={() => onRatingChange(r)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              minRating === r
                ? "bg-green-600 text-white"
                : "text-slate-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {r === 0 ? (
              "All Ratings"
            ) : (
              <span className="flex items-center gap-1">
                {[...Array(r)].map((_, i) => (
                  <Star key={i} size={12} className="fill-current" />
                ))}
                <span>& up</span>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Show Results */}
    <button
      onClick={onShowResults}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3 rounded-xl transition-colors"
    >
      Show {pendingCount} Result{pendingCount !== 1 ? "s" : ""}
    </button>
  </div>
);





export const DUMMY_PRODUCTS = [
  // Mannequins
  { id: "1",  name: "Full Body Female Mannequin",     category: "Mannequins",          price: 420,  rating: 4, reviewCount: 12, data: "Size 10",   imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: "2",  name: "Half Torso Display Form",        category: "Mannequins",          price: 185,  rating: 3, reviewCount: 7,  data: "Standard",  imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80" },
  { id: "3",  name: "Male Window Mannequin",          category: "Mannequins",          price: 510,  rating: 5, reviewCount: 20, data: "Size 40",   imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80" },
  { id: "4",  name: "Child Mannequin — Ages 6–8",     category: "Mannequins",          price: 290,  rating: 4, reviewCount: 5,  data: "Age 6–8",   imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80" },

  // Kitchen Appliances
  { id: "5",  name: "1.8L Digital Rice Cooker",       category: "Kitchen Appliances",  price: 320,  rating: 5, reviewCount: 34, data: "1.8L",      imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80" },
  { id: "6",  name: "700W Blender & Smoothie Maker",  category: "Kitchen Appliances",  price: 275,  rating: 4, reviewCount: 18, data: "700W",      imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80" },
  { id: "7",  name: "Non-Stick Electric Frying Pan",  category: "Kitchen Appliances",  price: 410,  rating: 3, reviewCount: 9,  data: "32cm",      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },

  // Kitchen Utensils
  { id: "8",  name: "Stainless Steel Knife Set",      category: "Kitchen Utensils",    price: 195,  rating: 5, reviewCount: 41, data: "6 Piece",   imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&q=80" },
  { id: "9",  name: "Bamboo Cutting Board Set",       category: "Kitchen Utensils",    price: 85,   rating: 4, reviewCount: 22, data: "Set of 3",  imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80" },
  { id: "10", name: "Ceramic Dinner Set",             category: "Kitchen Utensils",    price: 220,  rating: 4, reviewCount: 15, data: "12 Piece",  imageUrl: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80" },

  // Dresses
  { id: "11", name: "Ankara Print Midi Dress",        category: "Dresses",             price: 155,  rating: 5, reviewCount: 28, data: "S–XL",      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80" },
  { id: "12", name: "Linen Wrap Dress — Ivory",       category: "Dresses",             price: 210,  rating: 4, reviewCount: 11, data: "XS–XL",     imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80" },
  { id: "13", name: "Bodycon Evening Dress",          category: "Dresses",             price: 180,  rating: 3, reviewCount: 6,  data: "S–L",       imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80" },

  // Perfumes
  { id: "14", name: "Oud & Amber EDP 100ml",          category: "Perfumes",            price: 340,  rating: 5, reviewCount: 52, data: "100ml",     imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80" },
  { id: "15", name: "Floral Musk Body Spray",         category: "Perfumes",            price: 95,   rating: 4, reviewCount: 19, data: "200ml",     imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80" },
  { id: "16", name: "Vanilla & Sandalwood EDP",       category: "Perfumes",            price: 290,  rating: 4, reviewCount: 8,  data: "75ml",      imageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&q=80" },

  // Health & Wellness
  { id: "17", name: "Resistance Band Set",            category: "Health & Wellness",   price: 120,  rating: 4, reviewCount: 33, data: "5 Bands",   imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80" },
  { id: "18", name: "Digital Body Weight Scale",      category: "Health & Wellness",   price: 175,  rating: 5, reviewCount: 27, data: "180kg Max", imageUrl: "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=400&q=80" },
  { id: "19", name: "Posture Corrector Brace",        category: "Health & Wellness",   price: 90,   rating: 3, reviewCount: 14, data: "S–XL",      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" },

  // Others
  { id: "20", name: "Portable Handheld Steamer",      category: "Others",              price: 145,  rating: 4, reviewCount: 10, data: "800W",      imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80" },
  { id: "21", name: "LED Vanity Mirror",              category: "Others",              price: 260,  rating: 5, reviewCount: 16, data: "3 Lighting", imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80" },
];



// ── MiddleContent ──────────────────────────────────────────────────────────

export const MiddleContent = ({ products, onAddToCart }) => {
  const categories = extractCategories(products);

  // Sidebar pending state (before "Show Results")
  const [selectedCategory,  setSelectedCategory]  = useState("All Products");
  const [maxPrice,          setMaxPrice]           = useState(5000);
  const [minRating,         setMinRating]          = useState(0);

  // Applied state (what actually drives the grid)
  const [appliedMaxPrice,   setAppliedMaxPrice]    = useState(5000);
  const [appliedMinRating,  setAppliedMinRating]   = useState(0);

  const [sortBy,            setSortBy]             = useState("default");
  const [mobileFiltersOpen, setMobileFiltersOpen]  = useState(false);

  // Category change applies immediately
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
  };

  // Price + rating apply only on "Show Results"
  const applyFilters = () => {
    setAppliedMaxPrice(maxPrice);
    setAppliedMinRating(minRating);
    setMobileFiltersOpen(false);
  };

  // ── Filter ──
  const filtered = products.filter((p) => {
    if (selectedCategory !== "All Products" && p.category !== selectedCategory) return false;
    if (p.price > appliedMaxPrice) return false;
    if (appliedMinRating > 0 && (p.rating || 0) < appliedMinRating) return false;
    return true;
  });

  // ── Sort ──
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc")  return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "rating")     return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  // Pending count for "Show Results" button
  const pendingCount = products.filter((p) => {
    if (selectedCategory !== "All Products" && p.category !== selectedCategory) return false;
    if (p.price > maxPrice) return false;
    if (minRating > 0 && (p.rating || 0) < minRating) return false;
    return true;
  }).length;

  // ── Contained scroll ──
  const shopRef = useRef(null);
  useEffect(() => {
    const el = shopRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop    = scrollTop === 0 && e.deltaY < 0;
      const atBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 2 && e.deltaY > 0;
      if (!atTop && !atBottom) e.stopPropagation();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // ── Empty state ──
  const EmptyState = ({ onClear }) => (
    <div className="flex flex-col items-center justify-center h-full py-16 text-slate-400 gap-3">
      <span className="text-5xl">📭</span>
      <p className="font-semibold text-sm">No products match your filters</p>
      {onClear && (
        <button
          onClick={onClear}
          className="text-xs font-bold text-green-600 underline underline-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  const clearAll = () => {
    setSelectedCategory("All Products");
    setMaxPrice(5000);
    setMinRating(0);
    setAppliedMaxPrice(5000);
    setAppliedMinRating(0);
  };

  return (
    <div className="w-full">

      {/* ── Mobile: filter toggle bar ── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 sticky top-[108px] z-20">
        <p className="text-xs font-semibold text-slate-500">
          {sorted.length} product{sorted.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setMobileFiltersOpen((o) => !o)}
          className="flex items-center gap-2 text-sm font-bold text-green-700 bg-green-50 px-4 py-2 rounded-xl"
        >
          <SlidersHorizontal size={15} />
          Filters
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${mobileFiltersOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* ── Mobile: collapsible filter panel ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-b border-slate-100 px-4 ${
          mobileFiltersOpen ? "max-h-[600px] py-5" : "max-h-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="font-black text-sm text-slate-800">Filters</p>
          <button onClick={() => setMobileFiltersOpen(false)}>
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          minRating={minRating}
          onRatingChange={setMinRating}
          onShowResults={applyFilters}
          pendingCount={pendingCount}
        />
      </div>

      {/* ── Desktop: sidebar + grid ── */}
      <div className="hidden md:grid md:grid-cols-[220px_1fr] md:gap-8 px-4 py-6 max-w-6xl mx-auto">

        {/* Sticky sidebar */}
        <aside className="sticky top-24 h-fit bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            minRating={minRating}
            onRatingChange={setMinRating}
            onShowResults={applyFilters}
            pendingCount={pendingCount}
          />
        </aside>

        {/* Product area */}
        <div className="flex flex-col">
          <CollectionBar
            total={products.length}
            filtered={sorted.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Scrollable grid */}
          <div
            ref={shopRef}
            className="h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent"
          >
            {sorted.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {sorted.map((p) => (
                  <ProductCard key={p._id} product={p} onAddToCart={onAddToCart} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile: product grid ── */}
      <div className="md:hidden px-4 py-4">
        <CollectionBar
          total={products.length}
          filtered={sorted.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sorted.map((p) => (
              <ProductCard key={p._id} product={p} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default MiddleContent;

// ── Usage ──────────────────────────────────────────────────────────────────
// <MiddleContent
//   products={resellerBundleProductPrices}
//   onAddToCart={(product) => addToCart(product)}
// />
//
// Each product: { id, name, category, price, imageUrl?, data?, rating?, reviewCount? }