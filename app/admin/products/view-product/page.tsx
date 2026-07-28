"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuthUser, loginUserAsync, UserSession } from "@/lib/authHelper";
import AdminHeader from "@/components/AdminHeader";

function ViewProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prodId = searchParams.get("id");

  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const [status, setStatus] = useState("ACTIVE");
  const [description, setDescription] = useState("");

  // Brand Accordion Fields State
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

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products?id=${id}`);
      const data = await res.json();
      if (data.success && data.product) {
        const p = data.product;
        setTitle(p.title || "");
        setCategory(p.category || "Denim");
        setPrice(p.price ? String(p.price) : "0.00");
        setStock(p.stock !== undefined ? String(p.stock) : "50");
        setStatus(p.status || "ACTIVE");
        setDescription(p.description || "");
        setImage1Url(p.image1 || "");
        setImage2Url(p.image2 || p.image1 || "");
        setMaterials(p.materials || "");
        setFitGuide(p.fit_guide || "");
        setShippingInfo(p.shipping_info || "");
        setSustainability(p.sustainability || "");
      } else {
        setError(data.error || "Product not found.");
      }
    } catch (err: any) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.role === "Admin" && prodId) {
      fetchProduct(prodId);
    } else {
      setLoading(false);
    }
  }, [authUser, prodId]);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodId) return;
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: prodId,
          title,
          category,
          price,
          image1: image1Url,
          image2: image2Url || image1Url,
          description,
          stock,
          status,
          materials,
          fit_guide: fitGuide,
          shipping_info: shippingInfo,
          sustainability,
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (data.success) {
        setToastMsg("PRODUCT & ACCORDION SPECS UPDATED SUCCESSFULLY!");
        setTimeout(() => setToastMsg(""), 3000);
      } else {
        setError(data.error || "Failed to update product.");
      }
    } catch (err: any) {
      setSaving(false);
      setError(err.message || "Failed to update product.");
    }
  };

  const handleDelete = async () => {
    if (!prodId || !confirm("Are you sure you want to permanently delete this product from the catalog?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${prodId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/products");
      } else {
        setError(data.error || "Failed to delete product.");
      }
    } catch (err: any) {
      setError("Failed to delete product.");
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
                ENTER YOUR ADMIN EMAIL ID & PASSWORD TO VIEW/EDIT PRODUCT.
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
            Loading product details...
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-on-surface pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link href="/admin/products" className="font-label-bold text-xs uppercase text-milano-red hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    PRODUCTS CATALOG
                  </Link>
                  <span className="text-on-surface/30">/</span>
                  <span className="font-label-bold text-xs uppercase text-on-surface/60">VIEW & EDIT PRODUCT</span>
                </div>
                <h1 className="font-display-xl text-3xl sm:text-5xl uppercase">{title || "VIEW PRODUCT"}</h1>
                <p className="font-body-md text-xs text-on-surface/70 uppercase tracking-wider mt-1">
                  PRODUCT ID: <span className="font-mono text-milano-red font-bold">{prodId}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2.5 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete Product
                </button>
                <Link
                  href="/admin/products"
                  className="px-5 py-2.5 bg-surface text-on-surface font-label-bold text-xs uppercase tracking-widest hover:bg-on-surface hover:text-lemon-chiffon transition-colors border-2 border-on-surface"
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

            {error && (
              <div className="p-4 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* View & Edit Layout */}
            <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Fields Form Column */}
              <div className="lg:col-span-8 border-4 border-on-surface p-6 sm:p-8 bg-surface shadow-[8px_8px_0px_0px_#a90e02] space-y-6">
                <h2 className="font-headline-md text-2xl uppercase border-b-2 border-on-surface pb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-milano-red">edit_note</span>
                  EDIT PRODUCT SPECIFICATIONS
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>PRODUCT TITLE *</label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>STOCK *</label>
                      <input
                        type="number"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>STATUS *</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="OUT OF STOCK">OUT OF STOCK</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>PRODUCT DESCRIPTION</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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

                {/* ── PRIMARY PHOTO UPLOAD / URL ── */}
                <div className="border-2 border-on-surface p-5 bg-lemon-chiffon/50 space-y-4">
                  <div className="flex justify-between items-center border-b border-on-surface/20 pb-2">
                    <label className="font-label-bold text-xs uppercase text-milano-red flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      PRIMARY PHOTO (IMAGE 1) *
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
                      <p className="font-body-md text-[10px] opacity-60 uppercase mt-1">Upload new image file to replace current primary photo.</p>
                    </div>
                  )}
                </div>

                {/* ── HOVER PHOTO UPLOAD / URL ── */}
                <div className="border-2 border-on-surface p-5 bg-lemon-chiffon/50 space-y-4">
                  <div className="flex justify-between items-center border-b border-on-surface/20 pb-2">
                    <label className="font-label-bold text-xs uppercase text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">filter_2</span>
                      HOVER PHOTO (IMAGE 2)
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
                      <p className="font-body-md text-[10px] opacity-60 uppercase mt-1">Upload new secondary view photo.</p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 pt-4 border-t-2 border-on-surface">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-4 bg-milano-red text-lemon-chiffon font-headline-md text-base uppercase tracking-widest hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface shadow-[4px_4px_0px_0px_#000]"
                  >
                    {saving ? "SAVING CHANGES..." : "SAVE PRODUCT CHANGES"}
                  </button>
                  <Link
                    href="/admin/products"
                    className="px-6 py-4 border-2 border-on-surface font-headline-md text-base uppercase tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors text-center"
                  >
                    BACK
                  </Link>
                </div>
              </div>

              {/* Right Side Column: Live Product Card Preview */}
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
                        <div className="w-full h-full bg-lemon-chiffon/60 flex items-center justify-center text-on-surface/40 font-label-bold text-xs uppercase">
                          No Image
                        </div>
                      )}
                      <span className="absolute top-2 right-2 bg-on-surface text-lemon-chiffon font-label-bold text-[10px] uppercase px-2 py-0.5 z-20">
                        {category}
                      </span>
                      <span className={`absolute bottom-2 left-2 font-label-bold text-[10px] uppercase px-2 py-0.5 border border-on-surface ${status === "ACTIVE" ? "bg-green-700 text-white" : "bg-milano-red text-lemon-chiffon"}`}>
                        {status}
                      </span>
                    </div>

                    <div className="border-b-2 border-on-surface pb-3">
                      <h4 className="font-headline-md text-lg uppercase leading-tight truncate">
                        {title || "UNTITLED"}
                      </h4>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-milano-red font-headline-md text-xl">
                          ₹{price ? parseFloat(price).toFixed(2) : "0.00"}
                        </span>
                        <span className="font-label-bold text-xs opacity-60 uppercase">
                          Stock: {stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-on-surface/20 space-y-2">
                    <div className="flex justify-between font-label-bold text-xs uppercase">
                      <span className="opacity-60">Status:</span>
                      <span className={status === "ACTIVE" ? "text-green-700 font-bold" : "text-milano-red font-bold"}>{status}</span>
                    </div>
                    <div className="flex justify-between font-label-bold text-xs uppercase">
                      <span className="opacity-60">Stock Inventory:</span>
                      <span>{stock} Units</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="w-full bg-on-surface text-lemon-chiffon border-t-4 border-milano-red py-6 px-4 md:px-margin-desktop text-center font-label-bold text-xs uppercase tracking-widest text-lemon-chiffon/60">
        THE DROP ADMIN PORTAL // VIEW & EDIT PRODUCT
      </footer>
    </div>
  );
}

export default function ViewProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-lemon-chiffon p-12 font-label-bold uppercase text-center">Loading Product Details...</div>}>
      <ViewProductContent />
    </Suspense>
  );
}
