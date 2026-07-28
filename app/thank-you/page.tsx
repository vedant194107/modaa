"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { formatPrice, getActiveCurrency, CurrencyCode } from "@/lib/currencyHelper";

export default function ThankYouPage() {
  const [order, setOrder] = useState<any>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  useEffect(() => {
    setCurrency(getActiveCurrency());
    const handleCurr = (e: any) => setCurrency(e.detail || getActiveCurrency());
    window.addEventListener("currency-updated", handleCurr);
    return () => window.removeEventListener("currency-updated", handleCurr);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("the_drop_recent_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setOrder(parsed[0]);
        }
      } catch (e) {}
    }
  }, []);

  if (!order) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-lemon-chiffon">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="font-headline-md uppercase text-xl animate-pulse text-on-surface">Decrypting Order Details...</p>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shippingFee = subtotal >= 500 ? 0 : (subtotal > 0 ? 15 : 0);
  const discountAmount = Math.max(0, subtotal + shippingFee - order.total);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface">
      {/* TopNavBar */}
      <Navbar />
      
      <main className="min-h-screen max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop py-8 sm:py-12 md:py-16 overflow-hidden">
        
        {/* Hero Section */}
        <section className="text-center mb-8 sm:mb-16 relative">
          <div className="absolute -top-8 sm:-top-16 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none select-none">
            <span className="font-display-xl text-[100px] sm:text-[150px] md:text-[200px] leading-none whitespace-nowrap text-on-surface">SUCCESS</span>
          </div>
          <h1 className="font-display-xl text-4xl sm:text-5xl md:text-7xl text-milano-red mb-2 sm:mb-4 uppercase tracking-tighter drop-shadow-md">
            ORDER CONFIRMED
          </h1>
          <p className="font-headline-md text-sm sm:text-base md:text-lg text-on-surface/80 max-w-2xl mx-auto uppercase tracking-wider">
            YOUR SELECTION HAS BEEN REGISTERED INTO OUR SYSTEM.
          </p>
        </section>

        {/* Action Bar (Invoice & Support) */}
        <div className="flex justify-center gap-4 mb-12">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-on-surface text-lemon-chiffon font-label-bold uppercase py-2 px-6 hover:bg-milano-red transition-colors shadow-[4px_4px_0px_0px_#a90e02] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#a90e02]"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Download Invoice
          </button>
        </div>

        {/* Order Information Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left: Order Details */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="border-4 border-on-surface p-6 sm:p-8 bg-surface shadow-[6px_6px_0px_0px_#a90e02]">
              <div className="mb-6 border-b-2 border-on-surface/20 pb-4">
                <p className="font-label-bold text-xs uppercase opacity-60 mb-1">Order Number</p>
                <p className="font-headline-md text-2xl sm:text-3xl text-milano-red">{order.orderNumber}</p>
              </div>
              <div className="mb-6 border-b-2 border-on-surface/20 pb-4">
                <p className="font-label-bold text-xs uppercase opacity-60 mb-1">Date Placed</p>
                <p className="font-headline-md text-xl">{order.date}</p>
              </div>
              <div className="mb-6 border-b-2 border-on-surface/20 pb-4">
                <p className="font-label-bold text-xs uppercase opacity-60 mb-1">Estimated Arrival</p>
                <p className="font-headline-md text-xl">{order.statusText}</p>
              </div>
              <div>
                <p className="font-label-bold text-xs uppercase opacity-60 mb-2">Shipping Address</p>
                <div className="font-label-bold text-sm uppercase opacity-80 leading-relaxed">
                  <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                  <p>{order.shippingAddress?.line1}</p>
                  {order.shippingAddress?.line2 && <p>{order.shippingAddress?.line2}</p>}
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                  <p>{order.shippingAddress?.country}</p>
                  {order.shippingAddress?.phone && <p>{order.shippingAddress?.phone}</p>}
                </div>
              </div>
            </div>

            <div className="border-4 border-on-surface p-6 sm:p-8 bg-lemon-chiffon">
              <p className="font-headline-md text-lg uppercase border-b-2 border-on-surface pb-2 mb-4 text-milano-red">Next Steps</p>
              <ul className="font-label-bold text-xs sm:text-sm uppercase space-y-6">
                <li className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-milano-red text-2xl">mail</span>
                  <span className="leading-snug opacity-80 mt-1">A confirmation email has been sent to your inbox with full tracking details.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-milano-red text-2xl">package_2</span>
                  <span className="leading-snug opacity-80 mt-1">Your items are currently being prepared for expedited dispatch.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Order Summary Bento */}
          <div className="lg:col-span-8">
            <div className="border-4 border-on-surface bg-surface overflow-hidden shadow-[8px_8px_0px_0px_#a90e02]">
              <div className="p-6 sm:p-8 border-b-4 border-on-surface bg-milano-red text-lemon-chiffon">
                <h2 className="font-headline-lg text-2xl sm:text-3xl uppercase">Order Summary</h2>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center p-6 gap-6 border-b-2 border-on-surface/20 hover:bg-on-surface/5 transition-colors">
                    <div className="w-24 h-32 flex-shrink-0 border-2 border-on-surface bg-white overflow-hidden relative">
                      <img 
                        className="w-full h-full object-cover" 
                        alt={item.title} 
                        src={item.image}
                      />
                    </div>
                    <div className="flex-grow w-full">
                      <p className="font-headline-md text-lg uppercase leading-tight">{item.title}</p>
                      <p className="font-label-bold text-xs uppercase opacity-60 mt-2">
                        Size: {item.size || "M"} | Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto mt-4 sm:mt-0">
                      <p className="font-headline-md text-xl text-milano-red">
                        {formatPrice((item.price || 0) * (item.quantity || 1), currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 sm:p-8 bg-on-surface/5 space-y-3 font-label-bold uppercase text-sm sm:text-base border-t-4 border-on-surface">
                <div className="flex justify-between">
                  <span className="opacity-70">Subtotal</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                {discountAmount > 0.01 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Applied</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-70">Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee, currency)}</span>
                </div>
                <div className="flex justify-between font-headline-lg text-2xl sm:text-3xl border-t-2 border-on-surface pt-4 mt-4 text-milano-red">
                  <span>Grand Total</span>
                  <span>{formatPrice(order.total, currency)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link className="flex-1 text-center bg-on-surface text-lemon-chiffon py-4 px-8 uppercase font-headline-md hover:bg-milano-red transition-colors shadow-[4px_4px_0px_0px_#a90e02]" href="/products">
                Continue Shopping
              </Link>
              <Link className="flex-1 text-center bg-milano-red text-lemon-chiffon py-4 px-8 uppercase font-headline-md hover:bg-on-surface transition-colors shadow-[4px_4px_0px_0px_#a90e02]" href="/orders">
                View All Orders
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
