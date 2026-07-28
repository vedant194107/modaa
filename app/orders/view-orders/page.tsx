"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAuthUser, UserSession } from "@/lib/authHelper";
import PrintInvoice from "@/components/PrintInvoice";

function ViewOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshingGps, setRefreshingGps] = useState(false);
  const [gpsTime, setGpsTime] = useState("Just Now");

  useEffect(() => {
    const user = getAuthUser();
    setAuthUser(user);

    const handleAuth = () => setAuthUser(getAuthUser());
    window.addEventListener("auth-updated", handleAuth);
    return () => window.removeEventListener("auth-updated", handleAuth);
  }, []);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("No Order ID provided in request URL.");
      return;
    }

    setLoading(true);
    setError("");

    // 1. Fetch order details from API (SQLite DB)
    fetch(`/api/admin/orders?id=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          const ord = data.order;
          let items: any[] = [];
          try {
            items = JSON.parse(ord.items_json);
          } catch (e) {
            items = [];
          }

          let addressObj: any = null;
          if (ord.shipping_address) {
            try {
              addressObj = JSON.parse(ord.shipping_address);
            } catch (e) {
              addressObj = null;
            }
          }

          setOrder({
            id: ord.id,
            orderNumber: ord.order_number || ord.id,
            date: ord.created_at ? new Date(ord.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "JUL 2025",
            status: (ord.status || "PROCESSING").toUpperCase(),
            total: Number(ord.total) || 0,
            items: items,
            shippingAddress: addressObj,
            paymentMethod: "Prepaid Credit / UPI",
          });
          setLoading(false);
        } else {
          // 2. Fallback: check recent orders in localStorage
          const savedOrders = localStorage.getItem("the_drop_recent_orders");
          if (savedOrders) {
            try {
              const list: any[] = JSON.parse(savedOrders);
              const found = list.find((o) => String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId));
              if (found) {
                setOrder({ ...found, status: (found.status || "PROCESSING").toUpperCase() });
                setLoading(false);
                return;
              }
            } catch (e) {}
          }

          // 3. Fallback mock order if ID matches demo pattern
          setOrder({
            id: orderId,
            orderNumber: orderId.startsWith("#") ? orderId : `#TD-${orderId}`,
            date: "JUL 25, 2025",
            status: "DISPATCHED",
            total: 245.0,
            items: [
              {
                id: "1",
                title: "ARCHITECT CARGO SYSTEM",
                price: 245,
                size: "L",
                color: "CREAM / MILANO RED",
                quantity: 1,
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVdjayF_lzJBVbPYqMV2nBjlzjQqclMmgAF6FyqTau4MAbCGCUfhAGssWRs6ms-axVrRO65YMrU--lPHNw_ypgnrlMZKQ3-TQuY0jn7xSWpR7hG9EAJSc9gZ-B3-INb_F_nxvcc8BpRiuNz1i6i44_YNy_ru8iiDhCvyT6CD5g4abVkQJ6M-fzQle_MmiqRQrsEGo2z1AAkZWEbcbwprfkbCg6uPWmwOx0sp-Qqh6GL0-ehNoVGxsaOz7C4_znAVpl2fkI2fvWUk",
              },
            ],
            shippingAddress: {
              firstName: authUser?.name || "Vedant Dayala",
              line1: "A-701 Brown stone, M.G. Road",
              city: "Ahmedabad",
              state: "Gujarat",
              zip: "382350",
              country: "India",
              phone: "+91 98765 43210",
            },
            paymentMethod: "Cash on Delivery",
          });
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Failed to retrieve order details.");
        setLoading(false);
      });
  }, [orderId, authUser]);

  const handleRefreshGps = () => {
    setRefreshingGps(true);
    setTimeout(() => {
      setRefreshingGps(false);
      setGpsTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 800);
  };

  const getStepStatus = (stepIndex: number) => {
    if (!order) return false;
    const currentStatus = order.status;
    const orderLevels: { [key: string]: number } = {
      "PROCESSING": 1,
      "PACKAGED": 2,
      "DISPATCHED": 3,
      "DELIVERED": 4,
    };
    const level = orderLevels[currentStatus] || 1;
    return level >= stepIndex;
  };

  const getProgressPercentage = () => {
    if (!order) return "25%";
    switch (order.status) {
      case "PROCESSING": return "25%";
      case "PACKAGED": return "50%";
      case "DISPATCHED": return "75%";
      case "DELIVERED": return "100%";
      default: return "25%";
    }
  };

  const subtotal = order ? order.items?.reduce((sum: number, i: any) => sum + (Number(i.price) || 0) * (i.quantity || 1), 0) || order.total : 0;
  const shippingFee = subtotal >= 500 ? 0 : subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface flex flex-col justify-between">
      <PrintInvoice order={order} />
      <Navbar />

      <main className="no-print flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-8 sm:py-12">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/account" className="font-label-bold text-xs uppercase text-milano-red hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            MY ACCOUNT
          </Link>
          <span className="text-on-surface/30">/</span>
          <span className="font-label-bold text-xs uppercase text-on-surface/60">LIVE ORDER TRACKING</span>
          {orderId && (
            <>
              <span className="text-on-surface/30">/</span>
              <span className="font-mono text-xs uppercase text-milano-red font-bold">{orderId}</span>
            </>
          )}
        </div>

        {loading ? (
          <div className="text-center py-24 border-4 border-on-surface bg-surface p-12 shadow-[8px_8px_0px_0px_#a90e02]">
            <span className="material-symbols-outlined text-5xl text-milano-red animate-spin mb-3">sync</span>
            <p className="font-label-bold text-sm uppercase tracking-widest">CONNECTING TO LIVE TELEMETRY SATELLITE...</p>
          </div>
        ) : error || !order ? (
          <div className="max-w-xl mx-auto border-4 border-on-surface p-8 sm:p-12 bg-surface text-center shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
            <span className="material-symbols-outlined text-6xl text-milano-red">inventory_2</span>
            <h1 className="font-display-xl text-3xl uppercase">ORDER NOT FOUND</h1>
            <p className="font-body-md text-sm opacity-70 uppercase">{error || "Could not find any order with the requested order ID."}</p>
            <Link
              href="/account"
              className="inline-block px-8 py-4 bg-milano-red text-lemon-chiffon font-headline-md text-sm uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer"
            >
              RETURN TO ACCOUNT ORDERS
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Order Header Card */}
            <div className="border-4 border-on-surface bg-surface p-6 sm:p-8 shadow-[8px_8px_0px_0px_#a90e02] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {/* Animated Pulse Live Radar Badge */}
                  <span className="px-3 py-1 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lemon-chiffon opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-lemon-chiffon"></span>
                    </span>
                    LIVE TRACKING: {order.status}
                  </span>
                  <span className="font-label-bold text-xs opacity-60 uppercase">
                    PLACED ON {order.date}
                  </span>
                </div>
                <h1 className="font-display-xl text-3xl sm:text-5xl uppercase leading-none">
                  {order.orderNumber || order.id}
                </h1>
                <p className="font-body-md text-xs opacity-70 uppercase mt-2">
                  SQLITE ID: <span className="font-mono text-on-surface font-bold">{order.id}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 border-2 border-on-surface bg-lemon-chiffon text-on-surface font-label-bold text-xs uppercase tracking-widest hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print Invoice
                </button>
                <Link
                  href="/account"
                  className="px-6 py-3 bg-on-surface text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest hover:bg-milano-red transition-colors border-2 border-on-surface text-center"
                >
                  Back to Orders
                </Link>
              </div>
            </div>

            {/* ── ANIMATED LIVE TRACKING PROGRESS TIMELINE BAR ── */}
            <div className="border-4 border-on-surface bg-surface p-6 sm:p-8 shadow-[8px_8px_0px_0px_#a90e02] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-on-surface pb-4">
                <h2 className="font-headline-md text-xl uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-milano-red animate-bounce">near_me</span>
                  LIVE FULFILLMENT SATELLITE RADAR
                </h2>
                <div className="flex items-center gap-2 text-xs font-label-bold uppercase text-on-surface/70">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                  <span>GPS Signal Locked ({gpsTime})</span>
                </div>
              </div>

              {/* Animated Continuous Line Bar */}
              <div className="relative pt-4 pb-2 px-2">
                <div className="overflow-hidden h-3 mb-6 text-xs flex rounded-none bg-lemon-chiffon border-2 border-on-surface relative">
                  <div
                    style={{ width: getProgressPercentage() }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-milano-red transition-all duration-1000 ease-out relative overflow-hidden"
                  >
                    {/* Animated Shimmer Bar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>

                {/* 4 Animated Steps Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Step 1 */}
                  <div className={`border-2 p-4 transition-all duration-500 ${getStepStatus(1) ? "border-on-surface bg-lemon-chiffon shadow-[4px_4px_0px_0px_#000]" : "border-on-surface/30 opacity-50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="material-symbols-outlined text-milano-red text-2xl">check_circle</span>
                      <span className="font-mono text-[10px] font-bold bg-on-surface text-lemon-chiffon px-1.5 py-0.5 uppercase">STEP 01</span>
                    </div>
                    <p className="font-headline-md text-xs uppercase">1. ORDER CONFIRMED</p>
                    <p className="font-body-md text-[10px] opacity-70 uppercase mt-0.5">{order.date}</p>
                  </div>

                  {/* Step 2 */}
                  <div className={`border-2 p-4 transition-all duration-500 ${getStepStatus(2) ? "border-on-surface bg-lemon-chiffon shadow-[4px_4px_0px_0px_#000]" : "border-on-surface/30 opacity-50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="material-symbols-outlined text-milano-red text-2xl">inventory</span>
                      <span className="font-mono text-[10px] font-bold bg-on-surface text-lemon-chiffon px-1.5 py-0.5 uppercase">STEP 02</span>
                    </div>
                    <p className="font-headline-md text-xs uppercase">2. PACKAGED & INSPECTED</p>
                    <p className="font-body-md text-[10px] opacity-70 uppercase mt-0.5">VAULT SEALED</p>
                  </div>

                  {/* Step 3 */}
                  <div className={`border-2 p-4 transition-all duration-500 ${getStepStatus(3) ? "border-on-surface bg-lemon-chiffon shadow-[4px_4px_0px_0px_#000]" : "border-on-surface/30 opacity-50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="material-symbols-outlined text-milano-red text-2xl animate-pulse">local_shipping</span>
                      <span className="font-mono text-[10px] font-bold bg-milano-red text-lemon-chiffon px-1.5 py-0.5 uppercase">ACTIVE STEP</span>
                    </div>
                    <p className="font-headline-md text-xs uppercase">3. OUT FOR DELIVERY</p>
                    <p className="font-body-md text-[10px] opacity-70 uppercase mt-0.5">EXPRESS COURIER VAN</p>
                  </div>

                  {/* Step 4 */}
                  <div className={`border-2 p-4 transition-all duration-500 ${getStepStatus(4) ? "border-green-700 bg-green-100 shadow-[4px_4px_0px_0px_#15803d]" : "border-on-surface/30 opacity-50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`material-symbols-outlined text-2xl ${order.status === "DELIVERED" ? "text-green-700" : "text-on-surface/40"}`}>package_2</span>
                      <span className="font-mono text-[10px] font-bold bg-on-surface text-lemon-chiffon px-1.5 py-0.5 uppercase">FINAL</span>
                    </div>
                    <p className="font-headline-md text-xs uppercase">4. DELIVERED</p>
                    <p className="font-body-md text-[10px] opacity-70 uppercase mt-0.5">
                      {order.status === "DELIVERED" ? "HANDED TO RECIPIENT" : "ESTIMATED 2-3 DAYS"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── LIVE GPS DRIVER MAP & REAL-TIME EVENT LOG GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Simulated Live GPS Map Radar Column */}
              <div className="lg:col-span-6 border-4 border-on-surface p-6 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-on-surface pb-3">
                  <h3 className="font-headline-md text-lg uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined text-milano-red">radar</span>
                    LIVE GPS COURIER RADAR
                  </h3>
                  <button
                    onClick={handleRefreshGps}
                    className="px-3 py-1 bg-on-surface text-lemon-chiffon font-label-bold text-[10px] uppercase hover:bg-milano-red transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-xs ${refreshingGps ? "animate-spin" : ""}`}>sync</span>
                    <span>{refreshingGps ? "Pinging..." : "Refresh Radar"}</span>
                  </button>
                </div>

                {/* Animated Simulated Map Canvas */}
                <div className="relative aspect-[16/9] border-2 border-on-surface bg-on-surface text-lemon-chiffon overflow-hidden p-4 flex flex-col justify-between">
                  {/* Grid Lines Pattern Background */}
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                  {/* Animated Delivery Route Pulse Line */}
                  <div className="absolute top-1/2 left-8 right-12 h-1 border-b-2 border-dashed border-milano-red animate-pulse"></div>

                  <div className="relative z-10 flex justify-between items-start">
                    <div className="bg-surface text-on-surface px-2.5 py-1 border border-on-surface font-label-bold text-[10px] uppercase">
                      HUB: AHMEDABAD CENTRAL
                    </div>
                    <div className="bg-milano-red text-lemon-chiffon px-2.5 py-1 font-label-bold text-[10px] uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-lemon-chiffon animate-ping"></span>
                      DRIVER ACTIVE
                    </div>
                  </div>

                  {/* Animated Moving Vehicle Icon */}
                  <div className="relative z-10 flex items-center justify-center my-4">
                    <div className="bg-lemon-chiffon text-on-surface p-3 border-2 border-milano-red shadow-[4px_4px_0px_0px_#a90e02] animate-bounce flex items-center gap-2">
                      <span className="material-symbols-outlined text-milano-red text-xl">local_shipping</span>
                      <span className="font-label-bold text-xs uppercase">TACTICAL VAN #4 (RAHUL V.)</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-between items-end font-label-bold text-[10px] uppercase text-lemon-chiffon/80">
                    <div>DESTINATION: {order.shippingAddress?.city || "AHMEDABAD"}</div>
                    <div>ETA: 4:30 PM TODAY</div>
                  </div>
                </div>

                {/* Courier Agent Card */}
                <div className="border-2 border-on-surface p-4 bg-lemon-chiffon flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-on-surface text-lemon-chiffon flex items-center justify-center font-display-xl text-lg font-bold border-2 border-on-surface">
                      R
                    </div>
                    <div>
                      <p className="font-headline-md text-sm uppercase">Rahul V. (Courier ID: #EX-904)</p>
                      <p className="font-body-md text-[10px] opacity-70 uppercase">MODA Express Logistics Lead Agent</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${order.shippingAddress?.phone || "+919876543210"}`}
                    className="w-full sm:w-auto px-4 py-2 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest hover:bg-on-surface transition-colors border border-on-surface flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    Call Courier Agent
                  </a>
                </div>
              </div>

              {/* Real-Time Status Activity Feed Column */}
              <div className="lg:col-span-6 border-4 border-on-surface p-6 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
                <h3 className="font-headline-md text-lg uppercase border-b-2 border-on-surface pb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-milano-red">history</span>
                  LIVE ACTIVITY LOG & CHECKPOINTS
                </h3>

                <div className="space-y-4 font-body-md text-xs uppercase relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-on-surface/20 pl-8">
                  {/* Event 1 */}
                  <div className="relative">
                    <span className="absolute -left-8 top-0.5 w-3 h-3 rounded-full bg-milano-red border-2 border-surface animate-ping"></span>
                    <span className="absolute -left-8 top-0.5 w-3 h-3 rounded-full bg-milano-red border-2 border-surface"></span>
                    <p className="font-headline-md text-xs text-milano-red">OUT FOR FINAL DOORSTEP DELIVERY</p>
                    <p className="text-[10px] opacity-60">Courier agent Rahul V. loaded package onto Tactical Van #4.</p>
                    <p className="text-[10px] font-mono opacity-50 mt-0.5">TODAY // 06:30 PM</p>
                  </div>

                  {/* Event 2 */}
                  <div className="relative">
                    <span className="absolute -left-8 top-0.5 w-3 h-3 rounded-full bg-on-surface"></span>
                    <p className="font-headline-md text-xs">ARRIVED AT LOCAL DISTRIBUTION HUB</p>
                    <p className="text-[10px] opacity-60">Scanned at Ahmedabad Central Fulfillment Facility.</p>
                    <p className="text-[10px] font-mono opacity-50 mt-0.5">TODAY // 09:15 AM</p>
                  </div>

                  {/* Event 3 */}
                  <div className="relative">
                    <span className="absolute -left-8 top-0.5 w-3 h-3 rounded-full bg-on-surface/50"></span>
                    <p className="font-headline-md text-xs">INTERSTATE FREIGHT TRANSIT INITIATED</p>
                    <p className="text-[10px] opacity-60">Package departed Central Archive Vault.</p>
                    <p className="text-[10px] font-mono opacity-50 mt-0.5">JUL 24 // 11:45 PM</p>
                  </div>

                  {/* Event 4 */}
                  <div className="relative">
                    <span className="absolute -left-8 top-0.5 w-3 h-3 rounded-full bg-on-surface/50"></span>
                    <p className="font-headline-md text-xs">QUALITY INSPECTION & VAULT PACKAGING</p>
                    <p className="text-[10px] opacity-60">All drop items verified, anti-tamper seal attached.</p>
                    <p className="text-[10px] font-mono opacity-50 mt-0.5">JUL 24 // 04:20 PM</p>
                  </div>

                  {/* Event 5 */}
                  <div className="relative">
                    <span className="absolute -left-8 top-0.5 w-3 h-3 rounded-full bg-on-surface/50"></span>
                    <p className="font-headline-md text-xs">ORDER CONFIRMED & PAYMENT VERIFIED</p>
                    <p className="text-[10px] opacity-60">Order entered into SQLite system database.</p>
                    <p className="text-[10px] font-mono opacity-50 mt-0.5">{order.date} // 02:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Grid & Summary Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Order Items List Column */}
              <div className="lg:col-span-8 border-4 border-on-surface p-6 sm:p-8 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-6">
                <h2 className="font-headline-md text-xl uppercase border-b-2 border-on-surface pb-3 flex items-center justify-between">
                  <span>ORDERED ITEMS ({order.items?.length || 0})</span>
                  <span className="material-symbols-outlined text-milano-red">shopping_bag</span>
                </h2>

                <div className="divide-y-2 divide-on-surface/20">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-24 border-2 border-on-surface bg-white overflow-hidden flex-shrink-0">
                          <img src={item.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M"} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-headline-md text-base uppercase leading-tight">{item.title}</h3>
                          <div className="flex items-center gap-3 mt-1.5 font-label-bold text-xs opacity-70 uppercase">
                            <span>SIZE: {item.size || "L"}</span>
                            <span>/</span>
                            <span>COLOR: {item.color || "BLACK"}</span>
                          </div>
                          <p className="font-label-bold text-xs text-milano-red uppercase mt-1">
                            QTY: {item.quantity || 1} × ${Number(item.price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="font-headline-md text-lg text-on-surface">
                          ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment Side Summary Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Shipping Details */}
                <div className="border-4 border-on-surface p-6 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
                  <h3 className="font-headline-md text-lg uppercase border-b-2 border-on-surface pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-milano-red">location_on</span>
                    SHIPPING ADDRESS
                  </h3>

                  {order.shippingAddress ? (
                    <div className="font-body-md text-xs uppercase space-y-1">
                      <p className="font-headline-md text-sm">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                      <p className="opacity-80">{order.shippingAddress.line1}</p>
                      {order.shippingAddress.line2 && <p className="opacity-80">{order.shippingAddress.line2}</p>}
                      <p className="opacity-80">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                      </p>
                      <p className="opacity-80">{order.shippingAddress.country || "India"}</p>
                      {order.shippingAddress.phone && (
                        <p className="pt-2 font-mono text-milano-red font-bold">
                          PHONE: {order.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-body-md text-xs opacity-60 uppercase">Standard Express Delivery Address</p>
                  )}
                </div>

                {/* Financial Payment Summary */}
                <div className="border-4 border-on-surface p-6 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
                  <h3 className="font-headline-md text-lg uppercase border-b-2 border-on-surface pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-milano-red">payments</span>
                    PAYMENT BREAKDOWN
                  </h3>

                  <div className="space-y-2 font-label-bold text-xs uppercase border-b-2 border-on-surface/20 pb-4">
                    <div className="flex justify-between">
                      <span className="opacity-60">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Express Courier Shipping</span>
                      <span>{shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Payment Method</span>
                      <span className="text-milano-red">{order.paymentMethod || "Prepaid"}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-headline-md text-base uppercase">GRAND TOTAL</span>
                    <span className="font-headline-md text-2xl text-milano-red">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ViewOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-lemon-chiffon p-12 font-label-bold uppercase text-center">Loading Order Specifications...</div>}>
      <ViewOrderContent />
    </Suspense>
  );
}
