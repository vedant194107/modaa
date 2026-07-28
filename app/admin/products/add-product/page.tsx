"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthUser, loginUserAsync, UserSession } from "@/lib/authHelper";
import AdminHeader from "@/components/AdminHeader";

function AddProductContent() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [error, setError] = useState("");

  // Login Gate State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Denim");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("50");
  const [description, setDescription] = useState("");

  // Brand Specification Accordion Fields
  const [materials, setMaterials] = useState("");
  const [fitGuide, setFitGuide] = useState("");
  const [shippingInfo, setShippingInfo] = useState("");
  const [sustainability, setSustainability] = useState("");

  // Image 1 (Primary) State
  const [image1Type, setImage1Type] = useState<"url" | "file">("url");
  const [image1Url, setImage1Url] = useState("");

  // Image 2 (Hover) State
  const [image2Type, setImage2Type] = useState<"url" | "file">("url");
  const [image2Url, setImage2Url] = useState("");

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        if (target === 1) setImage1Url(reader.result as string);
        else setImage2Url(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !category || !price || !image1Url) {
      setError("Please fill out all required fields and provide a primary product image.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          price,
          image1: image1Url,
          image2: image2Url || image1Url,
          description,
          stock,
          materials,
          fit_guide: fitGuide,
          shipping_info: shippingInfo,
          sustainability,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setToastMsg("PRODUCT CREATED SUCCESSFULLY WITH ACCORDION SPECS!");
        setTimeout(() => {
          router.push(data.id ? `/admin/products/view-product?id=${data.id}` : "/admin/products");
        }, 1000);
      } else {
        setError(data.error || "Failed to create product.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Network error while saving product.");
    }
  };

  const labelClass = "font-label-bold text-xs uppercase tracking-wider text-on-surface/70 block mb-1";
  const inputClass = "w-full bg-lemon-chiffon border-2 border-on-surface p-3 font-label-bold text-sm focus:outline-none focus:border-milano-red uppercase placeholder:normal-case placeholder:font-normal placeholder:opacity-50";

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface flex flex-col justify-between">
      <AdminHeader authUser={authUser} activeTab="products" />

      <main className="flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-8 sm:py-12">
        {!authUser || authUser.role !== "Admin" ? (
          <div className="max-w-md mx-auto border-4 border-on-surface p-8 sm:p-10 bg-surface shadow-[8px_8px_0px_0px_#a90e02] my-8">
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-5xl text-milano-red mb-2">lock_person</span>
              <h1 className="font-display-xl text-3xl uppercase">ADMIN AUTHENTICATION</h1>
              <p className="font-body-md text-xs text-on-surface/70 mt-2 uppercase tracking-wide">
                ENTER YOUR ADMIN EMAIL ID & PASSWORD TO ADD NEW PRODUCTS.
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
          <div className="space-y-8">
            {/* Header Nav Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-on-surface pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link href="/admin/products" className="font-label-bold text-xs uppercase text-milano-red hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    PRODUCTS CATALOG
                  </Link>
                  <span className="text-on-surface/30">/</span>
                  <span className="font-label-bold text-xs uppercase text-on-surface/60">ADD PRODUCT</span>
                </div>
                <h1 className="font-display-xl text-3xl sm:text-5xl uppercase">ADD CATALOG PRODUCT</h1>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/products"
                  className="px-5 py-2.5 bg-surface text-on-surface font-label-bold text-xs uppercase tracking-widest hover:bg-on-surface hover:text-lemon-chiffon transition-colors border-2 border-on-surface flex items-center gap-2"
                >
                  Cancel / Return
                </Link>
              </div>
            </div>

            {toastMsg && (
              <div className="p-4 bg-on-surface text-green-400 font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{toastMsg}</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form & Live Preview Layout */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Input Columns */}
              <div className="lg:col-span-8 border-4 border-on-surface p-6 sm:p-8 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-6">
                <h2 className="font-headline-md text-2xl uppercase border-b-2 border-on-surface pb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-milano-red">inventory_2</span>
                  PRODUCT DETAILS & ACCORDION SPECS
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>PRODUCT TITLE *</label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. ARCHITECTURAL CARGO SYSTEM"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>CATEGORY *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="Outerwear">Outerwear</option>
                        <option value="Denim">Denim</option>
                        <option value="Tops">Tops</option>
                        <option value="Pants">Pants</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Footwear">Footwear</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>PRICE ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="245.00"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>STOCK INVENTORY *</label>
                      <input
                        type="number"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="50"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>DESCRIPTION & DESIGN PHILOSOPHY</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the design concept, cut, and archive details..."
                      className={`${inputClass} normal-case resize-y`}
                    />
                  </div>
                </div>

                {/* ── BRAND SPECIFICATION ACCORDION EDITABLE FIELDS ── */}
                <div className="border-2 border-on-surface p-5 bg-lemon-chiffon/60 space-y-4">
                  <h3 className="font-headline-md text-lg uppercase text-milano-red border-b border-on-surface/20 pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">tune</span>
                    PRODUCT DETAIL PAGE BRAND ACCORDIONS
                  </h3>

                  <div>
                    <label className={labelClass}>1. MATERIALS & FABRIC SPECS</label>
                    <input
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                      placeholder="e.g. 500GSM Heavyweight Organic Japanese Cotton, DWR Finish"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>2. FIT & SILHOUETTE GUIDE</label>
                    <input
                      value={fitGuide}
                      onChange={(e) => setFitGuide(e.target.value)}
                      placeholder="e.g. Oversized Boxy Fit. Model is 6'1 wearing Size L."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>3. SHIPPING & RETURNS POLICY</label>
                    <input
                      value={shippingInfo}
                      onChange={(e) => setShippingInfo(e.target.value)}
                      placeholder="e.g. Express Worldwide Shipping via DHL. 30-Day Free Returns."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>4. SUSTAINABILITY & CRAFTSMANSHIP</label>
                    <input
                      value={sustainability}
                      onChange={(e) => setSustainability(e.target.value)}
                      placeholder="e.g. Ethically tailored in small batches using 100% organic cotton."
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* ── PHOTO 1: PRIMARY IMAGE UPLOAD / URL ── */}
                <div className="border-2 border-on-surface p-5 bg-lemon-chiffon/50 space-y-4">
                  <div className="flex justify-between items-center border-b border-on-surface/20 pb-2">
                    <label className="font-label-bold text-xs uppercase text-milano-red flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      PRIMARY PRODUCT PHOTO (IMAGE 1) *
                    </label>
                    <div className="flex border border-on-surface bg-surface text-[10px] font-label-bold uppercase">
                      <button
                        type="button"
                        onClick={() => setImage1Type("url")}
                        className={`px-3 py-1 cursor-pointer ${image1Type === "url" ? "bg-on-surface text-lemon-chiffon" : "hover:bg-lemon-chiffon"}`}
                      >
                        Image URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setImage1Type("file")}
                        className={`px-3 py-1 cursor-pointer ${image1Type === "file" ? "bg-on-surface text-lemon-chiffon" : "hover:bg-lemon-chiffon"}`}
                      >
                        Upload File
                      </button>
                    </div>
                  </div>

                  {image1Type === "url" ? (
                    <div>
                      <input
                        type="url"
                        value={image1Url}
                        onChange={(e) => setImage1Url(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className={inputClass}
                      />
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 1)}
                        className="w-full bg-surface border-2 border-on-surface p-2 font-label-bold text-xs cursor-pointer"
                      />
                      <p className="font-body-md text-[10px] opacity-60 uppercase mt-1">Select an image file from your computer (PNG, JPG, WEBP).</p>
                    </div>
                  )}
                </div>

                {/* ── PHOTO 2: HOVER IMAGE UPLOAD / URL ── */}
                <div className="border-2 border-on-surface p-5 bg-lemon-chiffon/50 space-y-4">
                  <div className="flex justify-between items-center border-b border-on-surface/20 pb-2">
                    <label className="font-label-bold text-xs uppercase text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">filter_2</span>
                      HOVER PHOTO (IMAGE 2 - OPTIONAL)
                    </label>
                    <div className="flex border border-on-surface bg-surface text-[10px] font-label-bold uppercase">
                      <button
                        type="button"
                        onClick={() => setImage2Type("url")}
                        className={`px-3 py-1 cursor-pointer ${image2Type === "url" ? "bg-on-surface text-lemon-chiffon" : "hover:bg-lemon-chiffon"}`}
                      >
                        Image URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setImage2Type("file")}
                        className={`px-3 py-1 cursor-pointer ${image2Type === "file" ? "bg-on-surface text-lemon-chiffon" : "hover:bg-lemon-chiffon"}`}
                      >
                        Upload File
                      </button>
                    </div>
                  </div>

                  {image2Type === "url" ? (
                    <div>
                      <input
                        type="url"
                        value={image2Url}
                        onChange={(e) => setImage2Url(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className={inputClass}
                      />
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 2)}
                        className="w-full bg-surface border-2 border-on-surface p-2 font-label-bold text-xs cursor-pointer"
                      />
                      <p className="font-body-md text-[10px] opacity-60 uppercase mt-1">Select a secondary hover view photo (e.g. back view or close-up).</p>
                    </div>
                  )}
                </div>

                {/* Submit Action Buttons */}
                <div className="flex gap-4 pt-4 border-t-2 border-on-surface">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-milano-red text-lemon-chiffon font-headline-md text-base uppercase tracking-widest hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface shadow-[4px_4px_0px_0px_#000]"
                  >
                    {loading ? "CREATING CATALOG ITEM..." : "SAVE & CREATE PRODUCT"}
                  </button>
                  <Link
                    href="/admin/products"
                    className="px-6 py-4 border-2 border-on-surface font-headline-md text-base uppercase tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors text-center"
                  >
                    CANCEL
                  </Link>
                </div>
              </div>

              {/* Right Side: Live Catalog Card Preview */}
              <div className="lg:col-span-4 sticky top-28 space-y-4">
                <div className="border-4 border-on-surface p-6 bg-surface shadow-[8px_8px_0px_0px_#a90e02]">
                  <h3 className="font-label-bold text-xs uppercase text-milano-red tracking-wider border-b-2 border-on-surface pb-2 mb-4 flex items-center justify-between">
                    <span>LIVE CATALOG CARD PREVIEW</span>
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </h3>

                  <div className="product-card group relative flex flex-col">
                    <div className="relative aspect-[3/4] overflow-hidden bg-white mb-3 border-2 border-on-surface">
                      {image1Url ? (
                        <>
                          <img src={image1Url} alt="Preview 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          {image2Url && (
                            <img src={image2Url} alt="Preview 2" className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110" />
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-lemon-chiffon/60 flex flex-col items-center justify-center p-6 text-center text-on-surface/40">
                          <span className="material-symbols-outlined text-5xl mb-2">add_a_photo</span>
                          <span className="font-label-bold text-xs uppercase">No Photo Provided Yet</span>
                        </div>
                      )}
                      <span className="absolute top-2 right-2 bg-on-surface text-lemon-chiffon font-label-bold text-[10px] uppercase px-2 py-0.5 z-20">
                        {category}
                      </span>
                    </div>

                    <div className="border-b-2 border-on-surface pb-3">
                      <h4 className="font-headline-md text-lg uppercase leading-tight truncate">
                        {title || "UNTITLED PRODUCT"}
                      </h4>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-milano-red font-headline-md text-xl">
                          ₹{price ? parseFloat(price).toFixed(2) : "0.00"}
                        </span>
                        <span className="font-label-bold text-xs opacity-60 uppercase">
                          Stock: {stock || 50}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="font-body-md text-[10px] opacity-60 uppercase text-center mt-4">
                    Hover over preview card to test hover image transition!
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="w-full bg-on-surface text-lemon-chiffon border-t-4 border-milano-red py-6 px-4 md:px-margin-desktop text-center font-label-bold text-xs uppercase tracking-widest text-lemon-chiffon/60">
        THE DROP ADMIN PORTAL // CREATE CATALOG ITEM
      </footer>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-lemon-chiffon p-12 font-label-bold uppercase text-center">Loading Add Product Form...</div>}>
      <AddProductContent />
    </Suspense>
  );
}
