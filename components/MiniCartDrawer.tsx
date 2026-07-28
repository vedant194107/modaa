"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartDrawerItem {
  id: string;
  title: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
}

const initialCartItems: CartDrawerItem[] = [
  {
    id: "archive-hoodie-blk",
    title: "ARCHIVE HOODIE / BLK",
    price: 185,
    size: "L",
    color: "Black",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMnaLnndF_wvRegzRbqWvrUQZ470GWCkFs_iCTTyXU-zATGX5IOJl2yKSgAa8Q6s78IrzlaPcNWYJW37ImRj8wONeKwjOPKaiGXCyx9yJsrq4qhhXAD_P-VUV-XFcIF1cTCLyNQ88sKtK0vCXe4RQScs2AByo2wUa2tmhlX_CnQcpeRZDUGVIQkW6X7e1iXkCrv69P4cQg5HQUaA671PeJLB7OyRda-E2-Cdi7lF6QGGraPhIqluhCD3PKGeU0mQH_whyw3HOD7ro",
    quantity: 1,
  },
  {
    id: "raven-distressed-denim",
    title: "RAVEN DISTRESSED DENIM",
    price: 245,
    size: "M",
    color: "Milano Red Stitch",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
    quantity: 1,
  },
];

import { getActiveCartItems, saveActiveCartItems } from "@/lib/cartHelper";

interface MiniCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCartDrawer({ isOpen, onClose }: MiniCartDrawerProps) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartDrawerItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Load & Sync cart from user-scoped storage
  useEffect(() => {
    const syncCart = () => {
      const items = getActiveCartItems();
      setCartItems(items);
      setIsLoaded(true);
    };

    syncCart();

    const handleCartUpdated = (e: any) => {
      if (e.detail) {
        setCartItems(e.detail);
      } else {
        syncCart();
      }
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("auth-updated", syncCart);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("auth-updated", syncCart);
    };
  }, [isOpen]);

  // Save cart state when user modifies quantity or removes item inside drawer
  const saveCartState = (newItems: CartDrawerItem[]) => {
    setCartItems(newItems);
    saveActiveCartItems(newItems);
  };

  const updateQty = (id: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartDrawerItem[];
    saveCartState(updated);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCartState(updated);
  };

  const triggerClose = (callback?: () => void) => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      if (callback) callback();
    }, 280);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleShowCart = () => {
    triggerClose(() => router.push("/cart"));
  };

  const handleCheckout = () => {
    triggerClose(() => router.push("/checkout"));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => triggerClose()}
        className={`fixed inset-0 bg-black/65 z-[90] backdrop-blur-xs ${
          isClosing ? "animate-fade-out-backdrop" : "animate-fade-in-backdrop"
        }`}
      />

      {/* Mini Cart Drawer Slide-out Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-lemon-chiffon text-on-surface z-[100] shadow-2xl flex flex-col justify-between border-l-2 border-on-surface ${
          isClosing ? "animate-slide-drawer-out" : "animate-slide-drawer"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b-2 border-on-surface bg-surface flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-display-xl text-xl sm:text-2xl text-milano-red tracking-tighter">THE DROP</span>
              <span className="text-on-surface/40 text-sm font-bold">/</span>
              <h2 className="font-display-xl text-xl sm:text-2xl uppercase tracking-tight text-on-surface">YOUR BAG</h2>
            </div>
            <span className="font-label-bold text-[11px] sm:text-xs uppercase text-milano-red tracking-wider block">
              {totalItems} {totalItems === 1 ? "ITEM" : "ITEMS"} IN CART
            </span>
          </div>
          <button
            onClick={() => triggerClose()}
            className="w-10 h-10 border-2 border-on-surface flex items-center justify-center hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer"
            aria-label="Close Mini Cart"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-milano-red text-lemon-chiffon px-6 py-2.5 font-label-bold text-xs uppercase tracking-wider text-center">
          {subtotal >= 500
            ? "🎉 UNLOCKED COMPLIMENTARY EXPRESS SHIPPING"
            : `ADD $${(500 - subtotal).toFixed(2)} MORE FOR FREE EXPRESS SHIPPING`}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="py-12 sm:py-16 text-center max-w-sm mx-auto">
              <span className="material-symbols-outlined text-6xl text-on-surface/30 mb-4">shopping_bag</span>
              <h3 className="font-headline-lg text-2xl sm:text-3xl uppercase mb-2">YOUR BAG IS EMPTY</h3>
              <p className="font-body-md text-xs sm:text-sm opacity-70 mb-8">Explore our archive and add pieces to your cart.</p>
              
              <div className="space-y-3">
                {/* SHOW CART (FULL BAG) BUTTON */}
                <button
                  onClick={handleShowCart}
                  className="w-full bg-on-surface text-lemon-chiffon font-headline-md py-3.5 px-6 uppercase text-center tracking-wider hover:bg-milano-red transition-colors flex items-center justify-center gap-2 cursor-pointer border-2 border-on-surface shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">shopping_cart</span>
                  SHOW CART (FULL BAG)
                </button>

                {/* CONTINUE SHOPPING BUTTON */}
                <button
                  onClick={() => triggerClose(() => router.push("/products"))}
                  className="w-full bg-transparent border-2 border-on-surface text-on-surface font-headline-md py-3 px-6 uppercase text-center tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border-2 border-on-surface bg-surface shadow-sm animate-mini-cart-item relative"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-24 border-2 border-on-surface bg-white shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-label-bold text-sm sm:text-base uppercase leading-tight pr-6">{item.title}</h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-on-surface/50 hover:text-milano-red transition-colors p-1"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                    <p className="font-label-bold text-[11px] text-on-surface/60 uppercase mt-1">
                      SIZE: {item.size} | COLOR: {item.color}
                    </p>
                  </div>

                  {/* Quantity controls & Subtotal */}
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-on-surface/10">
                    <div className="flex items-center border border-on-surface bg-lemon-chiffon">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="px-2.5 py-0.5 text-xs font-bold hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-label-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="px-2.5 py-0.5 text-xs font-bold hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-headline-md text-milano-red text-base">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Subtotal & Actions */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t-2 border-on-surface bg-surface space-y-4">
            <div className="flex justify-between items-baseline font-label-bold uppercase">
              <span className="text-sm">SUBTOTAL</span>
              <span className="text-2xl font-headline-md text-milano-red">${subtotal.toFixed(2)}</span>
            </div>
            <p className="font-body-md text-[11px] opacity-60 uppercase">Taxes & shipping calculated at checkout.</p>

            <div className="space-y-2.5 pt-2">
              {/* SHOW CART (VIEW FULL CART) BUTTON */}
              <button
                onClick={handleShowCart}
                className="w-full bg-on-surface text-lemon-chiffon font-headline-md py-3.5 px-6 uppercase text-center tracking-wider hover:bg-milano-red transition-colors flex items-center justify-center gap-2 cursor-pointer border-2 border-on-surface"
              >
                <span className="material-symbols-outlined text-lg">shopping_cart</span>
                SHOW CART (FULL BAG)
              </button>

              {/* CHECKOUT BUTTON */}
              <button
                onClick={handleCheckout}
                className="w-full bg-milano-red text-lemon-chiffon font-headline-md py-3.5 px-6 uppercase text-center tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer border-2 border-on-surface"
              >
                PROCEED TO CHECKOUT
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
