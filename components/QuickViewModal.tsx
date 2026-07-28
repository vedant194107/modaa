"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { addItemToCart } from "@/lib/cartHelper";
import { formatPrice, getActiveCurrency, CurrencyCode } from "@/lib/currencyHelper";

interface QuickViewModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeImage, setActiveImage] = useState<string>("");
  const [added, setAdded] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  useEffect(() => {
    setCurrency(getActiveCurrency());
    const handleCurr = (e: any) => setCurrency(e.detail || getActiveCurrency());
    window.addEventListener("currency-updated", handleCurr);
    return () => window.removeEventListener("currency-updated", handleCurr);
  }, []);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image1 || product.image || "");
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const stockNum = product.stock !== undefined ? Number(product.stock) : 50;
  const isOut = stockNum === 0;

  const handleAdd = () => {
    addItemToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      size: selectedSize,
      color: "Milano Red",
      image: product.image1 || product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-lemon-chiffon border-4 border-on-surface p-6 sm:p-8 shadow-[12px_12px_0px_0px_#a90e02] max-h-[90vh] overflow-y-auto z-10 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface hover:text-milano-red material-symbols-outlined text-2xl cursor-pointer"
        >
          close
        </button>

        {added && (
          <div className="bg-milano-red text-lemon-chiffon p-3 font-label-bold text-xs uppercase border-2 border-on-surface flex justify-between items-center animate-fadeIn">
            <span>✓ ADDED {product.title} (SIZE {selectedSize}) TO YOUR BAG!</span>
            <span className="material-symbols-outlined text-base">check_circle</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          {/* Left: Product Images */}
          <div className="sm:col-span-6 space-y-3">
            <div className="aspect-[3/4] border-2 border-on-surface bg-white overflow-hidden relative">
              <img
                src={activeImage || product.image1 || product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-on-surface text-lemon-chiffon font-label-bold text-[10px] uppercase px-2 py-0.5">
                {product.category}
              </span>
            </div>

            {/* Thumbnail switcher */}
            {(product.image2 || product.image1) && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveImage(product.image1 || product.image)}
                  className={`w-14 h-16 border-2 border-on-surface overflow-hidden ${
                    activeImage === (product.image1 || product.image) ? "ring-2 ring-milano-red" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={product.image1 || product.image} alt="Thumb 1" className="w-full h-full object-cover" />
                </button>
                {product.image2 && (
                  <button
                    type="button"
                    onClick={() => setActiveImage(product.image2)}
                    className={`w-14 h-16 border-2 border-on-surface overflow-hidden ${
                      activeImage === product.image2 ? "ring-2 ring-milano-red" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={product.image2} alt="Thumb 2" className="w-full h-full object-cover" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="sm:col-span-6 space-y-5">
            <div>
              <span className="font-label-bold text-xs uppercase text-milano-red font-bold block mb-1">
                QUICK VIEW ARCHIVE PREVIEW
              </span>
              <h2 className="font-display-xl text-2xl sm:text-3xl uppercase leading-none">{product.title}</h2>
              <span className="font-headline-md text-2xl text-milano-red block mt-2">
                {formatPrice(product.price, currency)}
              </span>
            </div>

            <p className="font-body-md text-xs opacity-80 leading-relaxed uppercase">
              {product.description || "Heavyweight technical construction with signature Milano Red archive detailing."}
            </p>

            {/* Stock Badge */}
            <div>
              <span className={`inline-block px-3 py-1 font-label-bold text-xs uppercase border ${
                isOut ? "bg-milano-red text-lemon-chiffon border-on-surface" : "bg-surface text-on-surface border-on-surface font-bold"
              }`}>
                {isOut ? "SOLD OUT" : `IN STOCK (${stockNum} UNITS)`}
              </span>
            </div>

            {/* Size Selector */}
            <div>
              <label className="font-label-bold text-xs uppercase block mb-1.5 opacity-70">
                SELECT SIZE: <strong className="text-milano-red">{selectedSize}</strong>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {["XS", "S", "M", "L", "XL"].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 border-2 border-on-surface font-label-bold text-xs transition-all duration-200 cursor-pointer ${
                      selectedSize === sz
                        ? "bg-on-surface text-lemon-chiffon font-bold shadow-[2.5px_2.5px_0px_0px_#a90e02]"
                        : "bg-surface text-on-surface hover:bg-milano-red hover:text-lemon-chiffon hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <button
                disabled={isOut}
                onClick={handleAdd}
                className="w-full py-3.5 bg-milano-red text-lemon-chiffon font-headline-md text-sm uppercase tracking-widest border-2 border-on-surface hover:bg-on-surface transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isOut ? "SOLD OUT" : "ADD TO BAG"}
              </button>

              <Link
                href={`/product-detail?id=${encodeURIComponent(product.id)}`}
                onClick={onClose}
                className="w-full py-2.5 bg-surface text-on-surface font-label-bold text-xs uppercase tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors border-2 border-on-surface text-center block"
              >
                VIEW FULL EDITORIAL DETAILS →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
