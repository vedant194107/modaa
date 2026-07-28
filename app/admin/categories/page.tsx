"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuthUser, loginUserAsync, UserSession } from "@/lib/authHelper";
import AdminHeader from "@/components/AdminHeader";

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  created_at?: string;
}

export default function AdminCategoriesPage() {
  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [error, setError] = useState("");

  // Login Gate State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImageType, setCatImageType] = useState<"url" | "file">("url");
  const [catImageUrl, setCatImageUrl] = useState("");

  useEffect(() => {
    const user = getAuthUser();
    setAuthUser(user);

    const handleAuth = () => setAuthUser(getAuthUser());
    window.addEventListener("auth-updated", handleAuth);
    return () => window.removeEventListener("auth-updated", handleAuth);
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.role === "Admin") {
      fetchCategories();
    }
  }, [authUser]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setCatImageUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setCatName("");
    setCatDesc("");
    setCatImageUrl("");
    setCatImageType("url");
    setShowModal(true);
  };

  const openEditModal = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || "");
    setCatImageUrl(cat.image || "");
    setCatImageType("url");
    setShowModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      const isEdit = Boolean(editingCategory);
      const url = "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit
        ? { id: editingCategory?.id, name: catName, description: catDesc, image: catImageUrl }
        : { name: catName, description: catDesc, image: catImageUrl };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Category updated successfully!" : "New category created successfully!");
        setShowModal(false);
        fetchCategories();
      } else {
        alert(data.error || "Failed to save category.");
      }
    } catch (e: any) {
      alert("Error saving category.");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Category removed.");
        fetchCategories();
      }
    } catch (e) {}
  };

  const labelClass = "font-label-bold text-xs uppercase tracking-wider text-on-surface/70 block mb-1";
  const inputClass = "w-full bg-lemon-chiffon border-2 border-on-surface p-3 font-label-bold text-sm focus:outline-none focus:border-milano-red uppercase placeholder:normal-case placeholder:font-normal placeholder:opacity-50";

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface flex flex-col justify-between">
      <AdminHeader authUser={authUser} activeTab="categories" counts={{ categories: categories.length }} />

      <main className="flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-8 sm:py-12">
        {!authUser || authUser.role !== "Admin" ? (
          <div className="max-w-md mx-auto border-4 border-on-surface p-8 sm:p-10 bg-surface shadow-[8px_8px_0px_0px_#a90e02] my-8">
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-5xl text-milano-red mb-2">lock_person</span>
              <h1 className="font-display-xl text-3xl uppercase">ADMIN AUTHENTICATION</h1>
              <p className="font-body-md text-xs text-on-surface/70 mt-2 uppercase tracking-wide">
                ENTER YOUR ADMIN EMAIL ID & PASSWORD TO ACCESS CATEGORIES DATABASE.
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
            {/* Header Navigation Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-on-surface pb-6">
              <div>
                <h1 className="font-display-xl text-3xl sm:text-5xl uppercase">CATEGORY DATABASE</h1>
                <p className="font-body-md text-xs text-on-surface/70 uppercase tracking-wider mt-1">
                  MANAGE ALL CLOTHING CATEGORIES, SLUGS, DESCRIPTIONS, AND CATEGORY IMAGES.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={openCreateModal}
                  className="px-5 py-2.5 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">category</span> Create New Category
                </button>
              </div>
            </div>

            {toastMsg && (
              <div className="p-4 bg-on-surface text-green-400 font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{toastMsg}</span>
              </div>
            )}

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="border-4 border-on-surface bg-surface p-5 shadow-[6px_6px_0px_0px_#a90e02] flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/9] mb-4 overflow-hidden border-2 border-on-surface bg-white relative">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 bg-milano-red text-lemon-chiffon font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
                        {cat.slug}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-2xl uppercase leading-tight">{cat.name}</h3>
                    <p className="font-body-md text-xs opacity-70 mt-2 line-clamp-2 uppercase">
                      {cat.description || "No description provided."}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t-2 border-on-surface/20 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-on-surface/50 font-bold uppercase">{cat.id}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="px-3 py-1 border border-on-surface bg-lemon-chiffon font-label-bold text-[10px] uppercase hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="px-3 py-1 border border-milano-red text-milano-red font-label-bold text-[10px] uppercase hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Create / Edit Category */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-on-surface/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-lemon-chiffon border-4 border-on-surface w-full max-w-lg shadow-[8px_8px_0px_0px_#a90e02]">
            <div className="flex justify-between items-center px-6 py-4 border-b-2 border-on-surface">
              <h2 className="font-display-xl text-xl uppercase">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
              </h2>
              <button onClick={() => setShowModal(false)} className="material-symbols-outlined text-2xl hover:text-milano-red cursor-pointer">close</button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Category Name *</label>
                <input
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Footwear / Eyewear"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Category Description</label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Brief summary of pieces in this collection..."
                  className={`${inputClass} normal-case resize-y`}
                />
              </div>

              {/* Photo Input: URL or Upload File */}
              <div className="border-2 border-on-surface p-4 bg-surface space-y-3">
                <div className="flex justify-between items-center border-b border-on-surface/20 pb-2">
                  <label className="font-label-bold text-xs uppercase text-milano-red flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    Category Banner Photo
                  </label>
                  <div className="flex border border-on-surface bg-surface text-[10px] font-label-bold uppercase">
                    <button
                      type="button"
                      onClick={() => setCatImageType("url")}
                      className={`px-2 py-0.5 cursor-pointer ${catImageType === "url" ? "bg-on-surface text-lemon-chiffon" : "hover:bg-lemon-chiffon"}`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatImageType("file")}
                      className={`px-2 py-0.5 cursor-pointer ${catImageType === "file" ? "bg-on-surface text-lemon-chiffon" : "hover:bg-lemon-chiffon"}`}
                    >
                      File
                    </button>
                  </div>
                </div>

                {catImageType === "url" ? (
                  <input
                    type="url"
                    value={catImageUrl}
                    onChange={(e) => setCatImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={inputClass}
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full bg-surface border-2 border-on-surface p-2 font-label-bold text-xs cursor-pointer"
                    />
                  </div>
                )}

                {catImageUrl && (
                  <div className="w-full h-24 border border-on-surface overflow-hidden bg-white mt-2">
                    <img src={catImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-milano-red text-lemon-chiffon font-headline-md uppercase tracking-widest hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface"
                >
                  {editingCategory ? "Update Category" : "Save Category"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border-2 border-on-surface font-label-bold text-xs uppercase tracking-wider hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="w-full bg-on-surface text-lemon-chiffon border-t-4 border-milano-red py-6 px-4 md:px-margin-desktop text-center font-label-bold text-xs uppercase tracking-widest text-lemon-chiffon/60">
        THE DROP ADMIN PORTAL // CATEGORIES MANAGEMENT
      </footer>
    </div>
  );
}
