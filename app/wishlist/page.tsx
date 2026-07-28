"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getWishlist, toggleWishlistItem, WishlistItem } from "@/lib/wishlistHelper";
import { addItemToCart } from "@/lib/cartHelper";
import { formatPrice, getActiveCurrency, CurrencyCode } from "@/lib/currencyHelper";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  useEffect(() => {
    setCurrency(getActiveCurrency());
    const handleCurr = (e: any) => setCurrency(e.detail || getActiveCurrency());
    window.addEventListener("currency-updated", handleCurr);
    return () => window.removeEventListener("currency-updated", handleCurr);
  }, []);

  useEffect(() => {
    const items = getWishlist();
    setWishlist(items);
    setWishlistCount(items.length);

    const handleUpdate = (e: any) => {
      const updated = e.detail || getWishlist();
      setWishlist(updated);
      setWishlistCount(updated.length);
    };
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => window.removeEventListener("wishlist-updated", handleUpdate);
  }, []);

  const handleRemove = (item: WishlistItem) => {
    toggleWishlistItem(item);
  };

  const handleMoveToBag = (item: WishlistItem) => {
    addItemToCart({
      id: item.id,
      title: item.title,
      price: typeof item.price === "string" ? parseFloat(item.price.replace(/[^0-9.]/g, "")) : item.price,
      image: item.image,
    });
    toggleWishlistItem(item);
  };

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface">
      <Navbar />

      <main className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-start">

          {/* ── Account Sidebar ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <h2 className="font-display-xl text-3xl sm:text-4xl uppercase mb-6 sm:mb-8">My Account</h2>
            <nav className="flex flex-col gap-3">
              <Link
                className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors"
                href="/account"
              >
                <span className="font-label-bold uppercase text-on-surface text-sm">Recent Orders</span>
                <span className="material-symbols-outlined text-on-surface opacity-0 group-hover:opacity-100 transition-opacity text-lg">arrow_forward</span>
              </Link>

              {/* Active: Wishlist */}
              <Link
                className="group flex items-center justify-between py-3 border-b-2 border-milano-red transition-colors"
                href="/wishlist"
              >
                <span className="font-label-bold uppercase text-milano-red text-sm">Wishlist</span>
                <div className="flex items-center gap-2">
                  {wishlistCount > 0 && (
                    <span className="bg-milano-red text-lemon-chiffon font-label-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="material-symbols-outlined text-milano-red text-lg">arrow_forward</span>
                </div>
              </Link>

              <Link
                className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors"
                href="/addresses"
              >
                <span className="font-label-bold uppercase text-on-surface text-sm">Addresses</span>
                <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
              </Link>

              <Link
                className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors"
                href="/settings"
              >
                <span className="font-label-bold uppercase text-on-surface text-sm">Settings</span>
                <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
              </Link>

              <Link className="group flex items-center justify-between py-3 mt-6" href="#">
                <span className="font-label-bold uppercase text-on-surface/50 text-sm">Log Out</span>
                <span className="material-symbols-outlined text-on-surface/50 text-lg">logout</span>
              </Link>
            </nav>
          </aside>

          {/* ── Wishlist Content ── */}
          <section className="flex-1 w-full">
            {/* Section header */}
            <div className="flex justify-between items-end mb-6 border-b-2 border-on-surface pb-4">
              <h1 className="font-display-xl text-2xl sm:text-3xl uppercase">Wishlist</h1>
              <span className="font-label-bold text-xs uppercase text-on-surface/60 tracking-widest">
                {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"} Saved
              </span>
            </div>

            {/* Items or empty state */}
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface/20">favorite</span>
                <div>
                  <p className="font-display-xl text-xl uppercase mb-2">Your wishlist is empty</p>
                  <p className="font-label-bold text-sm text-on-surface/60 uppercase tracking-wider">
                    Browse the collection and hit ♥ to save pieces
                  </p>
                </div>
                <Link
                  href="/products"
                  className="mt-4 px-8 py-4 bg-on-surface text-lemon-chiffon font-headline-md text-sm uppercase tracking-widest hover:bg-milano-red transition-colors border-2 border-on-surface"
                >
                  Browse The Drop
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="group relative flex flex-col border-2 border-on-surface bg-surface overflow-hidden">
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-white">
                        <Link href={item.href || "/product-detail"}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </Link>

                        {/* Remove button */}
                        <button
                          onClick={() => handleRemove(item)}
                          className="absolute top-3 right-3 w-9 h-9 bg-milano-red text-lemon-chiffon flex items-center justify-center border-2 border-on-surface hover:bg-on-surface transition-colors z-10"
                          title="Remove from Wishlist"
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        </button>

                        {/* Move to Bag hover overlay */}
                        <div className="absolute bottom-0 left-0 w-full bg-on-surface/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 p-2 sm:p-3">
                          <button
                            onClick={() => handleMoveToBag(item)}
                            className="w-full bg-milano-red text-lemon-chiffon font-headline-md py-2 text-xs sm:text-sm uppercase tracking-wider hover:bg-white hover:text-milano-red transition-colors cursor-pointer"
                          >
                            Move to Bag
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3 border-t-2 border-on-surface flex flex-col gap-1">
                        <h3 className="font-label-bold text-xs sm:text-sm uppercase leading-tight truncate">{item.title}</h3>
                        <div className="flex justify-between items-center">
                          <span className="font-headline-md text-xs sm:text-base text-milano-red">
                            {typeof item.price === "number" ? formatPrice(item.price, currency) : formatPrice(parseFloat(String(item.price).replace(/[^0-9.]/g, '')), currency)}
                          </span>
                          <button
                            onClick={() => handleMoveToBag(item)}
                            className="text-[9px] sm:text-[10px] font-label-bold uppercase tracking-wider text-on-surface/60 hover:text-milano-red transition-colors border border-on-surface/30 px-2 py-1 hover:border-milano-red"
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-on-surface pt-8">
                  <Link
                    href="/products"
                    className="font-label-bold text-sm uppercase tracking-widest text-on-surface/60 hover:text-milano-red transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => {
                      wishlist.forEach((item) => addItemToCart({
                        id: item.id,
                        title: item.title,
                        price: typeof item.price === "string"
                          ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
                          : item.price,
                        image: item.image,
                      }));
                      wishlist.forEach((item) => toggleWishlistItem(item));
                    }}
                    className="px-8 py-4 bg-milano-red text-lemon-chiffon font-headline-md text-sm uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer"
                  >
                    Move All to Bag ({wishlist.length})
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
