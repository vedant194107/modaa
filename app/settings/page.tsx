"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getWishlist } from "@/lib/wishlistHelper";

const SETTINGS_KEY = "the_drop_settings";

const defaultSettings = {
  firstName: "Vedant",
  lastName: "Dayala",
  email: "vedant@thedrop.com",
  phone: "+91 98765 43210",
  emailMarketing: true,
  smsAlerts: false,
  dropNotifications: true,
  orderUpdates: true,
  currency: "INR",
  language: "English",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "preferences">("profile");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) setSettings(JSON.parse(stored));
    setWishlistCount(getWishlist().length);
    const handleWL = (e: any) => setWishlistCount((e.detail || getWishlist()).length);
    window.addEventListener("wishlist-updated", handleWL);
    return () => window.removeEventListener("wishlist-updated", handleWL);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      setPwError("Passwords do not match.");
      return;
    }
    if (passwords.next.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setPwError("");
    setShowPasswordModal(false);
    setPasswords({ current: "", next: "", confirm: "" });
  };

  const inputClass = "w-full bg-transparent border-b-2 border-on-surface focus:border-milano-red px-0 py-2 font-label-bold text-sm focus:outline-none";
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
              <Link className="group flex items-center justify-between py-3 border-b border-on-surface/20 hover:border-on-surface transition-colors" href="/addresses">
                <span className="font-label-bold uppercase text-on-surface text-sm">Addresses</span>
                <span className="material-symbols-outlined text-on-surface text-lg">arrow_forward</span>
              </Link>
              {/* Active */}
              <Link className="flex items-center justify-between py-3 border-b-2 border-milano-red" href="/settings">
                <span className="font-label-bold uppercase text-milano-red text-sm">Settings</span>
                <span className="material-symbols-outlined text-milano-red text-lg">arrow_forward</span>
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
              <h1 className="font-display-xl text-2xl sm:text-3xl uppercase">Settings</h1>
              {saved && (
                <span className="font-label-bold text-xs uppercase tracking-wider text-milano-red flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span> Saved
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b-2 border-on-surface mb-8 gap-0">
              {(["profile", "notifications", "preferences"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 font-label-bold text-xs uppercase tracking-widest transition-colors cursor-pointer border-r border-on-surface/20 ${
                    activeTab === tab
                      ? "bg-on-surface text-lemon-chiffon"
                      : "bg-transparent text-on-surface hover:bg-on-surface/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave}>
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input className={inputClass} value={settings.firstName} onChange={(e) => setSettings({ ...settings, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input className={inputClass} value={settings.lastName} onChange={(e) => setSettings({ ...settings, lastName: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input type="email" className={inputClass} value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input type="tel" className={inputClass} value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 border-on-surface/10">
                    <p className="font-label-bold text-xs uppercase tracking-wider opacity-60 mb-3">Password & Security</p>
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center gap-2 px-5 py-2.5 border-2 border-on-surface font-label-bold text-xs uppercase tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Change Password
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  {([
                    { key: "emailMarketing", label: "Marketing Emails", desc: "New drops, exclusive offers, and editorial content" },
                    { key: "smsAlerts", label: "SMS Alerts", desc: "Flash sales and limited drop reminders via text" },
                    { key: "dropNotifications", label: "Drop Notifications", desc: "Instant alerts when your reserved items go live" },
                    { key: "orderUpdates", label: "Order Updates", desc: "Shipping, delivery, and order confirmation updates" },
                  ] as { key: keyof typeof settings; label: string; desc: string }[]).map(({ key, label, desc }) => (
                    <div key={key} className="flex items-start justify-between gap-4 py-4 border-b border-on-surface/10">
                      <div>
                        <p className="font-label-bold text-sm uppercase tracking-wider">{label}</p>
                        <p className="font-body-md text-xs text-on-surface/60 mt-0.5">{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] })}
                        className={`relative w-12 h-6 rounded-full border-2 transition-colors flex-shrink-0 cursor-pointer ${
                          settings[key as keyof typeof settings] ? "bg-milano-red border-milano-red" : "bg-on-surface/10 border-on-surface/30"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white border border-on-surface/20 rounded-full transition-transform ${settings[key as keyof typeof settings] ? "translate-x-6" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Currency</label>
                      <select
                        className={`${inputClass} cursor-pointer`}
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      >
                        {["INR", "USD", "EUR", "GBP", "JPY", "AED"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Language</label>
                      <select
                        className={`${inputClass} cursor-pointer`}
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      >
                        {["English", "Hindi", "Japanese", "French", "German", "Arabic"].map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-on-surface/10">
                    <p className="font-label-bold text-xs uppercase tracking-wider opacity-60 mb-4">Danger Zone</p>
                    <button type="button" className="flex items-center gap-2 px-5 py-2.5 border-2 border-milano-red text-milano-red font-label-bold text-xs uppercase tracking-wider hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-sm">delete_forever</span>
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t-2 border-on-surface/10">
                <button
                  type="submit"
                  className="px-10 py-3.5 bg-milano-red text-lemon-chiffon font-headline-md text-sm uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-lemon-chiffon border-4 border-on-surface w-full max-w-md shadow-[8px_8px_0px_0px_#a90e02]">
            <div className="flex justify-between items-center px-6 py-4 border-b-2 border-on-surface">
              <h2 className="font-display-xl text-xl uppercase">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="material-symbols-outlined hover:text-milano-red transition-colors cursor-pointer">close</button>
            </div>
            <form onSubmit={handlePasswordSave} className="p-6 space-y-5">
              <div>
                <label className={labelClass}>Current Password</label>
                <input type="password" required className={inputClass} placeholder="••••••••" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input type="password" required className={inputClass} placeholder="Min 8 characters" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input type="password" required className={inputClass} placeholder="Repeat new password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
              </div>
              {pwError && <p className="text-milano-red font-label-bold text-xs uppercase">{pwError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-milano-red text-lemon-chiffon font-headline-md uppercase tracking-widest hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface">
                  Update Password
                </button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-6 py-3 border-2 border-on-surface font-label-bold text-xs uppercase hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
