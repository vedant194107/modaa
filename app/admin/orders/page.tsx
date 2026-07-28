"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuthUser, loginUserAsync, logoutUser, UserSession } from "@/lib/authHelper";
import AdminHeader from "@/components/AdminHeader";

interface OrderRecord {
  id: string;
  user_id: string;
  order_number: string;
  total: number;
  status: string;
  items_json: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  // Admin Login Gate Form State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    setAuthUser(user);

    const handleAuth = () => setAuthUser(getAuthUser());
    window.addEventListener("auth-updated", handleAuth);
    return () => window.removeEventListener("auth-updated", handleAuth);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.role === "Admin") {
      fetchOrders();
    }
  }, [authUser]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAuthenticating(true);

    const res = await loginUserAsync(adminEmail, adminPassword);
    setAuthenticating(false);

    if (!res.success) {
      setAdminError(res.error || "Invalid Admin ID or Password.");
    } else if (res.user?.role !== "Admin") {
      setAdminError("Access Denied: Account is not an Administrator.");
    } else {
      showToast("ADMIN ACCESS GRANTED.");
    }
  };

  const parseItemsSummary = (itemsJsonStr: string) => {
    try {
      const parsed = JSON.parse(itemsJsonStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => `${item.title} (x${item.qty || 1})`).join(" + ");
      }
    } catch (e) {}
    return itemsJsonStr;
  };

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface flex flex-col justify-between">
      
      {/* Reusable Admin Header & Navigation */}
      <AdminHeader authUser={authUser} activeTab="orders" counts={{ orders: orders.length }} />

      {/* ── MAIN WORKSPACE ── */}
      <main className="flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-8 sm:py-12">

        {!authUser || authUser.role !== "Admin" ? (
          <div className="max-w-md mx-auto border-4 border-on-surface p-8 sm:p-10 bg-surface shadow-[8px_8px_0px_0px_#a90e02] my-8">
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-5xl text-milano-red mb-2">lock_person</span>
              <h1 className="font-display-xl text-3xl uppercase">ADMIN AUTHENTICATION</h1>
              <p className="font-body-md text-xs text-on-surface/70 mt-2 uppercase tracking-wide">
                ENTER YOUR ADMIN EMAIL ID & PASSWORD TO ACCESS ORDERS MANAGEMENT PAGE.
              </p>
            </div>



            <form onSubmit={handleAdminAuthSubmit} className="space-y-5">
              <div>
                <label className="block font-label-bold text-[10px] uppercase tracking-wider opacity-60 mb-1">ADMIN EMAIL / ID</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-on-surface py-2 px-1 font-label-bold text-sm text-on-surface focus:outline-none focus:border-milano-red uppercase"
                  placeholder="admin@thedrop.com"
                />
              </div>

              <div>
                <label className="block font-label-bold text-[10px] uppercase tracking-wider opacity-60 mb-1">ADMIN PASSWORD</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-on-surface py-2 px-1 font-label-bold text-sm text-on-surface focus:outline-none focus:border-milano-red"
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
        ) : (
          <div className="space-y-6">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-on-surface pb-6">
              <div>
                <h1 className="font-display-xl text-3xl sm:text-5xl uppercase">CUSTOMER ORDERS MANAGEMENT</h1>
                <p className="font-body-md text-xs text-on-surface/70 uppercase tracking-wider mt-1">
                  LIVE ORDERS SYNCHRONIZED DIRECTLY WITH THE DATABASE TABLE.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchOrders}
                  className="px-4 py-2 border-2 border-on-surface font-label-bold text-xs uppercase tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span> Refresh Orders
                </button>
              </div>
            </div>

            {toastMsg && (
              <div className="p-4 bg-on-surface text-green-400 font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{toastMsg}</span>
              </div>
            )}

            {/* Orders Table */}
            {orders.length === 0 ? (
              <div className="border-2 border-on-surface p-8 bg-surface text-center">
                <span className="material-symbols-outlined text-5xl text-milano-red mb-3">local_shipping</span>
                <h3 className="font-display-xl text-xl uppercase mb-1">No Orders Recorded</h3>
                <p className="font-body-md text-xs text-on-surface/70 uppercase tracking-wider">There are currently 0 order records in the database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border-2 border-on-surface bg-surface">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-on-surface text-lemon-chiffon font-label-bold text-xs uppercase tracking-wider border-b-2 border-on-surface">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">User ID</th>
                      <th className="p-4">Date Created</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-on-surface/20 font-body-md text-sm">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-lemon-chiffon/50 transition-colors">
                        <td className="p-4 font-label-bold text-xs uppercase text-milano-red">
                          <Link href={`/admin/orders/order-details?id=${encodeURIComponent(ord.id)}`} className="hover:underline flex items-center gap-1">
                            {ord.order_number || ord.id}
                          </Link>
                        </td>
                        <td className="p-4 font-label-bold text-xs uppercase text-on-surface/60">
                          <Link href={`/admin/users/user-detail?id=${ord.user_id}`} className="hover:text-milano-red hover:underline">
                            {ord.user_id}
                          </Link>
                        </td>
                        <td className="p-4 font-label-bold text-xs text-on-surface/60">{ord.created_at}</td>
                        <td className="p-4 font-headline-md uppercase">{parseItemsSummary(ord.items_json)}</td>
                        <td className="p-4 font-headline-md text-milano-red">₹{Number(ord.total).toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 font-label-bold text-[10px] uppercase ${
                            ord.status === "DELIVERED" ? "bg-green-700 text-lemon-chiffon" : "bg-milano-red text-lemon-chiffon"
                          }`}>
                            {ord.status || "PROCESSING"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/admin/orders/order-details?id=${encodeURIComponent(ord.id)}`}
                            className="px-3 py-1 bg-on-surface text-lemon-chiffon font-label-bold text-[10px] uppercase hover:bg-milano-red transition-colors inline-block"
                          >
                            Order Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="w-full bg-on-surface text-lemon-chiffon border-t-4 border-milano-red py-6 px-4 md:px-margin-desktop text-center font-label-bold text-xs uppercase tracking-widest text-lemon-chiffon/60">
        THE DROP ADMIN PORTAL // ORDERS DATABASE CONTROL
      </footer>
    </div>
  );
}
