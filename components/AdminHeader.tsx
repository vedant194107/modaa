"use client";

import Link from "next/link";
import { logoutUser, UserSession } from "@/lib/authHelper";

interface AdminHeaderProps {
  authUser: UserSession | null;
  activeTab: "overview" | "users" | "products" | "orders" | "user-detail" | "categories";
  counts?: {
    users?: number;
    products?: number;
    orders?: number;
    categories?: number;
  };
}

export default function AdminHeader({ authUser, activeTab, counts }: AdminHeaderProps) {
  return (
    <header className="w-full bg-on-surface text-lemon-chiffon border-b-4 border-milano-red shadow-lg sticky top-0 z-50">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo & Status Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-milano-red text-lemon-chiffon flex items-center justify-center font-display-xl text-xl font-bold border-2 border-lemon-chiffon">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display-xl text-xl sm:text-2xl tracking-tight uppercase text-lemon-chiffon">
                THE DROP <span className="text-milano-red font-normal">// ADMIN</span>
              </span>
              <span className="bg-green-500/20 text-green-400 border border-green-500 font-label-bold text-[9px] px-2 py-0.5 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> SYSTEM ONLINE
              </span>
            </div>
            <p className="font-label-bold text-[10px] text-lemon-chiffon/60 uppercase tracking-widest">
              EXCLUSIVE SYSTEM MANAGEMENT PORTAL
            </p>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="px-4 py-2 border border-lemon-chiffon/40 text-lemon-chiffon font-label-bold text-xs uppercase tracking-wider hover:bg-lemon-chiffon hover:text-on-surface transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">storefront</span>
            Return To Store
          </Link>

          {authUser && authUser.role === "Admin" && (
            <button
              onClick={() => logoutUser()}
              className="px-4 py-2 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-wider hover:bg-lemon-chiffon hover:text-on-surface transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Exit Admin
            </button>
          )}
        </div>
      </div>

      {/* Admin Navigation Bar */}
      {authUser && authUser.role === "Admin" && (
        <div className="bg-on-surface/90 border-t border-lemon-chiffon/20">
          <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop flex gap-0 overflow-x-auto">
            <Link
              href="/admin"
              className={`px-6 py-3 font-label-bold text-xs uppercase tracking-widest transition-colors ${
                activeTab === "overview"
                  ? "bg-milano-red text-lemon-chiffon font-bold border-b-2 border-lemon-chiffon"
                  : "text-lemon-chiffon/60 hover:text-lemon-chiffon"
              }`}
            >
              Overview
            </Link>
            <Link
              href="/admin/users"
              className={`px-6 py-3 font-label-bold text-xs uppercase tracking-widest transition-colors ${
                activeTab === "users"
                  ? "bg-milano-red text-lemon-chiffon font-bold border-b-2 border-lemon-chiffon"
                  : "text-lemon-chiffon/60 hover:text-lemon-chiffon"
              }`}
            >
              Users {counts?.users !== undefined ? `(${counts.users})` : ""}
            </Link>
            <Link
              href="/admin/products"
              className={`px-6 py-3 font-label-bold text-xs uppercase tracking-widest transition-colors ${
                activeTab === "products"
                  ? "bg-milano-red text-lemon-chiffon font-bold border-b-2 border-lemon-chiffon"
                  : "text-lemon-chiffon/60 hover:text-lemon-chiffon"
              }`}
            >
              Products {counts?.products !== undefined ? `(${counts.products})` : ""}
            </Link>
            <Link
              href="/admin/categories"
              className={`px-6 py-3 font-label-bold text-xs uppercase tracking-widest transition-colors ${
                activeTab === "categories"
                  ? "bg-milano-red text-lemon-chiffon font-bold border-b-2 border-lemon-chiffon"
                  : "text-lemon-chiffon/60 hover:text-lemon-chiffon"
              }`}
            >
              Categories {counts?.categories !== undefined ? `(${counts.categories})` : ""}
            </Link>
            <Link
              href="/admin/orders"
              className={`px-6 py-3 font-label-bold text-xs uppercase tracking-widest transition-colors ${
                activeTab === "orders"
                  ? "bg-milano-red text-lemon-chiffon font-bold border-b-2 border-lemon-chiffon"
                  : "text-lemon-chiffon/60 hover:text-lemon-chiffon"
              }`}
            >
              Orders {counts?.orders !== undefined ? `(${counts.orders})` : ""}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
