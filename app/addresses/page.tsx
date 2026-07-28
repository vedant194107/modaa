"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
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
  isDefault: boolean;
}

const sampleAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    name: "Vedant Dayala",
    line1: "42 Brutalist Avenue",
    line2: "Apt 9C",
    city: "Mumbai",
    state: "MH",
    zip: "400001",
    country: "India",
    isDefault: true,
  },
];

const ADDR_KEY = "the_drop_addresses";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
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
  });

  useEffect(() => {
    const saved = localStorage.getItem(ADDR_KEY);
    setAddresses(saved ? JSON.parse(saved) : sampleAddresses);
    setWishlistCount(getWishlist().length);
    const handleWL = (e: any) => setWishlistCount((e.detail || getWishlist()).length);
    window.addEventListener("wishlist-updated", handleWL);
    return () => window.removeEventListener("wishlist-updated", handleWL);
  }, []);

  const save = (list: Address[]) => {
    setAddresses(list);
    localStorage.setItem(ADDR_KEY, JSON.stringify(list));
  };

  const handleDelete = (id: string) => save(addresses.filter((a) => a.id !== id));

  const handleSetDefault = (id: string) =>
    save(addresses.map((a) => ({ ...a, isDefault: a.id === id })));

  const openAdd = () => {
    setEditingId(null);
    setForm({ label: "", name: "", line1: "", line2: "", city: "", state: "", zip: "", country: "India" });
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({ label: addr.label, name: addr.name, line1: addr.line1, line2: addr.line2 || "", city: addr.city, state: addr.state, zip: addr.zip, country: addr.country });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      save(addresses.map((a) => a.id === editingId ? { ...a, ...form } : a));
    } else {
      const newAddr: Address = { ...form, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 };
      save([...addresses, newAddr]);
    }
    setShowForm(false);
  };

  const inputClass = "w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none uppercase placeholder:normal-case placeholder:font-normal placeholder:text-on-surface/40";
  const labelClass = "font-label-bold text-[10px] uppercase tracking-wider opacity-60 block mb-1";

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface">
      <Navbar />

      <main className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-start">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <h2 className="font-display-xl text-3xl sm:text-4xl uppercase mb-6 sm:mb-8">My Account</h2>
            <nav className="flex flex-col gap-3">
              <Link className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors" href="/account">
                <span className="font-label-bold uppercase text-on-surface text-sm">Recent Orders</span>
                <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
              </Link>
              <Link className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors" href="/wishlist">
                <span className="font-label-bold uppercase text-on-surface text-sm">Wishlist</span>
                <div className="flex items-center gap-2">
                  {wishlistCount > 0 && (
                    <span className="bg-milano-red text-lemon-chiffon font-label-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{wishlistCount}</span>
                  )}
                  <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
                </div>
              </Link>
              {/* Active */}
              <Link className="flex items-center justify-between py-3 border-b-2 border-milano-red" href="/addresses">
                <span className="font-label-bold uppercase text-milano-red text-sm">Addresses</span>
                <span className="material-symbols-outlined text-milano-red text-lg">arrow_forward</span>
              </Link>
              <Link className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors" href="/settings">
                <span className="font-label-bold uppercase text-on-surface text-sm">Settings</span>
                <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
              </Link>
              <Link className="group flex items-center justify-between py-3 mt-6" href="#">
                <span className="font-label-bold uppercase text-on-surface/50 text-sm">Log Out</span>
                <span className="material-symbols-outlined text-on-surface/50 text-lg">logout</span>
              </Link>
            </nav>
          </aside>

          {/* Content */}
          <section className="flex-1 w-full">
            <div className="flex justify-between items-end mb-6 border-b-2 border-on-surface pb-4">
              <h1 className="font-display-xl text-2xl sm:text-3xl uppercase">Addresses</h1>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-on-surface text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest hover:bg-milano-red transition-colors border-2 border-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add New
              </button>
            </div>

            {/* Address Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className={`border-2 p-5 relative ${addr.isDefault ? "border-milano-red bg-lemon-chiffon shadow-[4px_4px_0px_0px_#a90e02]" : "border-on-surface bg-surface"}`}>
                  {addr.isDefault && (
                    <span className="absolute top-3 right-3 bg-milano-red text-lemon-chiffon font-label-bold text-[9px] uppercase tracking-wider px-2 py-0.5">
                      Default
                    </span>
                  )}
                  <p className="font-label-bold text-[10px] uppercase tracking-widest text-on-surface/50 mb-2">{addr.label}</p>
                  <p className="font-headline-md text-base uppercase mb-1">{addr.name}</p>
                  <p className="font-body-md text-sm text-on-surface/80">{addr.line1}</p>
                  {addr.line2 && <p className="font-body-md text-sm text-on-surface/80">{addr.line2}</p>}
                  <p className="font-body-md text-sm text-on-surface/80">{addr.city}, {addr.state} {addr.zip}</p>
                  <p className="font-body-md text-sm text-on-surface/80">{addr.country}</p>

                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-on-surface/20">
                    <button onClick={() => openEdit(addr)} className="font-label-bold text-xs uppercase tracking-wider text-on-surface hover:text-milano-red transition-colors">
                      Edit
                    </button>
                    <span className="text-on-surface/20">|</span>
                    {!addr.isDefault && (
                      <>
                        <button onClick={() => handleSetDefault(addr.id)} className="font-label-bold text-xs uppercase tracking-wider text-on-surface hover:text-milano-red transition-colors">
                          Set Default
                        </button>
                        <span className="text-on-surface/20">|</span>
                      </>
                    )}
                    <button onClick={() => handleDelete(addr.id)} className="font-label-bold text-xs uppercase tracking-wider text-on-surface/50 hover:text-milano-red transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New placeholder card */}
              <button
                onClick={openAdd}
                className="border-2 border-dashed border-on-surface/30 hover:border-milano-red p-5 flex flex-col items-center justify-center gap-3 min-h-[160px] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-4xl text-on-surface/30 group-hover:text-milano-red transition-colors">add_circle</span>
                <span className="font-label-bold text-xs uppercase tracking-wider text-on-surface/50 group-hover:text-milano-red transition-colors">Add New Address</span>
              </button>
            </div>

            {/* Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-lemon-chiffon border-4 border-on-surface w-full max-w-lg shadow-[8px_8px_0px_0px_#a90e02]">
                  <div className="flex justify-between items-center px-6 py-4 border-b-2 border-on-surface">
                    <h2 className="font-display-xl text-xl uppercase">{editingId ? "Edit Address" : "New Address"}</h2>
                    <button onClick={() => setShowForm(false)} className="material-symbols-outlined text-on-surface hover:text-milano-red transition-colors cursor-pointer">close</button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Label (e.g. Home, Work)</label>
                        <input required className={inputClass} placeholder="Home" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClass}>Full Name</label>
                        <input required className={inputClass} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Address Line 1</label>
                      <input required className={inputClass} placeholder="Street address" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Address Line 2 (optional)</label>
                      <input className={inputClass} placeholder="Apartment, suite, etc." value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className={labelClass}>City</label>
                        <input required className={inputClass} placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClass}>State</label>
                        <input required className={inputClass} placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClass}>ZIP / PIN</label>
                        <input required className={inputClass} placeholder="000000" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input required className={inputClass} placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 py-3 bg-milano-red text-lemon-chiffon font-headline-md uppercase tracking-widest hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface">
                        {editingId ? "Save Changes" : "Add Address"}
                      </button>
                      <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border-2 border-on-surface font-label-bold text-xs uppercase tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
