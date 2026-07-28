"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCart, updateCartQuantity, removeFromCart, getCartTotal, CartItem } from "@/lib/cartHelper";
import { formatPrice, getActiveCurrency, CurrencyCode } from "@/lib/currencyHelper";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFlat, setDiscountFlat] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    setCurrency(getActiveCurrency());
    const handleCurr = (e: any) => setCurrency(e.detail || getActiveCurrency());
    window.addEventListener("currency-updated", handleCurr);
    return () => window.removeEventListener("currency-updated", handleCurr);
  }, []);

  useEffect(() => {
    setItems(getCart());
    const handleCartUpdate = () => setItems(getCart());
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  if (!isOpen) return null;

  const subtotal = getCartTotal();
  let discountAmount = 0;
  if (discountPercent > 0) {
    discountAmount = (subtotal * discountPercent) / 100;
  } else if (discountFlat > 0) {
    discountAmount = Math.min(subtotal, discountFlat);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const freeShippingThreshold = 300;
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoMsg("");
    setPromoError("");

    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "VIP20") {
      setDiscountPercent(20);
      setDiscountFlat(0);
      setPromoMsg("✓ PROMO CODE VIP20 APPLIED (20% OFF)!");
    } else if (code === "WELCOME50") {
      setDiscountFlat(50);
      setDiscountPercent(0);
      setPromoMsg("✓ PROMO CODE WELCOME50 APPLIED ($50 FLAT OFF)!");
    } else {
      fetch("/api/admin/coupons")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.coupons)) {
            const found = data.coupons.find((c: any) => c.code.toUpperCase() === code);
            if (found) {
              if (subtotal < (found.min_spend || 0)) {
                setPromoError(`MINIMUM SPEND OF ${formatPrice(found.min_spend, currency)} REQUIRED FOR THIS CODE.`);
              } else if (found.type === "PERCENTAGE") {
                setDiscountPercent(found.value);
                setDiscountFlat(0);
                setPromoMsg(`✓ PROMO CODE ${found.code} APPLIED (${found.value}% OFF)!`);
              } else {
                setDiscountFlat(found.value);
                setDiscountPercent(0);
                setPromoMsg(`✓ PROMO CODE ${found.code} APPLIED (${formatPrice(found.value, currency)} FLAT OFF)!`);
              }
            } else {
              setPromoError("INVALID PROMO CODE. TRY 'VIP20' OR 'WELCOME50'.");
            }
          } else {
            setPromoError("INVALID PROMO CODE. TRY 'VIP20' OR 'WELCOME50'.");
          }
        })
        .catch(() => setPromoError("INVALID PROMO CODE."));
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-lemon-chiffon border-l-4 border-on-surface h-full flex flex-col justify-between z-10 shadow-[-12px_0px_0px_0px_#a90e02] animate-slideInRight">
        {/* Header */}
        <div className="p-6 border-b-2 border-on-surface flex justify-between items-center bg-surface">
          <div>
            <span className="font-label-bold text-[10px] uppercase text-milano-red tracking-widest font-bold block">EDITORIAL BAG</span>
            <h2 className="font-display-xl text-2xl uppercase">YOUR SHOPPING BAG ({items.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-2xl hover:text-milano-red cursor-pointer"
          >
            close
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-surface px-6 py-3 border-b-2 border-on-surface space-y-1.5">
          <div className="flex justify-between font-label-bold text-xs uppercase">
            <span>
              {subtotal >= freeShippingThreshold ? (
                <span className="text-green-700 font-bold">✓ CONGRATS! FREE EXPRESS SHIPPING UNLOCKED</span>
              ) : (
                <span>ADD <strong className="text-milano-red">{formatPrice(amountNeededForFreeShipping, currency)}</strong> FOR FREE SHIPPING</span>
              )}
            </span>
            <span className="text-milano-red font-bold">{Math.round(shippingProgress)}%</span>
          </div>
          <div className="w-full h-2.5 bg-lemon-chiffon border border-on-surface overflow-hidden">
            <div
              className="h-full bg-milano-red transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-on-surface/20">
          {items.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
              <span className="material-symbols-outlined text-5xl text-on-surface/30">shopping_bag</span>
              <p className="font-display-xl text-xl uppercase">YOUR BAG IS EMPTY</p>
              <p className="font-label-bold text-xs uppercase text-on-surface/60">Discover new arrivals from the archive</p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-2 px-6 py-3 bg-milano-red text-lemon-chiffon font-headline-md text-xs uppercase tracking-widest border-2 border-on-surface hover:bg-on-surface transition-colors"
              >
                BROWSE CATALOG
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size || "M"}`} className="pt-4 first:pt-0 flex gap-4 items-start">
                <img src={item.image} alt={item.title} className="w-20 h-24 object-cover border-2 border-on-surface bg-white shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-headline-md text-sm uppercase leading-tight truncate">{item.title}</h4>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="material-symbols-outlined text-on-surface/40 hover:text-milano-red text-base cursor-pointer"
                        title="Remove Item"
                      >
                        delete
                      </button>
                    </div>
                    {item.size && (
                      <span className="font-label-bold text-[10px] uppercase text-on-surface/60 block mt-0.5">SIZE: {item.size}</span>
                    )}
                    <span className="font-headline-md text-sm text-milano-red font-bold block mt-1">
                      {formatPrice(item.price, currency)}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex border-2 border-on-surface bg-surface text-xs font-label-bold">
                      <button
                        onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1, item.size)}
                        className="px-2 py-0.5 hover:bg-milano-red hover:text-lemon-chiffon border-r border-on-surface cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1, item.size)}
                        className="px-2 py-0.5 hover:bg-milano-red hover:text-lemon-chiffon border-l border-on-surface cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout CTAs */}
        {items.length > 0 && (
          <div className="p-6 border-t-4 border-on-surface bg-surface space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="PROMO CODE (e.g. VIP20)"
                  className="flex-1 bg-lemon-chiffon border-2 border-on-surface p-2.5 font-label-bold text-xs uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-on-surface text-lemon-chiffon font-headline-md text-xs uppercase tracking-wider hover:bg-milano-red transition-colors border-2 border-on-surface cursor-pointer"
                >
                  APPLY
                </button>
              </div>
              {promoMsg && <p className="font-label-bold text-[10px] text-green-700 uppercase font-bold">{promoMsg}</p>}
              {promoError && <p className="font-label-bold text-[10px] text-milano-red uppercase font-bold">{promoError}</p>}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 font-label-bold text-xs uppercase border-t border-on-surface/20 pt-3">
              <div className="flex justify-between">
                <span className="opacity-70">BAG SUBTOTAL</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-milano-red font-bold">
                  <span>PROMO DISCOUNT</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between font-headline-md text-lg text-on-surface pt-2 border-t-2 border-on-surface">
                <span>TOTAL ESTIMATE</span>
                <span className="text-milano-red">{formatPrice(finalTotal, currency)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-4 bg-milano-red text-lemon-chiffon font-headline-md text-sm uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface text-center block cursor-pointer"
              >
                PROCEED TO CHECKOUT →
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full py-2.5 bg-lemon-chiffon text-on-surface font-label-bold text-xs uppercase tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors border-2 border-on-surface text-center block"
              >
                VIEW DETAILED SHOPPING CART
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
