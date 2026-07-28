"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { getAuthUser, UserSession } from "@/lib/authHelper";
import { getActiveCartItems, saveActiveCartItems } from "@/lib/cartHelper";

interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

const defaultAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    name: "Vedant Dayala",
    line1: "A-701 Brown stone",
    line2: "M.G. Road",
    city: "Ahmedabad",
    state: "Gujarat",
    zip: "382350",
    country: "India",
    isDefault: true,
  },
];

const defaultCheckoutCart = [
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

export default function CheckoutPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Promo Code / Coupon State
  const [promoInput, setPromoInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [promoError, setPromoError] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    setAuthUser(user);

    const handleAuth = () => {
      const u = getAuthUser();
      if (!u) {
        router.push("/login?redirect=/checkout");
      } else {
        setAuthUser(u);
      }
    };
    window.addEventListener("auth-updated", handleAuth);
    return () => window.removeEventListener("auth-updated", handleAuth);
  }, [router]);

  const [shippingForm, setShippingForm] = useState({
    firstName: "Vedant",
    lastName: "Dayala",
    line1: "A-701 Brown stone",
    city: "Ahmedabad",
    zip: "382350",
    state: "Gujarat",
    country: "India",
    phone: "+91 98765 43210",
  });

  useEffect(() => {
    // Sync Cart
    const syncCart = () => {
      const items = getActiveCartItems();
      setCartItems(items);
    };

    syncCart();

    const handleCartUpdated = (e: any) => {
      if (e.detail) {
        setCartItems(e.detail);
      } else {
        syncCart();
      }
    };

    const handleAuthUpdated = () => {
      syncCart();
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("auth-updated", handleAuthUpdated);

    // Sync Saved Addresses from localStorage
    const savedAddr = localStorage.getItem("the_drop_addresses");
    let addrList: Address[] = defaultAddresses;
    if (savedAddr !== null) {
      try {
        const parsed = JSON.parse(savedAddr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          addrList = parsed;
        }
      } catch (e) {}
    }
    setSavedAddresses(addrList);

    // Pick Default Address or 1st Address
    const defaultAddr = addrList.find((a) => a.isDefault) || addrList[0];
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
      populateAddressForm(defaultAddr);
    }

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("auth-updated", handleAuthUpdated);
    };
  }, []);

  const populateAddressForm = (addr: Address) => {
    const parts = addr.name.split(" ");
    setShippingForm({
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      line1: addr.line1 || "",
      city: addr.city || "",
      zip: addr.zip || "",
      state: addr.state || "",
      country: addr.country || "India",
      phone: addr.phone || "+91 98765 43210",
    });
  };

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === "custom") {
      setShippingForm({
        firstName: "",
        lastName: "",
        line1: "",
        city: "",
        zip: "",
        state: "",
        country: "India",
        phone: "",
      });
    } else {
      const found = savedAddresses.find((a) => a.id === addressId);
      if (found) {
        populateAddressForm(found);
      }
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setValidatingPromo(true);
    setPromoError("");

    try {
      const res = await fetch(`/api/admin/coupons?code=${encodeURIComponent(promoInput.trim())}`);
      const data = await res.json();
      setValidatingPromo(false);

      if (data.success && data.coupon) {
        const coupon = data.coupon;
        if (subtotal < coupon.minSpend) {
          setPromoError(`Minimum spend of $${coupon.minSpend.toFixed(2)} required for coupon ${coupon.code}.`);
          return;
        }
        setAppliedCoupon(coupon);
        setPromoError("");
      } else {
        setPromoError(data.error || "Invalid or expired promo code.");
      }
    } catch (err) {
      setValidatingPromo(false);
      setPromoError("Failed to validate promo code.");
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "PERCENTAGE") {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const shippingFee = subtotal >= 500 ? 0 : subtotal > 0 ? 15 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const newOrder = {
      id: `ORDER-${Math.floor(8000 + Math.random() * 1000)}`,
      orderNumber: `#TD-${Math.floor(8000 + Math.random() * 1000)}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Processing",
      statusColor: "text-milano-red",
      progress: "w-1/2 bg-milano-red",
      statusText: "Expected in 2-3 Days",
      items: cartItems,
      total: grandTotal,
      shippingAddress: shippingForm,
    };

    const savedOrders = localStorage.getItem("the_drop_recent_orders");
    let ordersList: any[] = [];
    if (savedOrders !== null) {
      try {
        ordersList = JSON.parse(savedOrders);
      } catch (e) {}
    }

    ordersList.unshift(newOrder);
    localStorage.setItem("the_drop_recent_orders", JSON.stringify(ordersList));

    // Clear active cart after placing order
    saveActiveCartItems([]);

    router.push("/thank-you");
  };

  if (!authUser) {
    return (
      <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface flex flex-col justify-between">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="border-4 border-on-surface p-8 sm:p-12 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
            <span className="material-symbols-outlined text-6xl text-milano-red">lock</span>
            <h1 className="font-display-xl text-3xl uppercase">LOGIN REQUIRED TO CHECKOUT</h1>
            <p className="font-body-md text-sm text-on-surface/70 uppercase">
              You must be logged in to your account before proceeding to order checkout.
            </p>
            <Link
              href="/login?redirect=/checkout"
              className="inline-block w-full py-4 bg-milano-red text-lemon-chiffon font-headline-md text-sm uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer"
            >
              LOG IN TO CONTINUE
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface">
      {/* Top Navigation Bar */}
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 sm:py-12 md:py-section-gap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter md:gap-16 items-start">
          {/* Left Side: Forms */}
          <div className="lg:col-span-7 space-y-12 sm:space-y-16">
            {/* Section Header */}
            <div>
              <h1 className="font-display-xl text-3xl sm:text-headline-lg uppercase mb-3">Checkout</h1>
              <p className="font-body-lg text-sm sm:text-base opacity-70 max-w-lg">
                Complete your order. All items are limited edition and secured only upon successful payment.
              </p>
            </div>

            {/* Shipping Details */}
            <section className="space-y-6 sm:space-y-8">
              <div className="flex items-center justify-between border-b-2 border-on-surface pb-3">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="font-headline-md text-xl sm:text-2xl text-milano-red">01</span>
                  <h2 className="font-headline-md text-xl sm:text-2xl uppercase">Shipping Details</h2>
                </div>
                <Link href="/account/addresses" className="font-label-bold text-xs uppercase text-milano-red hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">edit_location</span>
                  Manage Saved Addresses
                </Link>
              </div>

              {/* ── ADDRESS SELECTOR: DROPDOWN IF > 2 ADDRESSES, CARDS IF <= 2 ADDRESSES ── */}
              {savedAddresses.length > 2 ? (
                /* DROPDOWN SELECTOR WHEN ADDRESSES > 2 */
                <div className="border-2 border-on-surface bg-lemon-chiffon p-4 sm:p-5 shadow-[4px_4px_0px_0px_#a90e02]">
                  <label className="font-label-bold text-xs uppercase text-milano-red tracking-wider block mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      SELECT SAVED SHIPPING ADDRESS ({savedAddresses.length} SAVED)
                    </span>
                    <span className="text-[10px] text-on-surface/50">CHOOSE FROM DROPDOWN</span>
                  </label>
                  <select
                    value={selectedAddressId}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className="w-full bg-surface border-2 border-on-surface p-3 font-label-bold text-xs sm:text-sm uppercase focus:outline-none focus:border-milano-red cursor-pointer"
                  >
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.isDefault ? "[DEFAULT] " : ""}{addr.label.toUpperCase()} — {addr.line1}, {addr.city} ({addr.name})
                      </option>
                    ))}
                    <option value="custom">+ ENTER NEW SHIPPING ADDRESS</option>
                  </select>
                </div>
              ) : savedAddresses.length > 0 ? (
                /* CARDS SELECTOR WHEN ADDRESSES <= 2 */
                <div className="space-y-3">
                  <label className="font-label-bold text-xs uppercase text-milano-red tracking-wider block flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    SELECT SAVED SHIPPING ADDRESS
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleAddressChange(addr.id)}
                        className={`p-4 border-2 cursor-pointer transition-all relative ${
                          selectedAddressId === addr.id
                            ? "border-milano-red bg-lemon-chiffon shadow-[4px_4px_0px_0px_#a90e02]"
                            : "border-on-surface bg-surface hover:bg-lemon-chiffon/50"
                        }`}
                      >
                        {addr.isDefault && (
                          <span className="absolute top-2 right-2 bg-milano-red text-lemon-chiffon font-label-bold text-[8px] uppercase px-1.5 py-0.5">
                            DEFAULT
                          </span>
                        )}
                        <p className="font-label-bold text-[10px] uppercase text-on-surface/60">{addr.label}</p>
                        <p className="font-headline-md text-sm uppercase font-bold mt-0.5">{addr.name}</p>
                        <p className="font-body-md text-xs text-on-surface/80 truncate mt-1">{addr.line1}</p>
                        <p className="font-body-md text-xs text-on-surface/80">{addr.city}, {addr.state} {addr.zip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Shipping Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8">
                <div className="relative group">
                  <label className="font-label-bold text-xs uppercase opacity-60 block mb-1">First Name</label>
                  <input
                    value={shippingForm.firstName}
                    onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase"
                    placeholder="e.g. Alex"
                    type="text"
                  />
                </div>
                <div className="relative group">
                  <label className="font-label-bold text-xs uppercase opacity-60 block mb-1">Last Name</label>
                  <input
                    value={shippingForm.lastName}
                    onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase"
                    placeholder="e.g. Smith"
                    type="text"
                  />
                </div>
                <div className="md:col-span-2 relative group">
                  <label className="font-label-bold text-xs uppercase opacity-60 block mb-1">Address Line 1</label>
                  <input
                    value={shippingForm.line1}
                    onChange={(e) => setShippingForm({ ...shippingForm, line1: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase"
                    placeholder="Street name and house number"
                    type="text"
                  />
                </div>
                <div className="relative group">
                  <label className="font-label-bold text-xs uppercase opacity-60 block mb-1">City</label>
                  <input
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase"
                    placeholder="e.g. Mumbai"
                    type="text"
                  />
                </div>
                <div className="relative group">
                  <label className="font-label-bold text-xs uppercase opacity-60 block mb-1">Postal Code</label>
                  <input
                    value={shippingForm.zip}
                    onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase"
                    placeholder="e.g. 400001"
                    type="text"
                  />
                </div>
                <div className="relative group md:col-span-2">
                  <label className="font-label-bold text-xs uppercase opacity-60 block mb-1">Mobile Number</label>
                  <input
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase"
                    placeholder="e.g. +91 98765 43210"
                    type="text"
                  />
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-3 sm:gap-4 border-b-2 border-on-surface pb-3">
                <span className="font-headline-md text-xl sm:text-2xl text-milano-red">02</span>
                <h2 className="font-headline-md text-xl sm:text-2xl uppercase">Delivery Method</h2>
              </div>
              <div className="space-y-4">
                <label className="group flex items-center justify-between p-4 sm:p-6 border-2 border-on-surface bg-surface cursor-pointer hover:border-milano-red hover:bg-lemon-chiffon/50 hover:shadow-[4px_4px_0px_0px_#a90e02] transition-all">
                  <div className="flex items-center gap-4">
                    <input
                      defaultChecked
                      className="w-5 h-5 accent-milano-red cursor-pointer"
                      name="delivery"
                      type="radio"
                    />
                    <div>
                      <span className="font-label-bold text-sm sm:text-base block uppercase text-on-surface">EXPRESS COURIER</span>
                      <span className="font-label-bold text-xs opacity-70 uppercase text-on-surface">1-2 Business Days</span>
                    </div>
                  </div>
                  <span className="font-headline-md text-lg sm:text-xl text-milano-red">
                    {subtotal >= 500 ? "FREE" : "$15.00"}
                  </span>
                </label>
              </div>
            </section>

            {/* Payment Information */}
            <section className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-3 sm:gap-4 border-b-2 border-on-surface pb-3">
                <span className="font-headline-md text-xl sm:text-2xl text-milano-red">03</span>
                <h2 className="font-headline-md text-xl sm:text-2xl uppercase">Payment Information</h2>
              </div>
              <div className="space-y-6 sm:space-y-8">
                <div className="relative group">
                  <label className="font-label-bold text-xs uppercase opacity-60 block mb-1">Card Number</label>
                  <input
                    className="w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase"
                    placeholder="0000 0000 0000 0000"
                    type="text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6 sm:gap-8">
                  <div className="relative group">
                    <label className="font-label-bold text-xs uppercase opacity-60 block mb-1">Expiry Date</label>
                    <input
                      className="w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase"
                      placeholder="MM/YY"
                      type="text"
                    />
                  </div>
                  <div className="relative group">
                    <label className="font-label-bold text-xs uppercase opacity-60 block mb-1">CVC</label>
                    <input
                      className="w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase"
                      placeholder="123"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="border-4 border-on-surface p-6 sm:p-8 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-6 sm:space-y-8">
              <h2 className="font-display-xl text-xl sm:text-2xl uppercase border-b-2 border-on-surface pb-4">
                Order Summary ({totalItems})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y border-on-surface/10">
                {cartItems.map((item, idx) => (
                  <div key={item.id + idx} className="flex gap-4 pt-3 first:pt-0">
                    <div className="w-16 h-20 bg-white border border-on-surface flex-shrink-0 overflow-hidden">
                      <img className="w-full h-full object-cover" alt={item.title} src={item.image} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-headline-md text-sm uppercase leading-tight">{item.title}</h3>
                      <p className="font-label-bold text-xs text-on-surface/60 uppercase">
                        Size: {item.size || "M"} | Qty: {item.quantity || 1}
                      </p>
                      <p className="font-headline-md text-sm text-milano-red">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code / Coupon Form */}
              <div className="border-t-2 border-on-surface pt-4 space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="PROMO CODE (e.g. DROP20)"
                    className="flex-1 bg-lemon-chiffon border-2 border-on-surface p-2 font-label-bold text-xs uppercase focus:outline-none focus:border-milano-red"
                  />
                  <button
                    type="submit"
                    disabled={validatingPromo}
                    className="px-4 py-2 bg-on-surface text-lemon-chiffon font-label-bold text-xs uppercase hover:bg-milano-red transition-colors cursor-pointer border-2 border-on-surface"
                  >
                    {validatingPromo ? "..." : "APPLY"}
                  </button>
                </form>

                {promoError && (
                  <p className="font-label-bold text-[10px] text-milano-red uppercase">{promoError}</p>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between items-center bg-green-100 border border-green-700 p-2 font-label-bold text-xs uppercase text-green-900">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      COUPON {appliedCoupon.code} APPLIED ({appliedCoupon.type === "PERCENTAGE" ? `${appliedCoupon.value}% OFF` : `$${appliedCoupon.value} OFF`})
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-milano-red hover:underline text-[10px] cursor-pointer"
                    >
                      REMOVE
                    </button>
                  </div>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-3 border-t-2 border-on-surface pt-4 font-label-bold text-sm uppercase">
                <div className="flex justify-between">
                  <span className="opacity-70">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-70">Express Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-milano-red">FREE SHIPPING ON ORDERS OVER $500.00</p>
                )}
                <div className="flex justify-between text-base sm:text-lg font-headline-md text-milano-red border-t-2 border-on-surface pt-3">
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full py-4 bg-milano-red text-lemon-chiffon font-headline-md text-sm sm:text-base uppercase tracking-widest hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface shadow-[4px_4px_0px_0px_#000]"
              >
                Place Order — ${grandTotal.toFixed(2)}
              </button>

              <div className="text-center font-label-bold text-[10px] opacity-60 uppercase tracking-widest space-y-1">
                <p>256-BIT ENCRYPTED CHECKOUT</p>
                <p>GUARANTEED AUTHENTIC DROP ARCHIVE</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
