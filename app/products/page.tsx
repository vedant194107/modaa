"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import QuickViewModal from "@/components/QuickViewModal";
import { addItemToCart } from "@/lib/cartHelper";
import { toggleWishlistItem, getWishlist } from "@/lib/wishlistHelper";
import { formatPrice, getActiveCurrency, CurrencyCode } from "@/lib/currencyHelper";

const defaultProducts = [
  {
    id: "prod_1",
    title: "RAVEN DISTRESSED DENIM",
    category: "Denim",
    price: 245.00,
    image1: "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
    image2: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrX94UfLWWL9WuQ9OhVFbUE-YQfjbuEcvd_AahspPE-C8s8VavYeXSvovcyTnFlSD1nzUrkFC3ALnxBDiz3jkQ_J2Mn3nmsuwya27j3HOj7-PH-VEup4ahSJvV3mnsnoF5Vaus9Q5LNOhfYoP0xWhpi8aHq27dVKDznUJPE6Np8HWpOoZU2EDMi52pVrZ2c_MtJSxHXPpv_ySEc5o4aEbWXVfU43ZyNygYUutPcsxPtCg4KdjM1XecFSk1nqPwq8zRLI04pPbaO-k",
    description: "Heavyweight distressed black denim jacket with red contrast stitching. Limited archive run with hand-finished detailing.",
    colors: ["bg-black", "bg-neutral-400"],
    stock: 25,
  },
  {
    id: "prod_2",
    title: "ARCHITECT CARGO SYSTEM",
    category: "Denim / Pants",
    price: 180.00,
    image1: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVdjayF_lzJBVbPYqMV2nBjlzjQqclMmgAF6FyqTau4MAbCGCUfhAGssWRs6ms-axVrRO65YMrU--lPHNw_ypgnrlMZKQ3-TQuY0jn7xSWpR7hG9EAJSc9gZ-B3-INb_F_nxvcc8BpRiuNz1i6i44_YNy_ru8iiDhCvyT6CD5g4abVkQJ6M-fzQle_MmiqRQrsEGo2z1AAkZWEbcbwprfkbCg6uPWmwOx0sp-Qqh6GL0-ehNoVGxsaOz7C4_znAVpl2fkI2fvWUk",
    image2: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMwdwbB1GoiwOKzPfar62-7DqVDtWKyn6EOM2V_q2Bdmei-XlSlAgbaGcK_PksvB6EdF8u_bkN7yg_wymO2v2snGhSkkVUo0GA8c7DeQFe1D5lqq0fH0wzGGq7b-dWTbYtjsnUqv5391GqKs8iPy74KbMRK7LmcEiqTQZb3kPnopT05H5TQMntQ24GswmmdX7zuk3H4fdKiLDftjsiDXDdsEXp6CNJKBGpLN95BUvmeYqk95SwnwsbieMi5ejgz5SS_xogyab27x0",
    description: "Oversized architectural cream cargo trousers featuring Milano Red accent hardware and articulated tactical pockets.",
    colors: ["bg-stone-200", "bg-milano-red"],
    stock: 40,
  },
  {
    id: "prod_3",
    title: "CORE 500GSM HOODIE",
    category: "Tops",
    price: 155.00,
    image1: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmM3dFYFdmbfG8iyYU1FdgUgiWIXoAbojb-UTfat8oLcmGbNgbwKoAgxqjMQUdZRMT-EPGAjtIo27Ze6dnms3MQv8cqNqVYimWK8aEmEJwBxqnQeMej_Ks-hdp4AIrPXhNjp6W9dRCvDWNF5Qwjkyqqbj8bQrU9ENQZxP7LbibxLP4kAWs8tCOiZO5ldpUsGjs9ycmLt-glI-0aZusmDv6BWypRdxLicFBsRQmHbhVtd8g6mXb-w57CSm2Kf5osP7PYARA83fRE7M",
    image2: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHZZW0lq9cr6kdJRrIf44jj46zPq6amsbeliD9Vrtqre-IoaXCVQcyy11I3sri9zUMmuvzOU-N9RHWCkIXHvpMANY7U_wCWYKxthoU-29QVElLb7m8njsVbJR2lPQ8Dy-FbbRlgPZXRl0KgMyrAwLft3Vkl1Kyx-FeJ-ux4jTY09Vz7j9cFbGpW3wwqyMhS4avxagQcNTUP2zK90oMqMG79MJZpbXzypNkV_fHN4-FP7fvLgBdCtVc3JiBlcy78vcLCRWxJ7HM4pY",
    description: "Ultra-heavy boxy-cut black fleece hoodie with high-contrast Milano Red typography printed on chest.",
    colors: ["bg-black", "bg-milano-red", "bg-white"],
    stock: 30,
  },
  {
    id: "prod_4",
    title: "TACTICAL VEST - RED",
    category: "Outerwear",
    price: 210.00,
    image1: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrsfzMMAc4AsPLC2kiQ-KJsQQhq2LtlUPizDxjwYMq4JjUnOmN4Z0sEFBGU96ZHttvj7wO2v6PwVByUKqaIaIC-AScypD1VxHeaZZr_shSJHWbVKL0qnVPguPxkZUZOpaGSRTgpfcCb_X3JIN1NlYBJHPdXwaDj92yaTzwOal-RNCYTiytmJHxL97b2VrMocPVblMBZerunLeiSh8NqrYfoOx-Nhv95q18Tak4hhQuey_LyWpSuWwYQnEP18eoFvyhLlbu_a_5lok",
    image2: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtP_DIlXrVVIaVJO7vgBR9pozKpi4qXd9aL30y3pSoy2-mlbDoXxoBD97CNDQlx5VGHHn-jx2lHbdl_-z3wcm1bBw1Rgp9QLrpccYY0jSH_oVMXSfb9bvcCayQlQQ2DH_ZEyBOnRT1YRQZDDktrHzqyh-mBQ4v_9nh2pfLEO4hZvTsD_GMwKV124-SjZ7QmVsHgMLIKNvgACpxWLrhdLRLrBpOhWAF9eWK-jnC9uSZtqmiI1d7_uBQeBNeb0C0LTHeG5VvrgnliIw",
    description: "Multi-pocket technical utility vest in Milano Red crafted from waterproof technical nylon.",
    colors: ["bg-milano-red"],
    stock: 15,
  },
];

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchArg = searchParams.get("search") || "";
  const [activeSearch, setActiveSearch] = useState(searchArg);

  const [catalogProducts, setCatalogProducts] = useState<any[]>(defaultProducts);
  const [availableCategories, setAvailableCategories] = useState<string[]>(["Outerwear", "Denim", "Tops", "Accessories", "Pants"]);
  const [viewMode, setViewMode] = useState<"grid2" | "grid3" | "grid4" | "list">("grid3");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isFilterSidebarVisible, setIsFilterSidebarVisible] = useState(true);
  const [favorites, setFavorites] = useState<Record<number | string, boolean>>({});
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Advanced Filter Controls State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("Featured");
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    setCurrency(getActiveCurrency());
    const handleCurr = (e: any) => setCurrency(e.detail || getActiveCurrency());
    window.addEventListener("currency-updated", handleCurr);
    return () => window.removeEventListener("currency-updated", handleCurr);
  }, []);

  useEffect(() => {
    setActiveSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Fetch real products from SQLite API
  useEffect(() => {
    fetch(`/api/admin/products?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const mapped = data.products.map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            price: typeof p.price === "number" ? p.price : parseFloat(p.price),
            image1: p.image1,
            image2: p.image2 || p.image1,
            description: p.description || "",
            colors: ["bg-black", "bg-milano-red"],
            stock: p.stock !== undefined ? p.stock : 50,
            status: p.status,
          }));
          // Merge database products with default products
          // Database products take precedence over default products with the same ID
          const merged = [...defaultProducts];
          mapped.forEach((dbProd: any) => {
            const index = merged.findIndex(p => String(p.id) === String(dbProd.id));
            if (index !== -1) {
              merged[index] = { ...merged[index], ...dbProd };
            } else {
              merged.unshift(dbProd);
            }
          });
          setCatalogProducts(merged);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  // Fetch categories from SQLite API
  useEffect(() => {
    fetch(`/api/admin/categories?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setAvailableCategories(data.categories.map((c: any) => c.name));
        }
      })
      .catch((e) => console.error(e));
  }, []);

  // Sync favorites from localStorage on mount
  useEffect(() => {
    const saved = getWishlist();
    const map: Record<string, boolean> = {};
    saved.forEach((item) => { map[String(item.id)] = true; });
    setFavorites(map);

    const handleWishlistUpdate = (e: any) => {
      const updated = e.detail || getWishlist();
      const newMap: Record<string, boolean> = {};
      updated.forEach((item: any) => { newMap[String(item.id)] = true; });
      setFavorites(newMap);
    };
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, []);

  const toggleFavorite = (product: any) => {
    toggleWishlistItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image1,
      category: product.category,
      href: `/product-detail?id=${product.id}`,
    });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const removeCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== cat));
  };

  const removeColor = (col: string) => {
    setSelectedColors((prev) => prev.filter((c) => c !== col));
  };

  const removeSize = (sz: string) => {
    setSelectedSizes((prev) => prev.filter((s) => s !== sz));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setMaxPrice(500);
    setInStockOnly(false);
    setActiveSearch("");
  };

  // Filter & Sort Logic
  const filteredProducts = catalogProducts
    .filter((product) => {
      // Global Search Query Filter
      if (activeSearch.trim()) {
        const q = activeSearch.trim().toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesDesc = (product.description || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesDesc) return false;
      }

      // Category Filter
      if (selectedCategories.length > 0) {
        const matchesCat = selectedCategories.some((cat) =>
          product.category.toLowerCase().includes(cat.toLowerCase())
        );
        if (!matchesCat) return false;
      }

      // In-Stock Radar Filter
      if (inStockOnly && (product.stock === undefined || Number(product.stock) <= 0)) {
        return false;
      }

      // Max Price Filter
      const pPrice = typeof product.price === "number" ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, ""));
      if (pPrice > maxPrice) return false;

      // Color Filter
      if (selectedColors.length > 0) {
        const matchesCol = selectedColors.some((color) => {
          if (color.toLowerCase() === "black") {
            return (
              product.colors?.some((c: string) => c.includes("black")) ||
              product.description.toLowerCase().includes("black") ||
              product.title.toLowerCase().includes("black") ||
              product.title.toLowerCase().includes("raven")
            );
          }
          return product.colors?.some((c: string) => c.toLowerCase().includes(color.toLowerCase()));
        });
        if (!matchesCol) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const priceA = typeof a.price === "number" ? a.price : parseFloat(String(a.price).replace(/[^0-9.]/g, ""));
      const priceB = typeof b.price === "number" ? b.price : parseFloat(String(b.price).replace(/[^0-9.]/g, ""));
      if (sortBy === "Price: Low to High") return priceA - priceB;
      if (sortBy === "Price: High to Low") return priceB - priceA;
      if (sortBy === "Newest") return String(b.id).localeCompare(String(a.id));
      return 0;
    });

  const handleAddToBag = (product: any) => {
    addItemToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image1,
    });
  };

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface">
      {/* TopNavBar */}
      <Navbar />

      {/* Quick View Modal Popup */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      <main>
        {/* Page Banner */}
        <section className="bg-milano-red py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <nav className="mb-3 flex flex-wrap items-center gap-2 font-label-bold text-lemon-chiffon/70 uppercase text-xs sm:text-sm tracking-widest">
              <Link className="hover:text-lemon-chiffon" href="/">Home</Link>
              <span className="text-lemon-chiffon/30">/</span>
              <Link className="hover:text-lemon-chiffon" href="/products">Shop</Link>
              <span className="text-lemon-chiffon/30">/</span>
              <span className="text-lemon-chiffon">
                {activeSearch ? `SEARCH: "${activeSearch}"` : selectedCategories.length > 0 ? selectedCategories.join(", ") : "All"}
              </span>
            </nav>
            <h1 className="font-display-xl text-3xl sm:text-4xl md:text-display-xl text-lemon-chiffon leading-none uppercase">
              {activeSearch ? `SEARCH RESULTS FOR: "${activeSearch}"` : selectedCategories.length > 0 ? `Collections / ${selectedCategories.join(" & ")}` : "Catalog / All Products"}
            </h1>
          </div>
        </section>

        {/* Filter & Sort Bar */}
        <div className="sticky top-[70px] sm:top-[84px] z-40 bg-lemon-chiffon border-b-2 border-on-surface px-4 sm:px-6 md:px-margin-desktop py-3 sm:py-4">
          <div className="max-w-container-max mx-auto flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Filter Toggle Button & Active Tags */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <button 
                onClick={() => {
                  setIsFilterDrawerOpen(true);
                  setIsFilterSidebarVisible((prev) => !prev);
                }}
                className={`flex items-center justify-center gap-2 font-label-bold uppercase border-2 border-on-surface px-4 sm:px-6 py-2 transition-all duration-150 text-xs sm:text-sm cursor-pointer ${
                  isFilterSidebarVisible || isFilterDrawerOpen
                    ? "bg-on-surface text-lemon-chiffon"
                    : "bg-lemon-chiffon text-on-surface hover:bg-on-surface hover:text-lemon-chiffon"
                }`}
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">tune</span>
                Filter Panel
              </button>

              {/* Active Filter & Search Chips */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {activeSearch && (
                  <span className="bg-milano-red text-lemon-chiffon px-2.5 sm:px-3 py-1 font-label-bold text-[10px] sm:text-xs uppercase flex items-center gap-1.5 border border-on-surface animate-fadeIn font-bold">
                    SEARCH: &quot;{activeSearch}&quot;
                    <Link href="/products" onClick={() => setActiveSearch("")} className="material-symbols-outlined text-xs hover:scale-125 transition-transform" title="Clear Search">
                      close
                    </Link>
                  </span>
                )}

                {inStockOnly && (
                  <span className="bg-emerald-700 text-lemon-chiffon px-2.5 sm:px-3 py-1 font-label-bold text-[10px] sm:text-xs uppercase flex items-center gap-1.5 border border-on-surface animate-fadeIn font-bold">
                    IN STOCK RADAR ONLY
                    <button onClick={() => setInStockOnly(false)} className="material-symbols-outlined text-xs hover:scale-125 transition-transform">close</button>
                  </span>
                )}

                {maxPrice < 500 && (
                  <span className="bg-milano-red text-lemon-chiffon px-2.5 sm:px-3 py-1 font-label-bold text-[10px] sm:text-xs uppercase flex items-center gap-1.5 border border-on-surface animate-fadeIn font-bold">
                    MAX PRICE: {formatPrice(maxPrice, currency)}
                    <button onClick={() => setMaxPrice(500)} className="material-symbols-outlined text-xs hover:scale-125 transition-transform">close</button>
                  </span>
                )}

                {selectedCategories.map((cat) => (
                  <span 
                    key={cat} 
                    className="bg-milano-red text-lemon-chiffon px-2.5 sm:px-3 py-1 font-label-bold text-[10px] sm:text-xs uppercase flex items-center gap-1.5 border border-on-surface animate-fadeIn"
                  >
                    {cat} 
                    <button 
                      onClick={() => removeCategory(cat)} 
                      className="material-symbols-outlined text-xs hover:scale-125 transition-transform" 
                      title={`Remove ${cat} filter`}
                    >
                      close
                    </button>
                  </span>
                ))}

                {selectedSizes.map((sz) => (
                  <span 
                    key={`size-${sz}`} 
                    className="bg-milano-red text-lemon-chiffon px-2.5 sm:px-3 py-1 font-label-bold text-[10px] sm:text-xs uppercase flex items-center gap-1.5 border border-on-surface animate-fadeIn"
                  >
                    SIZE: {sz} 
                    <button 
                      onClick={() => removeSize(sz)} 
                      className="material-symbols-outlined text-xs hover:scale-125 transition-transform" 
                      title={`Remove size ${sz} filter`}
                    >
                      close
                    </button>
                  </span>
                ))}

                {(activeSearch || selectedCategories.length > 0 || inStockOnly || maxPrice < 500 || selectedSizes.length > 0) && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-[11px] sm:text-xs font-label-bold uppercase underline text-milano-red hover:text-on-surface ml-1 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Sort & View Options */}
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-on-surface/10">
              <span className="font-label-bold uppercase text-on-surface/60 text-xs sm:text-sm">
                {filteredProducts.length} PRODUCTS
              </span>
              <div className="flex items-center gap-2 sm:gap-4 sm:border-l-2 sm:border-on-surface sm:pl-6">
                {/* Custom Styled Sort Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-1.5 font-label-bold uppercase border-2 border-on-surface px-3 sm:px-4 py-1.5 sm:py-2 bg-lemon-chiffon text-on-surface hover:bg-on-surface hover:text-lemon-chiffon transition-all text-[11px] sm:text-xs tracking-wider cursor-pointer"
                  >
                    <span>Sort: {sortBy.replace("Sort By: ", "")}</span>
                    <span className={`material-symbols-outlined text-sm sm:text-base transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}>
                      expand_more
                    </span>
                  </button>

                  {isSortOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsSortOpen(false)} 
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-on-surface text-lemon-chiffon border-2 border-on-surface shadow-2xl z-50 py-1 overflow-hidden animate-fadeIn">
                        {["Featured", "Price: Low to High", "Price: High to Low", "Newest"].map((option) => {
                          const isSelected = sortBy === option;
                          return (
                            <button
                              key={option}
                              onClick={() => {
                                setSortBy(option);
                                setIsSortOpen(false);
                              }}
                              className={`w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 font-label-bold text-[11px] sm:text-xs uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? "bg-milano-red text-lemon-chiffon font-bold" 
                                  : "hover:bg-milano-red/80 hover:text-lemon-chiffon text-lemon-chiffon"
                              }`}
                            >
                              <span>{option === "Featured" ? "Sort By: Featured" : option}</span>
                              {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* View Mode Toggle Buttons */}
                <div className="flex items-center gap-0.5 border-2 border-on-surface p-0.5 sm:p-1 bg-lemon-chiffon">
                  <button
                    onClick={() => setViewMode("grid2")}
                    className={`p-1.5 sm:p-2 flex items-center justify-center transition-all ${viewMode === "grid2" ? "bg-on-surface text-lemon-chiffon" : "text-on-surface/60 hover:text-on-surface hover:bg-on-surface/10"}`}
                    title="2-Column Grid"
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl">view_column</span>
                  </button>
                  <button
                    onClick={() => setViewMode("grid3")}
                    className={`p-1.5 sm:p-2 flex items-center justify-center transition-all ${viewMode === "grid3" ? "bg-on-surface text-lemon-chiffon" : "text-on-surface/60 hover:text-on-surface hover:bg-on-surface/10"}`}
                    title="3-Column Grid"
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl" style={{ fontVariationSettings: viewMode === "grid3" ? "'FILL' 1" : "'FILL' 0" }}>grid_view</span>
                  </button>
                  <button
                    onClick={() => setViewMode("grid4")}
                    className={`hidden sm:flex p-1.5 sm:p-2 items-center justify-center transition-all ${viewMode === "grid4" ? "bg-on-surface text-lemon-chiffon" : "text-on-surface/60 hover:text-on-surface hover:bg-on-surface/10"}`}
                    title="4-Column Grid"
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl">apps</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 sm:p-2 flex items-center justify-center transition-all ${viewMode === "list" ? "bg-on-surface text-lemon-chiffon" : "text-on-surface/60 hover:text-on-surface hover:bg-on-surface/10"}`}
                    title="List View"
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl" style={{ fontVariationSettings: viewMode === "list" ? "'FILL' 1" : "'FILL' 0" }}>view_agenda</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop py-6 sm:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Filters (Desktop) */}
          {isFilterSidebarVisible && (
            <aside className="hidden lg:block w-72 shrink-0 space-y-8 transition-all border-4 border-on-surface p-6 bg-surface shadow-[6px_6px_0px_0px_#a90e02]">
              {/* Filter 1: In-Stock Radar Toggle */}
              <div>
                <h3 className="font-headline-md uppercase mb-4 border-b-2 border-on-surface pb-2 text-milano-red flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">radar</span>
                  IN-STOCK RADAR
                </h3>
                <label className="flex items-center gap-3 cursor-pointer font-label-bold text-xs uppercase bg-lemon-chiffon p-3 border-2 border-on-surface">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-milano-red focus:ring-milano-red cursor-pointer"
                  />
                  <span>Show In-Stock Items Only</span>
                </label>
              </div>

              {/* Filter 2: Price Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-3 border-b-2 border-on-surface pb-2">
                  <h3 className="font-headline-md uppercase text-milano-red flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">payments</span>
                    PRICE CAP
                  </h3>
                  <span className="font-headline-md text-sm text-milano-red">{formatPrice(maxPrice, currency)}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-milano-red cursor-pointer"
                />
                <div className="flex justify-between font-label-bold text-[10px] opacity-60 uppercase mt-1">
                  <span>{formatPrice(50, currency)}</span>
                  <span>{formatPrice(500, currency)}</span>
                </div>
              </div>

              {/* Filter 3: Category */}
              <div>
                <h3 className="font-headline-md uppercase mb-4 border-b-2 border-on-surface pb-2 text-milano-red flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">category</span>
                  CATEGORY
                </h3>
                <ul className="space-y-3 font-body-md uppercase text-xs tracking-wide">
                  {availableCategories.map((cat) => (
                    <li key={cat}>
                      <label className="flex items-center gap-3 cursor-pointer hover:text-milano-red">
                        <input 
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="rounded-none border-2 border-on-surface text-milano-red focus:ring-milano-red cursor-pointer" 
                        />
                        {cat}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filter 4: Size */}
              <div>
                <h3 className="font-headline-md uppercase mb-4 border-b-2 border-on-surface pb-2 text-milano-red flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">straighten</span>
                  AVAILABLE SIZE
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button 
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className={`border-2 border-on-surface py-2 font-label-bold text-xs transition-colors cursor-pointer ${
                          isSelected 
                            ? "bg-on-surface text-lemon-chiffon" 
                            : "hover:bg-on-surface hover:text-lemon-chiffon bg-lemon-chiffon"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear All */}
              <button
                onClick={clearAllFilters}
                className="w-full py-3 bg-lemon-chiffon border-2 border-on-surface font-label-bold text-xs uppercase hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer"
              >
                RESET ALL FILTERS
              </button>
            </aside>
          )}

          {/* Product List / Grid */}
          <div className="flex-grow">
            {filteredProducts.length === 0 ? (
              <div className="border-4 border-on-surface p-8 sm:p-12 text-center bg-surface shadow-[8px_8px_0px_0px_#a90e02] my-4 sm:my-8">
                <span className="material-symbols-outlined text-5xl text-milano-red mb-2">filter_alt_off</span>
                <h3 className="font-headline-lg uppercase text-xl sm:text-2xl mb-3">No Products Match Filters</h3>
                <p className="font-body-md opacity-70 mb-6 text-sm">Try increasing your price cap or adjusting your category selection.</p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-milano-red text-lemon-chiffon font-headline-md py-3 px-8 uppercase hover:bg-on-surface transition-colors text-sm sm:text-base cursor-pointer border-2 border-on-surface"
                >
                  Reset All Filters & Search
                </button>
              </div>
            ) : viewMode !== "list" ? (
              <div className={`grid gap-3 sm:gap-6 gap-y-6 sm:gap-y-12 ${
                viewMode === "grid2" ? "grid-cols-2" :
                viewMode === "grid4" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" :
                "grid-cols-2 lg:grid-cols-3"
              }`}>
                {filteredProducts.map((product) => {
                  const stockNum = product.stock !== undefined ? Number(product.stock) : 50;
                  const isOut = stockNum === 0;
                  const isLow = stockNum > 0 && stockNum <= 10;

                  return (
                    <div key={product.id} className="product-card group relative flex flex-col">
                      <div className="relative aspect-[3/4] overflow-hidden bg-white mb-2 sm:mb-4 border-2 border-on-surface">
                        {/* Live Stock Radar Badge Overlay */}
                        <div className="absolute top-2 left-2 z-20">
                          {isOut ? (
                            <span className="bg-milano-red text-lemon-chiffon border border-on-surface font-label-bold text-[9px] sm:text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold">
                              SOLD OUT
                            </span>
                          ) : isLow ? (
                            <span className="bg-amber-400 text-on-surface border border-on-surface font-label-bold text-[9px] sm:text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold flex items-center gap-1">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-milano-red opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-milano-red"></span>
                              </span>
                              ONLY {stockNum} LEFT
                            </span>
                          ) : (
                            <span className="bg-on-surface/80 text-lemon-chiffon font-label-bold text-[9px] sm:text-[10px] px-2 py-0.5 uppercase tracking-wider">
                              IN STOCK ({stockNum})
                            </span>
                          )}
                        </div>

                        <Link className="block cursor-pointer relative w-full h-full z-10" href={`/product-detail?id=${encodeURIComponent(product.id)}`}>
                          <img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" alt={product.title} src={product.image1} />
                          <img className="hover-image absolute inset-0 object-cover w-full h-full opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110" alt={product.title} src={product.image2} />
                        </Link>
                        <button 
                          onClick={() => toggleFavorite(product)}
                          className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-7 h-7 sm:w-10 sm:h-10 border-2 border-on-surface flex items-center justify-center transition-colors cursor-pointer ${
                            favorites[product.id] ? "bg-milano-red text-lemon-chiffon" : "bg-lemon-chiffon text-on-surface hover:bg-milano-red hover:text-lemon-chiffon"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm sm:text-xl" style={{ fontVariationSettings: favorites[product.id] ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>

                        {/* Card Hover Action Buttons Overlay */}
                        <div className="product-card-overlay absolute bottom-0 left-0 w-full p-2 sm:p-3 bg-on-surface/90 backdrop-blur-sm z-20 transition-transform duration-300 sm:translate-y-full sm:group-hover:translate-y-0 space-y-2">
                          <button
                            type="button"
                            onClick={() => setQuickViewProduct(product)}
                            className="w-full bg-lemon-chiffon text-on-surface font-label-bold py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-wider hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer border border-on-surface flex items-center justify-center gap-1 font-bold"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            QUICK VIEW
                          </button>
                          <button 
                            disabled={isOut}
                            onClick={() => handleAddToBag(product)}
                            className="w-full bg-milano-red text-lemon-chiffon font-headline-md py-1.5 sm:py-2.5 text-[10px] sm:text-sm uppercase tracking-wider hover:bg-white hover:text-milano-red transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isOut ? "SOLD OUT" : "ADD TO BAG"}
                          </button>
                        </div>
                      </div>
                      <div className="border-b-2 border-on-surface pb-2 sm:pb-3">
                        <Link href={`/product-detail?id=${encodeURIComponent(product.id)}`} className="hover:text-milano-red transition-colors">
                          <h4 className="font-label-bold text-xs sm:text-lg uppercase leading-tight mb-1 truncate">{product.title}</h4>
                        </Link>
                        <div className="flex justify-between items-baseline">
                          <span className="text-milano-red font-headline-md text-xs sm:text-lg">
                            {formatPrice(product.price, currency)}
                          </span>
                          {product.colors && (
                            <div className="flex gap-1 sm:gap-2">
                              {product.colors.map((c: string, idx: number) => (
                                <div key={idx} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${c} ring-1 ring-offset-1 ring-on-surface cursor-pointer`}></div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List / Agenda View */
              <div className="grid grid-cols-1 gap-y-6 sm:gap-y-8">
                {filteredProducts.map((product) => {
                  const stockNum = product.stock !== undefined ? Number(product.stock) : 50;
                  const isOut = stockNum === 0;
                  const isLow = stockNum > 0 && stockNum <= 10;

                  return (
                    <div key={product.id} className="product-card group relative flex flex-col md:flex-row border-2 border-on-surface bg-surface overflow-hidden">
                      <div className="relative w-full md:w-72 shrink-0 aspect-[4/3] sm:aspect-[3/4] overflow-hidden bg-white border-b-2 md:border-b-0 md:border-r-2 border-on-surface">
                        <Link href={`/product-detail?id=${encodeURIComponent(product.id)}`} className="block cursor-pointer w-full h-full">
                          <img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" alt={product.title} src={product.image1} />
                        </Link>
                        <button 
                          onClick={() => toggleFavorite(product)}
                          className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 border-2 border-on-surface flex items-center justify-center transition-colors cursor-pointer ${
                            favorites[product.id] ? "bg-milano-red text-lemon-chiffon" : "bg-lemon-chiffon text-on-surface hover:bg-milano-red hover:text-lemon-chiffon"
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg sm:text-xl" style={{ fontVariationSettings: favorites[product.id] ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>
                      </div>
                      <div className="flex-grow p-4 sm:p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                            <span className="font-label-bold text-[11px] sm:text-xs uppercase tracking-widest text-milano-red">{product.category}</span>
                            <span className="text-milano-red font-headline-md text-xl sm:text-2xl">
                              {formatPrice(product.price, currency)}
                            </span>
                          </div>
                          <Link href={`/product-detail?id=${encodeURIComponent(product.id)}`}>
                            <h3 className="font-label-bold text-lg sm:text-2xl uppercase leading-tight mb-2 sm:mb-3 hover:text-milano-red transition-colors">{product.title}</h3>
                          </Link>
                          <p className="font-body-md text-on-surface/80 mb-4 sm:mb-6 text-xs sm:text-sm max-w-xl">{product.description}</p>
                          
                          {/* Live Stock Badge */}
                          <div className="mb-4">
                            <span className={`inline-block px-3 py-1 font-label-bold text-[10px] uppercase border ${
                              isOut ? "bg-milano-red text-lemon-chiffon border-milano-red" : isLow ? "bg-amber-400 text-on-surface font-bold border-on-surface animate-pulse" : "bg-lemon-chiffon text-on-surface border-on-surface"
                            }`}>
                              {isOut ? "SOLD OUT" : isLow ? `URGENT: ONLY ${stockNum} UNITS REMAINING` : `IN STOCK (${stockNum} AVAILABLE)`}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 pt-2">
                          <button
                            type="button"
                            onClick={() => setQuickViewProduct(product)}
                            className="border-2 border-on-surface bg-lemon-chiffon text-on-surface font-label-bold py-2.5 sm:py-3 px-4 uppercase text-xs sm:text-sm tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer flex items-center justify-center gap-1 font-bold"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                            QUICK VIEW
                          </button>
                          <button 
                            disabled={isOut}
                            onClick={() => handleAddToBag(product)}
                            className="bg-milano-red text-lemon-chiffon font-headline-md py-2.5 sm:py-3 px-6 sm:px-8 uppercase text-sm sm:text-base tracking-wider hover:bg-on-surface transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isOut ? "SOLD OUT" : "ADD TO BAG"}
                          </button>
                          <Link href={`/product-detail?id=${encodeURIComponent(product.id)}`} className="text-center border-2 border-on-surface text-on-surface font-headline-md py-2.5 sm:py-3 px-6 sm:px-8 uppercase text-sm sm:text-base tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors">
                            VIEW DETAILS
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-lemon-chiffon text-on-surface p-12 text-center font-headline-md uppercase">Loading Storefront Products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
