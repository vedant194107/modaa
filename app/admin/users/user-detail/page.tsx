"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuthUser, UserSession } from "@/lib/authHelper";
import AdminHeader from "@/components/AdminHeader";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  member_since: string;
  created_at: string;
}

interface OrderRecord {
  id: string;
  user_id: string;
  order_number: string;
  total: number;
  status: string;
  items_json: string;
  created_at: string;
}

interface AddressRecord {
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

function UserDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id") || "usr_vip_01";

  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [user, setUser] = useState<UserRecord | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const active = getAuthUser();
    setAuthUser(active);

    const handleAuth = () => setAuthUser(getAuthUser());
    window.addEventListener("auth-updated", handleAuth);
    return () => window.removeEventListener("auth-updated", handleAuth);
  }, []);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users from SQLite
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      let targetUser: UserRecord | null = null;

      if (data.success && Array.isArray(data.users)) {
        const found = data.users.find((u: UserRecord) => u.id === userId || u.email === userId);
        if (found) targetUser = found;
      }

      if (!targetUser) {
        targetUser = {
          id: userId,
          name: "Vedant Dayala",
          email: "vedant@thedrop.com",
          role: "VIP Client",
          member_since: "MAR 2024",
          created_at: "2026-07-25 08:35:38",
        };
      }
      setUser(targetUser);

      // 2. Fetch REAL Orders for this specific user from database
      const ordRes = await fetch(`/api/admin/orders?userId=${targetUser.id}&t=${Date.now()}`);
      const ordData = await ordRes.json();

      if (ordData.success && Array.isArray(ordData.orders)) {
        setOrders(ordData.orders);
      } else {
        setOrders([]);
      }

      // 3. Fetch PARTICULAR Addresses for THIS specific user from database
      const addrRes = await fetch(`/api/admin/addresses?userId=${targetUser.id}&t=${Date.now()}`);
      const addrData = await addrRes.json();

      if (addrData.success && Array.isArray(addrData.addresses)) {
        const mapped = addrData.addresses.map((a: any) => ({
          id: a.id,
          label: a.label || "Home Address",
          name: a.name || targetUser?.name || "VIP Member",
          line1: a.line1 || "",
          line2: a.line2 || "",
          city: a.city || "",
          state: a.state || "",
          zip: a.zip || "",
          country: a.country || "India",
          phone: a.phone || "",
          isDefault: Boolean(a.is_default),
        }));
        setAddresses(mapped);
      } else {
        setAddresses([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.role === "Admin") {
      fetchUserDetail();
    }
  }, [authUser, userId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleToggleBan = async () => {
    if (!user) return;
    const isBanned = user.status === "banned";
    const nextStatus = isBanned ? "active" : "banned";
    const confirmMsg = isBanned
      ? `Are you sure you want to UNBAN ${user.name}'s account?`
      : `Are you sure you want to BAN ${user.name}'s account? The user will see a ban notice on their profile.`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, status: nextStatus });
        showToast(`User account is now ${nextStatus.toUpperCase()}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleRole = async () => {
    if (!user) return;
    const nextRole = user.role === "Admin" ? "VIP Client" : "Admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role: nextRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, role: nextRole });
        showToast(`User role updated to ${nextRole}.`);
      }
    } catch (e) {}
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    if (!confirm(`Are you sure you want to delete user ${user.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("User deleted from database.");
        router.push("/admin/users");
      }
    } catch (e) {}
  };

  const totalSpent = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);

  const parseItemsSummary = (itemsJsonStr: string) => {
    try {
      const parsed = JSON.parse(itemsJsonStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => `${item.title} (${item.size || 'M'}, QTY ${item.qty || 1})`).join(" + ");
      }
    } catch (e) {}
    return itemsJsonStr;
  };

  if (!authUser || authUser.role !== "Admin") {
    return (
      <div className="max-w-xl mx-auto border-4 border-on-surface p-8 sm:p-12 text-center bg-surface shadow-[8px_8px_0px_0px_#a90e02] my-12">
        <span className="material-symbols-outlined text-6xl text-milano-red mb-4">admin_panel_settings</span>
        <h1 className="font-display-xl text-3xl uppercase mb-2">ADMIN ACCESS REQUIRED</h1>
        <p className="font-body-md text-sm opacity-70 mb-6 uppercase">
          Please log in with an administrator account to view detailed user profiles.
        </p>
        <Link href="/admin" className="px-8 py-4 bg-milano-red text-lemon-chiffon font-headline-md uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface inline-block">
          GO TO ADMIN LOGIN
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-on-surface pb-6">
        <div>
          <Link href="/admin/users" className="font-label-bold text-xs uppercase text-milano-red hover:underline flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Users Management
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display-xl text-3xl sm:text-5xl uppercase">{user?.name || "User Detail"}</h1>
            <span className={`px-3 py-1 font-label-bold text-xs uppercase border ${
              user?.role === "Admin" ? "bg-milano-red text-lemon-chiffon border-milano-red" : "bg-on-surface text-lemon-chiffon border-on-surface"
            }`}>
              {user?.role || "VIP Client"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleBan}
            className={`px-4 py-2 font-label-bold text-xs uppercase tracking-wider transition-colors border-2 cursor-pointer ${
              user?.status === "banned"
                ? "bg-green-700 text-lemon-chiffon border-green-700 hover:bg-on-surface"
                : "bg-milano-red text-lemon-chiffon border-milano-red hover:bg-on-surface"
            }`}
          >
            {user?.status === "banned" ? "UNBAN ACCOUNT" : "BAN ACCOUNT"}
          </button>
          <button
            onClick={handleToggleRole}
            className="px-4 py-2 bg-on-surface text-lemon-chiffon font-label-bold text-xs uppercase tracking-wider hover:bg-milano-red transition-colors border-2 border-on-surface cursor-pointer"
          >
            Toggle {user?.role === "Admin" ? "VIP Client" : "Admin Director"}
          </button>
          <button
            onClick={handleDeleteUser}
            className="px-4 py-2 border-2 border-milano-red text-milano-red font-label-bold text-xs uppercase tracking-wider hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMsg && (
        <div className="p-4 bg-on-surface text-green-400 font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Profile Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="border-2 border-on-surface p-5 bg-surface shadow-[4px_4px_0px_0px_#a90e02]">
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-on-surface/50">Total Lifetime Spent</p>
          <p className="font-display-xl text-3xl text-milano-red mt-1">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="border-2 border-on-surface p-5 bg-surface">
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-on-surface/50">Database Orders</p>
          <p className="font-display-xl text-3xl mt-1">{orders.length} {orders.length === 1 ? "Order" : "Orders"}</p>
        </div>
        <div className="border-2 border-on-surface p-5 bg-surface">
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-on-surface/50">Saved Shipping Addresses</p>
          <p className="font-display-xl text-3xl mt-1">{addresses.length} {addresses.length === 1 ? "Address" : "Addresses"}</p>
        </div>
        <div className="border-2 border-on-surface p-5 bg-surface">
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-on-surface/50">Account Status</p>
          {user?.status === "banned" ? (
            <p className="font-label-bold text-sm text-milano-red uppercase mt-2 font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-milano-red animate-pulse"></span> BANNED ACCOUNT
            </p>
          ) : (
            <p className="font-label-bold text-sm text-green-700 uppercase mt-2 font-bold">● VERIFIED ACTIVE</p>
          )}
        </div>
      </div>

      {/* Detailed Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Personal & Account Information */}
        <div className="border-2 border-on-surface bg-surface p-6 space-y-4">
          <h3 className="font-display-xl text-xl uppercase border-b-2 border-on-surface pb-3">ACCOUNT INFORMATION</h3>
          
          <div className="space-y-3 font-body-md text-sm">
            <div className="flex justify-between py-2 border-b border-on-surface/10">
              <span className="font-label-bold text-xs uppercase opacity-60">System User ID</span>
              <span className="font-label-bold text-xs uppercase text-milano-red">{user?.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-on-surface/10">
              <span className="font-label-bold text-xs uppercase opacity-60">Full Name</span>
              <span className="font-headline-md uppercase">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-on-surface/10">
              <span className="font-label-bold text-xs uppercase opacity-60">Email Address</span>
              <span className="font-label-bold text-xs">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-on-surface/10">
              <span className="font-label-bold text-xs uppercase opacity-60">Account Role</span>
              <span className="font-label-bold text-xs uppercase text-milano-red">{user?.role}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-on-surface/10">
              <span className="font-label-bold text-xs uppercase opacity-60">Member Since</span>
              <span className="font-label-bold text-xs uppercase">{user?.member_since || "MAR 2024"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-label-bold text-[10px] uppercase opacity-50">Database Timestamp</span>
              <span className="font-label-bold text-[10px] opacity-60">{user?.created_at || "2026-07-25 08:35:38"}</span>
            </div>
          </div>
        </div>

        {/* User's Particular Saved Shipping Addresses */}
        <div className="border-2 border-on-surface bg-surface p-6 space-y-4">
          <div className="flex justify-between items-center border-b-2 border-on-surface pb-3">
            <h3 className="font-display-xl text-xl uppercase">SAVED SHIPPING ADDRESSES ({addresses.length})</h3>
            <span className="font-label-bold text-xs uppercase text-milano-red">● USER SPECIFIC</span>
          </div>
          
          {addresses.length === 0 ? (
            <div className="border-2 border-dashed border-on-surface/30 p-6 text-center bg-surface">
              <span className="material-symbols-outlined text-4xl text-on-surface/30 mb-2">location_off</span>
              <h4 className="font-display-xl text-base uppercase text-on-surface/70">NO SAVED ADDRESSES RECORDED</h4>
              <p className="font-body-md text-xs text-on-surface/50 mt-1 uppercase tracking-wider">
                This user has not saved any shipping addresses in their profile yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`border-2 p-4 relative ${
                    addr.isDefault
                      ? "border-milano-red bg-lemon-chiffon shadow-[4px_4px_0px_0px_#a90e02]"
                      : "border-on-surface bg-surface"
                  }`}
                >
                  {addr.isDefault && (
                    <span className="absolute top-3 right-3 bg-milano-red text-lemon-chiffon font-label-bold text-[9px] uppercase px-2 py-0.5">
                      DEFAULT
                    </span>
                  )}
                  <p className="font-label-bold text-[10px] uppercase text-on-surface/50 mb-1">{addr.label}</p>
                  <p className="font-headline-md text-base uppercase mb-1">{addr.name || user?.name}</p>
                  <p className="font-body-md text-sm text-on-surface/80">{addr.line1}</p>
                  {addr.line2 && <p className="font-body-md text-sm text-on-surface/80">{addr.line2}</p>}
                  <p className="font-body-md text-sm text-on-surface/80">{addr.city}, {addr.state} {addr.zip}</p>
                  <p className="font-body-md text-sm text-on-surface/80">{addr.country}</p>
                  {addr.phone && <p className="font-body-md text-sm text-milano-red mt-1 font-label-bold">Mobile: {addr.phone}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Real Orders History Table Queried from SQLite */}
      <div className="space-y-4">
        <h3 className="font-display-xl text-2xl uppercase">
          DATABASE ORDERS HISTORY ({orders.length})
        </h3>
        
        {loading ? (
          <div className="p-8 border-2 border-on-surface bg-surface text-center font-label-bold uppercase">
            Loading real orders from database...
          </div>
        ) : orders.length === 0 ? (
          <div className="border-2 border-on-surface p-8 bg-surface text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface/40 mb-2">shopping_bag</span>
            <h4 className="font-display-xl text-lg uppercase">NO ORDERS RECORDED IN DATABASE</h4>
            <p className="font-body-md text-xs text-on-surface/60 mt-1 uppercase tracking-wider">
              This user currently has 0 order records in the database table.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-on-surface bg-surface">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-on-surface text-lemon-chiffon font-label-bold text-xs uppercase tracking-wider border-b-2 border-on-surface">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date Created</th>
                  <th className="p-4">Items Purchased</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-on-surface/20 font-body-md text-sm">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-lemon-chiffon/50 transition-colors">
                    <td className="p-4 font-label-bold text-xs uppercase text-milano-red">
                      <Link href={`/admin/orders/order-details?id=${encodeURIComponent(ord.id)}`} className="hover:underline">
                        {ord.order_number || ord.id}
                      </Link>
                    </td>
                    <td className="p-4 font-label-bold text-xs text-on-surface/60">{ord.created_at}</td>
                    <td className="p-4 font-headline-md uppercase">{parseItemsSummary(ord.items_json)}</td>
                    <td className="p-4 font-headline-md text-milano-red">${Number(ord.total).toFixed(2)}</td>
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

    </div>
  );
}

export default function UserDetailPage() {
  const [authUser, setAuthUser] = useState<UserSession | null>(null);

  useEffect(() => {
    setAuthUser(getAuthUser());
    const handleAuth = () => setAuthUser(getAuthUser());
    window.addEventListener("auth-updated", handleAuth);
    return () => window.removeEventListener("auth-updated", handleAuth);
  }, []);

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface flex flex-col justify-between">
      {/* Reusable Admin Header & Navigation */}
      <AdminHeader authUser={authUser} activeTab="user-detail" />

      <main className="flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-8 sm:py-12">
        <Suspense fallback={<div className="p-12 text-center font-label-bold uppercase">Loading user details...</div>}>
          <UserDetailContent />
        </Suspense>
      </main>

      <footer className="w-full bg-on-surface text-lemon-chiffon border-t-4 border-milano-red py-6 px-4 md:px-margin-desktop text-center font-label-bold text-xs uppercase tracking-widest text-lemon-chiffon/60">
        THE DROP ADMIN PORTAL // USER PROFILE AUDIT
      </footer>
    </div>
  );
}
