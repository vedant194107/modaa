"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import MiniCartDrawer from "@/components/MiniCartDrawer";
import CartDrawer from "@/components/CartDrawer";
import { getAuthUser, UserSession } from "@/lib/authHelper";
import { getActiveCartItems } from "@/lib/cartHelper";
import { getActiveCurrency, setActiveCurrency, CURRENCIES, CurrencyCode } from "@/lib/currencyHelper";

interface SearchProductResult {
  id: string;
  title: string;
  category: string;
  price: number | string;
  image1: string;
  stock?: number;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchClosing, setIsSearchClosing] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<SearchProductResult[]>([]);
  const [searchResults, setSearchResults] = useState<SearchProductResult[]>([]);
  const [cartCount, setCartCount] = useState<number>(2);
  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>("USD");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const quickSearchTags = ["DENIM", "HOODIES", "OUTERWEAR", "CARGO", "PANTS", "ACCESSORIES"];

  useEffect(() => {
    setCurrentCurrency(getActiveCurrency());
    const handleCurrencyUpdate = (e: any) => {
      setCurrentCurrency(e.detail || getActiveCurrency());
    };
    window.addEventListener("currency-updated", handleCurrencyUpdate);
    return () => window.removeEventListener("currency-updated", handleCurrencyUpdate);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsSearchClosing(false);
    setIsMiniCartOpen(false);
  }, [pathname]);

  
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=dark-ambient-drone-99443.mp3");
      audio.loop = true;
      audio.volume = 0.2;
      audioRef.current = audio;
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser", e));
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };


  const toggleSearch = () => {
    if (isSearchOpen) {
      setIsSearchClosing(true);
      setTimeout(() => {
        setIsSearchOpen(false);
        setIsSearchClosing(false);
      }, 240);
    } else {
      setIsSearchOpen(true);
      setIsSearchClosing(false);
    }
  };

  const closeSearch = () => {
    if (isSearchOpen) {
      setIsSearchClosing(true);
      setTimeout(() => {
        setIsSearchOpen(false);
        setIsSearchClosing(false);
      }, 240);
    }
  };

  // Fetch product catalog for instant search auto-complete
  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setAllProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  // Filter products live as searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.trim().toLowerCase();
    const matches = allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
    setSearchResults(matches);
  }, [searchQuery, allProducts]);

  // Global event listener to open mini-cart drawer from anywhere
  useEffect(() => {
    setAuthUser(getAuthUser());
    const handleAuthUpdated = () => setAuthUser(getAuthUser());
    window.addEventListener("auth-updated", handleAuthUpdated);

    const handleOpenMiniCart = () => setIsMiniCartOpen(true);
    window.addEventListener("open-mini-cart", handleOpenMiniCart);
    return () => {
      window.removeEventListener("auth-updated", handleAuthUpdated);
      window.removeEventListener("open-mini-cart", handleOpenMiniCart);
    };
  }, []);

  // Sync cart count from getActiveCartItems and cart-updated/auth-updated events
  useEffect(() => {
    const updateCount = () => {
      const items = getActiveCartItems();
      const total = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    };

    updateCount();

    const handleCartUpdated = (e: any) => {
      if (e.detail) {
        const total = e.detail.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      } else {
        updateCount();
      }
    };

    const handleAuthUpdated = () => {
      updateCount();
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("auth-updated", handleAuthUpdated);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("auth-updated", handleAuthUpdated);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    closeSearch();
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/products?search=${encodeURIComponent(tag)}`);
    closeSearch();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "New Arrivals", href: "/summer-sale" },
    { name: "Journal", href: "/journal" },
    { name: "About", href: "/our-story" },
  ];

  return (
    <>
      <nav className="sticky top-0 w-full z-50 bg-surface/95 backdrop-blur-md border-b-2 border-on-surface">
        <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop py-4 sm:py-5 max-w-container-max mx-auto">
          {/* Left: Mobile Hamburger & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-8">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-1.5 text-on-surface hover:text-primary transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>

            <Link className="font-display-xl text-2xl sm:text-headline-md tracking-tighter text-primary" href="/">
              THE DROP
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.filter((l) => l.name !== "Home").map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-headline-md text-xl tracking-wide uppercase transition-colors active:scale-95 ${
                      isActive
                        ? "text-primary font-bold border-b-2 border-primary pb-0.5"
                        : "text-on-surface hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Icons: Currency Switcher, Search, Account, Cart */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Multi-Currency Switcher Dropdown */}
            <button 
              onClick={toggleAudio}
              className="hidden sm:flex items-center gap-1 font-label-bold text-[10px] sm:text-xs uppercase border-2 border-on-surface bg-surface-container text-on-surface px-2 py-1 cursor-pointer tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors mr-2"
              aria-label="Toggle Audio"
            >
              SOUND [{isAudioPlaying ? 'ON' : 'OFF'}]
            </button>

            <select
              value={currentCurrency}
              onChange={(e) => setActiveCurrency(e.target.value as CurrencyCode)}
              className="bg-lemon-chiffon text-on-surface font-label-bold text-[10px] sm:text-xs uppercase border-2 border-on-surface px-2 py-1 cursor-pointer focus:outline-none tracking-wider"
              aria-label="Select Currency"
            >
              {Object.values(CURRENCIES).map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>

            <button 
              onClick={toggleSearch}
              className="material-symbols-outlined text-2xl text-on-surface hover:text-primary transition-colors active:scale-95 cursor-pointer"
              aria-label="Search"
            >
              {isSearchOpen && !isSearchClosing ? "close" : "search"}
            </button>

            {authUser && authUser.role === "Admin" && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1 bg-milano-red text-lemon-chiffon px-2.5 py-1 font-label-bold text-[10px] uppercase tracking-wider border border-on-surface hover:bg-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
                ADMIN
              </Link>
            )}

            <Link href={authUser ? "/account" : "/login"} className="relative active:scale-95 transition-transform" aria-label="Account">
              <span className="material-symbols-outlined text-2xl text-on-surface hover:text-primary">person</span>
            </Link>

            {/* Cart Icon Button triggers Mini-Cart Drawer */}
            <button 
              onClick={() => setIsMiniCartOpen(true)}
              className="relative active:scale-95 transition-transform cursor-pointer" 
              aria-label="Open Mini Cart"
            >
              <span className="material-symbols-outlined text-2xl text-on-surface hover:text-primary">shopping_bag</span>
              <span className="absolute -top-1 -right-1.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Slide-Down Interactive Live Search HUD Overlay with Open & Close Animations */}
        {isSearchOpen && (
          <div className={`border-t-4 border-milano-red bg-lemon-chiffon px-4 sm:px-margin-desktop py-6 relative shadow-[0_12px_24px_rgba(0,0,0,0.25)] border-b-4 border-on-surface z-50 ${
            isSearchClosing ? "animate-search-close" : "animate-search-open"
          }`}>
            <div className="max-w-container-max mx-auto space-y-4">
              
              {/* Search Input Form */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 border-b-2 border-on-surface pb-3">
                <span className="material-symbols-outlined text-milano-red text-3xl">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="TYPE DENIM, HOODIES, CARGO... AND PRESS ENTER"
                  className="w-full bg-transparent border-none text-on-surface font-headline-md placeholder:text-on-surface/50 text-base sm:text-xl focus:outline-none uppercase tracking-wide"
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="material-symbols-outlined text-on-surface/60 hover:text-milano-red text-2xl cursor-pointer"
                  >
                    cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface shrink-0 hidden sm:block"
                >
                  SEARCH STOREFRONT
                </button>
              </form>

              {/* Quick Suggestion Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-bold text-[10px] uppercase opacity-50 tracking-wider">TRENDING SEARCHES:</span>
                {quickSearchTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className="px-2.5 py-1 bg-surface border border-on-surface font-label-bold text-[10px] uppercase hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Instant Live Results Cards Dropdown */}
              {searchQuery.trim() && (
                <div className="border-4 border-on-surface bg-surface p-4 sm:p-6 shadow-[8px_8px_0px_0px_#a90e02] max-h-96 overflow-y-auto space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-on-surface pb-3">
                    <span className="font-label-bold text-xs uppercase tracking-wider text-milano-red flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-milano-red animate-ping"></span>
                      MATCHING ARCHIVE PIECES ({searchResults.length})
                    </span>
                    <span className="font-label-bold text-[10px] uppercase opacity-60">PRESS ENTER OR CLICK TO VIEW PRODUCT</span>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="py-8 text-center space-y-2">
                      <span className="material-symbols-outlined text-4xl text-milano-red">search_off</span>
                      <p className="font-headline-md text-base uppercase">No items found for &quot;{searchQuery}&quot;</p>
                      <p className="font-body-md text-xs opacity-70 uppercase">Try searching for Denim, Outerwear, Hoodies or Pants</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.slice(0, 6).map((prod) => {
                        const stock = prod.stock !== undefined ? Number(prod.stock) : 50;
                        const priceStr = typeof prod.price === "number" ? `$${prod.price.toFixed(2)}` : String(prod.price).startsWith("$") ? prod.price : `$${prod.price}`;

                        return (
                          <Link
                            key={prod.id}
                            href={`/product-detail?id=${encodeURIComponent(prod.id)}`}
                            onClick={closeSearch}
                            className="border-2 border-on-surface bg-lemon-chiffon p-3 flex gap-3 hover:bg-on-surface hover:text-lemon-chiffon transition-colors group cursor-pointer"
                          >
                            <div className="w-16 h-20 bg-white border border-on-surface overflow-hidden flex-shrink-0 relative">
                              <img src={prod.image1} alt={prod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <span className="font-label-bold text-[9px] uppercase tracking-wider text-milano-red group-hover:text-amber-300 block">
                                  {prod.category}
                                </span>
                                <h4 className="font-headline-md text-xs sm:text-sm uppercase leading-tight line-clamp-2 mt-0.5">
                                  {prod.title}
                                </h4>
                              </div>

                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-on-surface/20">
                                <span className="font-headline-md text-sm text-milano-red group-hover:text-white font-bold">
                                  {priceStr}
                                </span>
                                <span className={`font-label-bold text-[8px] uppercase px-1.5 py-0.5 border ${
                                  stock === 0 ? "bg-milano-red text-lemon-chiffon" : stock <= 10 ? "bg-amber-400 text-on-surface font-bold" : "bg-on-surface text-lemon-chiffon"
                                }`}>
                                  {stock === 0 ? "SOLD OUT" : stock <= 10 ? `ONLY ${stock} LEFT` : "IN STOCK"}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="pt-3 border-t-2 border-on-surface">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full py-3 bg-milano-red text-lemon-chiffon font-headline-md text-xs sm:text-sm uppercase tracking-widest text-center hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface block"
                      >
                        SEE ALL {searchResults.length} RESULTS ON STOREFRONT PAGE →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Slide-Out Mobile Navigation Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-on-surface text-lemon-chiffon z-[100] transition-transform duration-300 ease-in-out shadow-2xl flex flex-col justify-between p-6 sm:p-8 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Mobile Drawer Header */}
          <div className="flex justify-between items-center mb-8 border-b border-surface/20 pb-4">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display-xl text-3xl text-primary-fixed tracking-tighter"
            >
              THE DROP
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="material-symbols-outlined text-3xl text-lemon-chiffon hover:text-primary-fixed transition-colors cursor-pointer"
            >
              close
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4 mb-8">
            <span className="font-label-bold text-xs uppercase text-primary-fixed tracking-widest block mb-2 opacity-60">
              Menu Navigation
            </span>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between font-display-xl text-3xl sm:text-4xl uppercase tracking-wide py-2 border-b border-surface/10 transition-colors ${
                    isActive
                      ? "text-primary-fixed font-bold pl-2 border-l-4 border-l-primary-fixed"
                      : "text-lemon-chiffon hover:text-primary-fixed hover:pl-2"
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="material-symbols-outlined text-xl opacity-40">arrow_forward</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Drawer Footer Info */}
        <div className="border-t border-surface/20 pt-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-label-bold text-lemon-chiffon/70 uppercase">
            <span>Archive Release 004/24</span>
            <span className="text-primary-fixed">Active</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 border border-surface/30 p-2.5 text-xs font-label-bold uppercase hover:bg-primary text-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-base">person</span>
              Account
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMiniCartOpen(true);
              }}
              className="flex items-center gap-2 bg-primary text-white p-2.5 text-xs font-label-bold uppercase hover:bg-white hover:text-on-surface text-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">shopping_bag</span>
              Bag ({cartCount})
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop Overlay when Mobile Drawer is Open */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-[90] animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Mini Cart Drawer Component */}
      <CartDrawer isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
    </>
  );
}
