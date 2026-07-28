"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuthUser, loginUserAsync, logoutUser, UserSession } from "@/lib/authHelper";
import AdminHeader from "@/components/AdminHeader";

interface ProductRecord {
  id: string;
  title: string;
  category: string;
  price: number;
  image1: string;
  stock: number;
  status: string;
}

export default function AdminProductsPage() {
  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.role === "Admin") {
      fetchProducts();
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

  const handleQuickStockChange = async (prodId: string, currentStock: number, delta: number) => {
    const nextStock = Math.max(0, currentStock + delta);
    setUpdatingStockId(prodId);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prodId, stock: nextStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prodId ? { ...p, stock: nextStock } : p))
        );
        showToast(`Stock updated to ${nextStock} units.`);
      }
    } catch (e) {
    } finally {
      setUpdatingStockId(null);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm("Remove this product from the catalog?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${prodId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Product deleted.");
        fetchProducts();
      }
    } catch (e) {}
  };

  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => !p.stock || p.stock === 0).length;
  const healthyStockCount = products.filter((p) => p.stock > 10).length;

  const labelClass = "font-label-bold text-[10px] uppercase tracking-wider opacity-60 block mb-1";
  const inputClass = "w-full bg-lemon-chiffon border-2 border-on-surface p-3 font-label-bold text-sm focus:outline-none focus:border-milano-red uppercase";

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface flex flex-col justify-between">
      
      {/* Reusable Admin Header & Navigation */}
      <AdminHeader authUser={authUser} activeTab="products" counts={{ products: products.length }} />

      {/* ── MAIN WORKSPACE ── */}
      <main className="flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-8 sm:py-12">

        {!authUser || authUser.role !== "Admin" ? (
          <div className="max-w-md mx-auto border-4 border-on-surface p-8 sm:p-10 bg-surface shadow-[8px_8px_0px_0px_#a90e02] my-8">
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-5xl text-milano-red mb-2">lock_person</span>
              <h1 className="font-display-xl text-3xl uppercase">ADMIN AUTHENTICATION</h1>
              <p className="font-body-md text-xs text-on-surface/70 mt-2 uppercase tracking-wide">
                ENTER YOUR ADMIN EMAIL ID & PASSWORD TO ACCESS LIVE STOCK TRACKER WORKSPACE.
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
        ) : (
          <div className="space-y-6">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-on-surface pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-milano-red text-lemon-chiffon font-label-bold text-[10px] uppercase px-2 py-0.5 border border-on-surface flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-lemon-chiffon animate-ping"></span> LIVE STOCK TRACKER ACTIVE
                  </span>
                </div>
                <h1 className="font-display-xl text-3xl sm:text-5xl uppercase">PRODUCT & STOCK TELEMETRY</h1>
                <p className="font-body-md text-xs text-on-surface/70 uppercase tracking-wider mt-1">
                  REAL-TIME WAREHOUSE INVENTORY AUDIT, LOW STOCK ALERTS & LIVE STEPPER ADJUSTMENTS.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/products/add-product"
                  className="px-5 py-2.5 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add_box</span> Add Catalog Product
                </Link>
              </div>
            </div>

            {toastMsg && (
              <div className="p-4 bg-on-surface text-green-400 font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{toastMsg}</span>
              </div>
            )}

            {/* ── LIVE STOCK TELEMETRY WIDGET ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-4 border-on-surface p-6 bg-surface shadow-[8px_8px_0px_0px_#a90e02]">
              <div className="border-2 border-on-surface p-4 bg-lemon-chiffon">
                <p className="font-label-bold text-[10px] uppercase tracking-widest opacity-60">TOTAL WAREHOUSE VAULT</p>
                <p className="font-display-xl text-3xl text-on-surface mt-1">{totalStockUnits} UNITS</p>
                <p className="font-body-md text-[10px] opacity-70 uppercase mt-0.5">Across {products.length} Products</p>
              </div>

              <div className="border-2 border-on-surface p-4 bg-lemon-chiffon">
                <p className="font-label-bold text-[10px] uppercase tracking-widest text-green-800">HEALTHY INVENTORY</p>
                <p className="font-display-xl text-3xl text-green-700 mt-1">{healthyStockCount} ITEMS</p>
                <p className="font-body-md text-[10px] opacity-70 uppercase mt-0.5">&gt; 10 Units Stocked</p>
              </div>

              <div className={`border-2 p-4 ${lowStockCount > 0 ? "border-amber-600 bg-amber-100" : "border-on-surface bg-lemon-chiffon"}`}>
                <p className="font-label-bold text-[10px] uppercase tracking-widest text-amber-800 flex items-center gap-1">
                  {lowStockCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>}
                  LOW STOCK ALERTS
                </p>
                <p className="font-display-xl text-3xl text-amber-900 mt-1">{lowStockCount} ITEMS</p>
                <p className="font-body-md text-[10px] opacity-70 uppercase mt-0.5">1 - 10 Units Remaining</p>
              </div>

              <div className={`border-2 p-4 ${outOfStockCount > 0 ? "border-milano-red bg-red-100" : "border-on-surface bg-lemon-chiffon"}`}>
                <p className="font-label-bold text-[10px] uppercase tracking-widest text-milano-red flex items-center gap-1">
                  {outOfStockCount > 0 && <span className="w-2 h-2 rounded-full bg-milano-red animate-ping"></span>}
                  OUT OF STOCK
                </p>
                <p className="font-display-xl text-3xl text-milano-red mt-1">{outOfStockCount} ITEMS</p>
                <p className="font-body-md text-[10px] opacity-70 uppercase mt-0.5">0 Units (Sold Out)</p>
              </div>
            </div>

            {/* Catalog Grid with Live Stock Stepper Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => {
                const isLow = p.stock > 0 && p.stock <= 10;
                const isOut = !p.stock || p.stock === 0;

                return (
                  <div key={p.id} className="border-4 border-on-surface bg-surface p-4 shadow-[6px_6px_0px_0px_#a90e02] flex flex-col justify-between">
                    <div>
                      <div className="aspect-[3/4] mb-3 overflow-hidden border-2 border-on-surface bg-white relative">
                        <img src={p.image1} alt={p.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 bg-on-surface text-lemon-chiffon font-label-bold text-[10px] uppercase px-2 py-0.5">
                          {p.category}
                        </span>

                        {/* Live Stock Badge on Product Image */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className={`w-full text-center px-2 py-1 font-label-bold text-[10px] uppercase tracking-wider block border border-on-surface ${
                            isOut
                              ? "bg-milano-red text-lemon-chiffon"
                              : isLow
                              ? "bg-amber-400 text-on-surface font-bold animate-pulse"
                              : "bg-on-surface text-lemon-chiffon opacity-90"
                          }`}>
                            {isOut ? "SOLD OUT (0 IN VAULT)" : isLow ? `ONLY ${p.stock} LEFT IN STOCK` : `IN STOCK (${p.stock} UNITS)`}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-headline-md text-base uppercase leading-tight">{p.title}</h3>
                      <p className="font-headline-md text-milano-red text-lg mt-1">${typeof p.price === "number" ? p.price.toFixed(2) : p.price}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t-2 border-on-surface/20 space-y-3">
                      {/* Live Stock Stepper Control */}
                      <div className="flex items-center justify-between border-2 border-on-surface bg-lemon-chiffon p-1.5">
                        <span className="font-label-bold text-[10px] uppercase text-on-surface/70 pl-1">Live Stock:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={updatingStockId === p.id || p.stock === 0}
                            onClick={() => handleQuickStockChange(p.id, p.stock, -1)}
                            className="w-6 h-6 bg-on-surface text-lemon-chiffon font-bold flex items-center justify-center hover:bg-milano-red transition-colors disabled:opacity-30 cursor-pointer"
                          >
                            -
                          </button>

                          <span className={`font-mono text-xs font-bold w-6 text-center ${isOut ? "text-milano-red" : isLow ? "text-amber-700" : ""}`}>
                            {p.stock}
                          </span>

                          <button
                            type="button"
                            disabled={updatingStockId === p.id}
                            onClick={() => handleQuickStockChange(p.id, p.stock, 1)}
                            className="w-6 h-6 bg-on-surface text-lemon-chiffon font-bold flex items-center justify-center hover:bg-milano-red transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/admin/products/view-product?id=${p.id}`}
                          className="flex-1 py-1.5 border border-on-surface bg-lemon-chiffon text-on-surface font-label-bold text-[10px] uppercase hover:bg-on-surface hover:text-lemon-chiffon transition-colors text-center"
                        >
                          View / Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="px-3 py-1.5 border border-milano-red text-milano-red font-label-bold text-[10px] uppercase hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="w-full bg-on-surface text-lemon-chiffon border-t-4 border-milano-red py-6 px-4 md:px-margin-desktop text-center font-label-bold text-xs uppercase tracking-widest text-lemon-chiffon/60">
        THE DROP ADMIN PORTAL // LIVE STOCK TELEMETRY & CATALOG MANAGEMENT
      </footer>
    </div>
  );
}
