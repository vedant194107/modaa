"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuthUser, loginUserAsync, UserSession } from "@/lib/authHelper";
import AdminHeader from "@/components/AdminHeader";
import PrintInvoice from "@/components/PrintInvoice";

function AdminOrderDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [order, setOrder] = useState<any | null>(null);
  const [customer, setCustomer] = useState<any | null>(null);
  const [status, setStatus] = useState("PROCESSING");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [error, setError] = useState("");

  // Admin Login Gate State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    setAuthUser(user);

    const handleAuth = () => setAuthUser(getAuthUser());
    window.addEventListener("auth-updated", handleAuth);
    return () => window.removeEventListener("auth-updated", handleAuth);
  }, []);

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthenticating(true);

    const res = await loginUserAsync(adminEmail, adminPassword);
    setAuthenticating(false);

    if (!res.success || res.user?.role !== "Admin") {
      setError(res.error || "Access Denied: Account is not an Administrator.");
    }
  };

  const fetchOrderDetails = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch Order Record from API
      const res = await fetch(`/api/admin/orders?id=${encodeURIComponent(id)}`);
      const data = await res.json();

      let ordRecord: any = null;
      if (data.success && data.order) {
        ordRecord = data.order;
      } else {
        // Fallback: check localStorage
        const saved = localStorage.getItem("the_drop_recent_orders");
        if (saved) {
          try {
            const list: any[] = JSON.parse(saved);
            const found = list.find((o) => String(o.id) === String(id) || String(o.orderNumber) === String(id));
            if (found) {
              ordRecord = {
                id: found.id,
                order_number: found.orderNumber || found.id,
                user_id: found.userId || "usr_vip_01",
                total: found.total,
                status: found.status || "PROCESSING",
                items_json: JSON.stringify(found.items || []),
                shipping_address: JSON.stringify(found.shippingAddress || {}),
                created_at: found.date || "JUL 2025",
              };
            }
          } catch (e) {}
        }
      }

      if (!ordRecord) {
        setError("Order record not found in database.");
        setLoading(false);
        return;
      }

      let parsedItems: any[] = [];
      try {
        parsedItems = JSON.parse(ordRecord.items_json);
      } catch (e) {
        parsedItems = [];
      }

      let parsedAddress: any = null;
      if (ordRecord.shipping_address) {
        try {
          parsedAddress = JSON.parse(ordRecord.shipping_address);
        } catch (e) {}
      }

      const formattedOrder = {
        id: ordRecord.id,
        orderNumber: ordRecord.order_number || ordRecord.id,
        userId: ordRecord.user_id || "usr_vip_01",
        total: Number(ordRecord.total) || 0,
        status: ordRecord.status || "PROCESSING",
        items: parsedItems,
        shippingAddress: parsedAddress,
        createdAt: ordRecord.created_at || "JUL 2025",
      };

      setOrder(formattedOrder);
      setStatus(formattedOrder.status);

      // 2. Fetch Customer Info
      if (formattedOrder.userId) {
        try {
          const userRes = await fetch("/api/admin/users");
          const userData = await userRes.json();
          if (userData.success && Array.isArray(userData.users)) {
            const foundCust = userData.users.find((u: any) => u.id === formattedOrder.userId || u.email === formattedOrder.userId);
            if (foundCust) setCustomer(foundCust);
          }
        } catch (e) {}
      }
    } catch (err: any) {
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.role === "Admin" && orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [authUser, orderId]);

  const handleUpdateStatus = async () => {
    if (!orderId || !order) return;
    setUpdating(true);
    setError("");
    setToastMsg("");

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status }),
      });

      const data = await res.json();
      setUpdating(false);

      if (data.success) {
        setOrder({ ...order, status });
        setToastMsg(`ORDER STATUS UPDATED TO ${status}!`);
        setTimeout(() => setToastMsg(""), 3000);
      } else {
        setError(data.error || "Failed to update order status.");
      }
    } catch (err: any) {
      setUpdating(false);
      setError("Failed to update status.");
    }
  };

  const labelClass = "font-label-bold text-xs uppercase tracking-wider text-on-surface/70 block mb-1";
  const inputClass = "w-full bg-lemon-chiffon border-2 border-on-surface p-3 font-label-bold text-sm focus:outline-none focus:border-milano-red uppercase";

  const subtotal = order ? order.items?.reduce((sum: number, i: any) => sum + (Number(i.price) || 0) * (i.quantity || i.qty || 1), 0) || order.total : 0;
  const shippingFee = subtotal >= 500 ? 0 : subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface flex flex-col justify-between">
      <PrintInvoice order={order} customer={customer} />
      <AdminHeader authUser={authUser} activeTab="orders" />

      <main className="no-print flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-8 sm:py-12">
        {!authUser || authUser.role !== "Admin" ? (
          <div className="max-w-md mx-auto border-4 border-on-surface p-8 sm:p-10 bg-surface shadow-[8px_8px_0px_0px_#a90e02] my-8">
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-5xl text-milano-red mb-2">lock_person</span>
              <h1 className="font-display-xl text-3xl uppercase">ADMIN AUTHENTICATION</h1>
              <p className="font-body-md text-xs text-on-surface/70 mt-2 uppercase tracking-wide">
                ENTER YOUR ADMIN EMAIL ID & PASSWORD TO VIEW ORDER DETAILS.
              </p>
            </div>

            <form onSubmit={handleAdminAuthSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>ADMIN EMAIL / ID</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className={inputClass}
                  placeholder="admin@thedrop.com"
                />
              </div>

              <div>
                <label className={labelClass}>ADMIN PASSWORD</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={authenticating}
                className="w-full bg-milano-red text-lemon-chiffon py-4 font-headline-md text-sm uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer mt-4 flex items-center justify-center gap-2"
              >
                {authenticating ? "VERIFYING..." : "AUTHENTICATE ADMIN PORTAL"}
              </button>
            </form>
          </div>
        ) : loading ? (
          <div className="text-center py-20 font-label-bold text-sm uppercase tracking-widest">
            Loading order details from database...
          </div>
        ) : error || !order ? (
          <div className="max-w-xl mx-auto border-4 border-on-surface p-8 sm:p-12 bg-surface text-center shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
            <span className="material-symbols-outlined text-6xl text-milano-red">orders</span>
            <h1 className="font-display-xl text-3xl uppercase">ORDER RECORD NOT FOUND</h1>
            <p className="font-body-md text-sm opacity-70 uppercase">{error || "No order record found for this ID."}</p>
            <Link
              href="/admin/orders"
              className="inline-block px-8 py-4 bg-milano-red text-lemon-chiffon font-headline-md text-sm uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer"
            >
              BACK TO ORDERS DATABASE
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-on-surface pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link href="/admin/orders" className="font-label-bold text-xs uppercase text-milano-red hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    ORDERS DATABASE
                  </Link>
                  <span className="text-on-surface/30">/</span>
                  <span className="font-label-bold text-xs uppercase text-on-surface/60">ORDER SPECIFICATION</span>
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display-xl text-3xl sm:text-5xl uppercase">{order.orderNumber}</h1>
                  <span className={`px-3 py-1 font-label-bold text-xs uppercase border ${
                    order.status === "DELIVERED" ? "bg-green-700 text-lemon-chiffon border-green-700" : "bg-milano-red text-lemon-chiffon border-milano-red"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="font-body-md text-xs text-on-surface/70 uppercase tracking-wider mt-1">
                  SQLITE ID: <span className="font-mono text-milano-red font-bold">{order.id}</span> | DATE: {order.createdAt}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-surface text-on-surface font-label-bold text-xs uppercase tracking-widest hover:bg-on-surface hover:text-lemon-chiffon transition-colors border-2 border-on-surface cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print Invoice
                </button>
                <Link
                  href="/admin/orders"
                  className="px-5 py-2.5 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface"
                >
                  Back to List
                </Link>
              </div>
            </div>

            {toastMsg && (
              <div className="p-4 bg-on-surface text-green-400 font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{toastMsg}</span>
              </div>
            )}

            {/* Admin Order Status Update Control Panel */}
            <div className="border-4 border-on-surface p-6 bg-surface shadow-[8px_8px_0px_0px_#a90e02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-headline-md text-lg uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-milano-red">edit_attributes</span>
                  UPDATE FULFILLMENT STATUS
                </h3>
                <p className="font-body-md text-xs opacity-70 uppercase mt-0.5">
                  Change order status in database. Customer will see updated timeline immediately.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-lemon-chiffon border-2 border-on-surface px-4 py-3 font-label-bold text-xs uppercase focus:outline-none focus:border-milano-red cursor-pointer"
                >
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="PACKAGED">PACKAGED</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updating || status === order.status}
                  className="px-6 py-3 bg-milano-red text-lemon-chiffon font-headline-md text-xs uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer disabled:opacity-50"
                >
                  {updating ? "SAVING..." : "SAVE STATUS"}
                </button>
              </div>
            </div>

            {/* Content Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Order Items Table Column */}
              <div className="lg:col-span-8 border-4 border-on-surface p-6 sm:p-8 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-6">
                <h2 className="font-headline-md text-xl uppercase border-b-2 border-on-surface pb-3 flex items-center justify-between">
                  <span>ORDERED CATALOG ITEMS ({order.items?.length || 0})</span>
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
                            QTY: {item.quantity || item.qty || 1} × ₹{Number(item.price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="font-headline-md text-lg text-on-surface">
                          ₹{((Number(item.price) || 0) * (item.quantity || item.qty || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side Customer & Payment Info Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Customer Account Details */}
                <div className="border-4 border-on-surface p-6 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
                  <h3 className="font-headline-md text-lg uppercase border-b-2 border-on-surface pb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-milano-red">person</span>
                      CUSTOMER ACCOUNT
                    </span>
                    <Link href={`/admin/users/user-detail?id=${order.userId}`} className="font-label-bold text-[10px] text-milano-red uppercase hover:underline">
                      View Profile →
                    </Link>
                  </h3>

                  <div className="space-y-2 font-body-md text-xs uppercase">
                    <div className="flex justify-between py-1 border-b border-on-surface/10">
                      <span className="opacity-60">Customer ID:</span>
                      <span className="font-mono text-milano-red font-bold">{order.userId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-on-surface/10">
                      <span className="opacity-60">Full Name:</span>
                      <span className="font-bold">{customer?.name || order.shippingAddress?.firstName || "VIP Client"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-on-surface/10">
                      <span className="opacity-60">Email Address:</span>
                      <span className="font-bold">{customer?.email || "client@thedrop.com"}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="border-4 border-on-surface p-6 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
                  <h3 className="font-headline-md text-lg uppercase border-b-2 border-on-surface pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-milano-red">local_shipping</span>
                    SHIPPING DESTINATION
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
                          MOBILE: {order.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-body-md text-xs opacity-60 uppercase">Standard Delivery Address Record</p>
                  )}
                </div>

                {/* Payment Breakdown */}
                <div className="border-4 border-on-surface p-6 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
                  <h3 className="font-headline-md text-lg uppercase border-b-2 border-on-surface pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-milano-red">payments</span>
                    FINANCIAL SUMMARY
                  </h3>

                  <div className="space-y-2 font-label-bold text-xs uppercase border-b-2 border-on-surface/20 pb-4">
                    <div className="flex justify-between">
                      <span className="opacity-60">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Shipping Charges</span>
                      <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee.toFixed(2)}`}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-headline-md text-base uppercase">GRAND TOTAL</span>
                    <span className="font-headline-md text-2xl text-milano-red">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full bg-on-surface text-lemon-chiffon border-t-4 border-milano-red py-6 px-4 md:px-margin-desktop text-center font-label-bold text-xs uppercase tracking-widest text-lemon-chiffon/60">
        THE DROP ADMIN PORTAL // ORDER SPECIFICATION AUDIT
      </footer>
    </div>
  );
}

export default function AdminOrderDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-lemon-chiffon p-12 font-label-bold uppercase text-center">Loading Order Specifications...</div>}>
      <AdminOrderDetailsContent />
    </Suspense>
  );
}
