"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthUser, logoutUser, UserSession } from "@/lib/authHelper";
import { getWishlist } from "@/lib/wishlistHelper";

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

const sampleAddresses: Address[] = [
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
    phone: "+91 98765 43210",
    isDefault: true,
  },
];

const ADDR_KEY = "the_drop_addresses";

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [authUser, setAuthUser] = useState<UserSession | null>(null);

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

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Address, "id" | "isDefault">>({
    label: "",
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    phone: "+91 98765 43210",
  });

  useEffect(() => {
    if (!authUser) return;
    
    // Fetch from backend
    fetch(`/api/admin/addresses?userId=${authUser.id}&t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.addresses.length > 0) {
          setAddresses(data.addresses);
          localStorage.setItem(ADDR_KEY, JSON.stringify(data.addresses));
        } else {
          // Fallback to local storage if API fails or is empty, but we shouldn't really
          const saved = localStorage.getItem(ADDR_KEY);
          if (saved) setAddresses(JSON.parse(saved));
        }
      })
      .catch(err => {
        const saved = localStorage.getItem(ADDR_KEY);
        if (saved) setAddresses(JSON.parse(saved));
      });

    setWishlistCount(getWishlist().length);
    const handleWL = (e: any) => setWishlistCount((e.detail || getWishlist()).length);
    window.addEventListener("wishlist-updated", handleWL);
    return () => window.removeEventListener("wishlist-updated", handleWL);
  }, [authUser]);

  const saveToStorage = (updated: Address[]) => {
    setAddresses(updated);
    localStorage.setItem(ADDR_KEY, JSON.stringify(updated));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({
      label: "Home",
      name: authUser?.name || "Vedant Dayala",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
      phone: "+91 98765 43210",
    });
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      name: addr.name,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
      phone: addr.phone || "+91 98765 43210",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    saveToStorage(updated);
    if (authUser) {
      await fetch(`/api/admin/addresses?id=${id}&userId=${authUser.id}`, { method: "DELETE" });
    }
  };

  const handleSetDefault = async (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    saveToStorage(updated);
    if (authUser) {
      const target = updated.find(a => a.id === id);
      if (target) {
        await fetch("/api/admin/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...target, user_id: authUser.id, is_default: true }),
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = addresses.map((a) => (a.id === editingId ? { ...a, ...form } : a));
      saveToStorage(updated);
      if (authUser) {
        await fetch("/api/admin/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: editingId, user_id: authUser.id }),
        });
      }
    } else {
      const newAddr: Address = {
        ...form,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0,
      };
      saveToStorage([...addresses, newAddr]);
      if (authUser) {
        await fetch("/api/admin/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newAddr, user_id: authUser.id, is_default: newAddr.isDefault }),
        });
      }
    }
    setShowForm(false);
  };

  const inputClass =
    "w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase";
  const labelClass = "font-label-bold text-[10px] uppercase tracking-wider text-on-surface/60 block mb-1";

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface">
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 sm:py-12">
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
              <Link className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors" href="/account">
                <span className="font-label-bold uppercase text-on-surface text-sm">Recent Orders</span>
                <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
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
              <Link className="group flex items-center justify-between py-3 border-b-2 border-milano-red transition-colors" href="/account/addresses">
                <span className="font-label-bold uppercase text-milano-red text-sm">Addresses</span>
                <span className="material-symbols-outlined text-milano-red text-lg">arrow_forward</span>
              </Link>
              <Link className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors" href="/account/settings">
                <span className="font-label-bold uppercase text-on-surface text-sm">Settings</span>
                <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
              </Link>
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
          <section className="flex-1 w-full">
            {!authUser ? (
              <div className="border-4 border-on-surface p-8 sm:p-12 text-center bg-surface shadow-[8px_8px_0px_0px_#a90e02]">
                <span className="material-symbols-outlined text-5xl text-milano-red mb-4">lock</span>
                <h2 className="font-display-xl text-2xl sm:text-3xl uppercase mb-2">AUTHENTICATION REQUIRED</h2>
                <p className="font-body-md text-sm opacity-70 mb-6 uppercase tracking-wider">Please sign in to view your saved addresses.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login" className="px-8 py-3.5 bg-milano-red text-lemon-chiffon font-headline-md uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface">
                    SIGN IN TO ACCOUNT
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-6">
                <div className="flex justify-between items-end mb-6 border-b-2 border-on-surface pb-4">
                  <h1 className="font-display-xl text-2xl sm:text-3xl uppercase">Addresses</h1>
                  <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-on-surface text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest hover:bg-milano-red transition-colors border-2 border-on-surface cursor-pointer">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add New
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`border-2 p-5 relative ${addr.isDefault ? "border-milano-red bg-lemon-chiffon shadow-[4px_4px_0px_0px_#a90e02]" : "border-on-surface bg-surface"}`}>
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 bg-milano-red text-lemon-chiffon font-label-bold text-[9px] uppercase tracking-wider px-2 py-0.5">Default</span>
                      )}
                      <p className="font-label-bold text-[10px] uppercase tracking-widest text-on-surface/50 mb-2">{addr.label}</p>
                      <p className="font-headline-md text-base uppercase mb-1">{addr.name}</p>
                      <p className="font-body-md text-sm text-on-surface/80">{addr.line1}</p>
                      {addr.line2 && <p className="font-body-md text-sm text-on-surface/80">{addr.line2}</p>}
                      <p className="font-body-md text-sm text-on-surface/80">{addr.city}, {addr.state} {addr.zip}</p>
                      <p className="font-body-md text-sm text-on-surface/80">{addr.country}</p>
                      {addr.phone && <p className="font-body-md text-sm text-milano-red mt-1 font-label-bold">Mobile: {addr.phone}</p>}
                      
                      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-on-surface/20">
                        <button onClick={() => openEdit(addr)} className="font-label-bold text-xs uppercase tracking-wider text-on-surface hover:text-milano-red transition-colors">Edit</button>
                        <span className="text-on-surface/20">|</span>
                        {!addr.isDefault && (
                          <>
                            <button onClick={() => handleSetDefault(addr.id)} className="font-label-bold text-xs uppercase tracking-wider text-on-surface hover:text-milano-red transition-colors">Set Default</button>
                            <span className="text-on-surface/20">|</span>
                          </>
                        )}
                        <button onClick={() => handleDelete(addr.id)} className="font-label-bold text-xs uppercase tracking-wider text-on-surface/50 hover:text-milano-red transition-colors">Remove</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={openAdd} className="border-2 border-dashed border-on-surface/30 hover:border-milano-red p-5 flex flex-col items-center justify-center gap-3 min-h-[160px] transition-colors group cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-on-surface/30 group-hover:text-milano-red transition-colors">add_circle</span>
                    <span className="font-label-bold text-xs uppercase tracking-wider text-on-surface/50 group-hover:text-milano-red transition-colors">Add New Address</span>
                  </button>
                </div>

                {showForm && (
                  <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-lemon-chiffon border-4 border-on-surface w-full max-w-lg shadow-[8px_8px_0px_0px_#a90e02]">
                      <div className="flex justify-between items-center px-6 py-4 border-b-2 border-on-surface">
                        <h2 className="font-display-xl text-xl uppercase">{editingId ? "Edit Address" : "New Address"}</h2>
                        <button onClick={() => setShowForm(false)} className="material-symbols-outlined text-on-surface hover:text-milano-red transition-colors cursor-pointer">close</button>
                      </div>
                      <form onSubmit={handleSubmit} className="p-6 space-y-4 sm:space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className={labelClass}>Label</label><input required className={inputClass} placeholder="Home" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></div>
                          <div><label className={labelClass}>Full Name</label><input required className={inputClass} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                        </div>
                        <div><label className={labelClass}>Address Line 1</label><input required className={inputClass} placeholder="Street address" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></div>
                        <div><label className={labelClass}>Address Line 2 (optional)</label><input className={inputClass} placeholder="Apartment, suite, etc." value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} /></div>
                        <div className="grid grid-cols-3 gap-4">
                          <div><label className={labelClass}>City</label><input required className={inputClass} placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                          <div><label className={labelClass}>State</label><input required className={inputClass} placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
                          <div><label className={labelClass}>ZIP / PIN</label><input required className={inputClass} placeholder="000000" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} /></div>
                        </div>
                        <div><label className={labelClass}>Country</label><input required className={inputClass} placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                        <div>
                          <label className={labelClass}>Mobile Number</label>
                          <input required className={inputClass} placeholder="e.g. +91 98765 43210" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button type="submit" className="flex-1 py-3 bg-milano-red text-lemon-chiffon font-headline-md uppercase tracking-widest hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface">
                            {editingId ? "Save Changes" : "Add Address"}
                          </button>
                          <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border-2 border-on-surface font-label-bold text-xs uppercase tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
