"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthUser, logoutUser, UserSession } from "@/lib/authHelper";
import { getWishlist } from "@/lib/wishlistHelper";

export default function AccountPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [userStatus, setUserStatus] = useState<string>("active");
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setAuthUser(user);

    const handleAuth = () => {
      const u = getAuthUser();
      if (!u) {
        router.push("/login");
      } else {
        setAuthUser(u);
      }
    };
    window.addEventListener("auth-updated", handleAuth);
    return () => window.removeEventListener("auth-updated", handleAuth);
  }, [router]);

  useEffect(() => {
    setWishlistCount(getWishlist().length);
    const handleWishlistUpdate = (e: any) => {
      setWishlistCount((e.detail || getWishlist()).length);
    };
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, []);

  // Fetch REAL placed orders from SQLite database for the active user
  useEffect(() => {
    if (!authUser) return;

    setLoadingOrders(true);
    fetch(`/api/admin/orders?userId=${authUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          const mapped = data.orders.map((ord: any) => {
            let items: any[] = [];
            try {
              items = JSON.parse(ord.items_json);
            } catch (e) {
              items = [
                {
                  title: ord.items_json || "Purchased Drop Item",
                  size: "L",
                  color: "BLACK",
                  quantity: 1,
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
                },
              ];
            }
            return {
              id: ord.id,
              orderNumber: ord.order_number || ord.id,
              total: Number(ord.total) || 0,
              status: ord.status || "PROCESSING",
              statusColor: ord.status === "DELIVERED" ? "text-green-700" : "text-milano-red",
              progress: ord.status === "DELIVERED" ? "w-full bg-green-700" : "w-2/3 bg-milano-red",
              statusText: ord.status === "DELIVERED" ? "DELIVERED" : "DELIVERY EXPECTED SOON",
              items: items.map((it: any) => ({
                title: it.title || "Drop Item",
                size: it.size || "L",
                color: it.color || "BLACK",
                quantity: it.qty || it.quantity || 1,
                image: it.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
              })),
            };
          });
          setOrders(mapped);
        } else {
          setOrders([]);
        }
      })
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, [authUser]);

  useEffect(() => {
    if (!authUser) return;
    fetch(`/api/admin/users?id=${authUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUserStatus(data.user.status || "active");
        }
      })
      .catch((e) => console.error(e));
  }, [authUser]);

  const totalItemsCount = orders.reduce((sum, order) => {
    if (order.items && Array.isArray(order.items)) {
      return sum + order.items.reduce((iSum: number, item: any) => iSum + (item.quantity || 1), 0);
    }
    return sum + 1;
  }, 0);

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface">
      {/* TopNavBar */}
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 sm:py-12">
        {userStatus === "banned" && (
          <div className="mb-8 border-4 border-milano-red bg-milano-red/10 p-6 sm:p-8 text-center shadow-[8px_8px_0px_0px_#a90e02] relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-milano-red text-lemon-chiffon rounded-full mb-4 border-2 border-on-surface">
              <span className="material-symbols-outlined text-3xl">block</span>
            </div>
            <h2 className="font-display-xl text-2xl sm:text-3xl text-milano-red uppercase tracking-tight mb-2">
              YOUR PROFILE IS BANNED
            </h2>
            <p className="font-headline-md text-base sm:text-lg uppercase text-on-surface mb-2">
              PLEASE CONTACT <span className="text-milano-red underline font-bold">+91 99999 99999</span>
            </p>
            <p className="font-body-md text-xs text-on-surface/70 uppercase max-w-md mx-auto">
              Your account privileges have been restricted by system administration. Please get in touch with customer support to resolve this issue.
            </p>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-start">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <h1 className="font-display-xl text-3xl sm:text-4xl uppercase mb-2">My Account</h1>
            {authUser && (
              <div className="mb-6 pb-4 border-b border-on-surface/20">
                <p className="font-label-bold text-xs uppercase text-milano-red truncate">{authUser.name}</p>
                <p className="font-body-md text-[10px] text-on-surface/60 truncate">{authUser.email}</p>
              </div>
            )}
            <nav className="flex flex-col gap-3">
              <Link className="group flex items-center justify-between py-3 border-b-2 border-milano-red transition-colors" href="/account">
                <span className="font-label-bold uppercase text-milano-red text-sm">Recent Orders</span>
                <span className="material-symbols-outlined text-milano-red text-lg">arrow_forward</span>
              </Link>
              <Link className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors" href="/account/wishlist">
                <span className="font-label-bold uppercase text-on-surface text-sm">Wishlist</span>
                <div className="flex items-center gap-2">
                  {wishlistCount > 0 && (
                    <span className="bg-milano-red text-lemon-chiffon font-label-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{wishlistCount}</span>
                  )}
                  <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
                </div>
              </Link>
              <Link className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors" href="/account/addresses">
                <span className="font-label-bold uppercase text-on-surface text-sm">Addresses</span>
                <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
              </Link>
              <Link className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors" href="/account/settings">
                <span className="font-label-bold uppercase text-on-surface text-sm">Settings</span>
                <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
              </Link>
              {authUser && authUser.role === "Admin" && (
                <Link className="group flex items-center justify-between py-3 border-b border-milano-red/30 bg-milano-red/10 px-2 transition-colors mt-2" href="/admin">
                  <span className="font-label-bold uppercase text-milano-red text-sm">Admin Control</span>
                  <span className="material-symbols-outlined text-milano-red text-lg">admin_panel_settings</span>
                </Link>
              )}
              <button
                onClick={() => {
                  logoutUser();
                  router.push("/logged-out");
                }}
                className="group flex items-center justify-between py-3 mt-6 text-left w-full cursor-pointer"
              >
                <span className="font-label-bold uppercase text-on-surface/50 group-hover:text-milano-red transition-colors text-sm">Log Out</span>
                <span className="material-symbols-outlined text-on-surface/50 group-hover:text-milano-red transition-colors text-lg">logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 w-full space-y-12 sm:space-y-16">
            {!authUser ? (
              <div className="border-4 border-on-surface p-8 sm:p-12 text-center bg-surface shadow-[8px_8px_0px_0px_#a90e02]">
                <span className="material-symbols-outlined text-5xl text-milano-red mb-4">lock</span>
                <h2 className="font-display-xl text-2xl sm:text-3xl uppercase mb-2">AUTHENTICATION REQUIRED</h2>
                <p className="font-body-md text-sm opacity-70 mb-6 uppercase tracking-wider">Please sign in to view your orders, saved addresses, and VIP drop reservations.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login" className="px-8 py-3.5 bg-milano-red text-lemon-chiffon font-headline-md uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface">
                    SIGN IN TO ACCOUNT
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {authUser.role === "Admin" && (
                  <div className="p-5 bg-on-surface text-lemon-chiffon border-4 border-milano-red mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[6px_6px_0px_0px_#a90e02]">
                    <div>
                      <span className="bg-milano-red text-lemon-chiffon font-label-bold text-[9px] uppercase px-2 py-0.5 tracking-widest">
                        ADMINISTRATOR LOGGED IN
                      </span>
                      <h3 className="font-display-xl text-xl uppercase mt-1">ADMIN CONTROL PORTAL ACTIVE</h3>
                      <p className="font-body-md text-xs text-lemon-chiffon/70 uppercase">You are signed in as {authUser.name} ({authUser.email}).</p>
                    </div>
                    <Link
                      href="/admin"
                      className="px-6 py-3 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest hover:bg-lemon-chiffon hover:text-on-surface transition-colors border border-lemon-chiffon flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                      Enter Admin Control Center
                    </Link>
                  </div>
                )}

                {/* Recent Orders Section */}
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <h2 className="font-display-xl text-2xl sm:text-3xl uppercase">Recent Placed Orders</h2>
                    <span className="font-label-bold text-xs uppercase text-on-surface/60">
                      {totalItemsCount} Total {totalItemsCount === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  {loadingOrders ? (
                    <div className="p-8 border-2 border-on-surface bg-surface text-center font-label-bold uppercase">
                      Querying SQLite Database Orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="border-4 border-on-surface p-8 sm:p-12 text-center bg-surface shadow-[8px_8px_0px_0px_#a90e02]">
                      <span className="material-symbols-outlined text-5xl text-milano-red mb-4">shopping_bag</span>
                      <h3 className="font-display-xl text-2xl sm:text-3xl uppercase mb-2">NO PLACED ORDERS YET</h3>
                      <p className="font-body-md text-sm opacity-70 mb-6 uppercase tracking-wider">
                        You haven't placed any orders yet. Explore our product catalog to make your first order.
                      </p>
                      <Link href="/products" className="px-8 py-3.5 bg-milano-red text-lemon-chiffon font-headline-md uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface inline-block">
                        EXPLORE PRODUCTS CATALOG
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border-2 border-on-surface p-4 sm:p-6 bg-surface shadow-sm space-y-4">
                          <div className="flex justify-between items-center border-b border-on-surface/10 pb-3">
                            <div className="flex items-center gap-3">
                              <span className={`font-label-bold text-xs sm:text-sm uppercase tracking-wider ${order.statusColor || "text-milano-red"}`}>
                                ● {order.status || "PROCESSING"}
                              </span>
                              <span className="text-xs font-label-bold text-on-surface/50">|</span>
                              <span className="font-label-bold text-xs uppercase text-on-surface/70">
                                {order.orderNumber || order.id}
                              </span>
                            </div>
                            <span className="font-headline-md text-base sm:text-xl text-milano-red font-bold">
                              ${(order.total || 0).toFixed(2)}
                            </span>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3">
                            {(order.items || []).map((item: any, idx: number) => (
                              <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="w-20 h-24 bg-white border border-on-surface flex-shrink-0 overflow-hidden">
                                  <img className="w-full h-full object-cover" alt={item.title} src={item.image} />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <h3 className="font-headline-md text-base sm:text-lg uppercase leading-tight">{item.title}</h3>
                                  <div className="flex flex-wrap gap-3 text-on-surface/60 font-label-bold text-xs uppercase">
                                    <span>SIZE: {item.size || "M"}</span>
                                    <span>COLOR: {item.color || "BLACK"}</span>
                                    <span>QTY: {item.quantity || 1}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Progress Bar & Status */}
                          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            <div className="flex-1 flex items-center gap-3">
                              <div className="h-2 flex-1 bg-lemon-chiffon border border-on-surface overflow-hidden">
                                <div className={`h-full ${order.progress || "w-1/2 bg-milano-red"}`}></div>
                              </div>
                              <span className="font-label-bold text-[11px] uppercase tracking-wider text-on-surface/80 shrink-0">
                                {order.statusText || "EXPECTED IN 2-3 DAYS"}
                              </span>
                            </div>
                            <Link
                              href={`/orders/view-orders?id=${encodeURIComponent(order.id)}`}
                              className="px-6 py-2.5 bg-on-surface text-lemon-chiffon font-headline-md text-xs uppercase tracking-widest hover:bg-milano-red transition-colors cursor-pointer border border-on-surface text-center"
                            >
                              VIEW DETAILS & TRACK
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
