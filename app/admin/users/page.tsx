"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuthUser, loginUserAsync, UserSession } from "@/lib/authHelper";
import AdminHeader from "@/components/AdminHeader";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  member_since: string;
  created_at: string;
  phone?: string;
}

export default function AdminUsersPage() {
  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [sortAsc, setSortAsc] = useState(true); // true = oldest first (time-wise ASC)
  const [searchQuery, setSearchQuery] = useState("");

  // Admin Login Gate Form State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  // Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "VIP Client" });

  useEffect(() => {
    const user = getAuthUser();
    setAuthUser(user);

    const handleAuth = () => setAuthUser(getAuthUser());
    window.addEventListener("auth-updated", handleAuth);
    return () => window.removeEventListener("auth-updated", handleAuth);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.role === "Admin") {
      fetchUsers();
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

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === "Admin" ? "VIP Client" : "Admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: nextRole }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchUsers();
      }
    } catch (e) {}
  };

  const handleToggleBan = async (userId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === "banned" ? "active" : "banned";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User account status updated to ${nextStatus.toUpperCase()}.`);
        fetchUsers();
      }
    } catch (e) {}
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user account?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("User deleted from database.");
        fetchUsers();
      }
    } catch (e) {}
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        showToast("New user account created in database.");
        setShowAddUserModal(false);
        setNewUser({ name: "", email: "", password: "", role: "VIP Client" });
        fetchUsers();
      } else {
        alert(data.error || "Failed to create user.");
      }
    } catch (e) {}
  };

  // Search and Sort Users
  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/[^0-9a-z]/g, "");
    
    const nameMatch = u.name.toLowerCase().includes(q);
    const emailMatch = u.email.toLowerCase().includes(q);
    const phoneMatch = u.phone
      ? u.phone.toLowerCase().replace(/[^0-9a-z]/g, "").includes(cleanQ) || u.phone.toLowerCase().includes(q)
      : false;

    return nameMatch || emailMatch || phoneMatch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const parseTime = (val: string) => {
      if (!val) return 0;
      const iso = val.includes("T") ? val : val.replace(" ", "T") + (val.endsWith("Z") ? "" : "Z");
      return new Date(iso).getTime() || 0;
    };
    const timeA = parseTime(a.created_at);
    const timeB = parseTime(b.created_at);
    return sortAsc ? timeA - timeB : timeB - timeA;
  });

  const formatTimestamp = (raw: string) => {
    if (!raw) return "";
    try {
      const iso = raw.includes("T") ? raw : raw.replace(" ", "T") + (raw.endsWith("Z") ? "" : "Z");
      const d = new Date(iso);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      }
    } catch (e) {}
    return raw;
  };

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface flex flex-col justify-between">
      {/* Reusable Admin Header & Navigation */}
      <AdminHeader authUser={authUser} activeTab="users" counts={{ users: users.length }} />

      <main className="flex-1 max-w-container-max w-full mx-auto px-4 md:px-margin-desktop py-8 sm:py-12">
        {!authUser || authUser.role !== "Admin" ? (
          /* Explicit Admin Password Authentication Gate Form */
          <div className="max-w-md mx-auto border-4 border-on-surface p-8 sm:p-10 bg-surface shadow-[8px_8px_0px_0px_#a90e02] my-8">
            <div className="text-center mb-6">
              <span className="material-symbols-outlined text-5xl text-milano-red mb-2">lock</span>
              <h2 className="font-display-xl text-2xl uppercase">ADMIN CREDENTIALS REQUIRED</h2>
              <p className="font-body-md text-xs opacity-70 uppercase tracking-wider mt-1">
                Enter your Admin Email ID and Password to manage registered user accounts.
              </p>
            </div>



            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div>
                <label className="block font-label-bold text-[10px] uppercase tracking-wider opacity-60 mb-1">ADMIN EMAIL / ID</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-on-surface py-2 px-1 font-label-bold text-sm text-on-surface focus:outline-none focus:border-milano-red uppercase"
                  placeholder="admin@thedrop.com"
                />
              </div>

              <div>
                <label className="block font-label-bold text-[10px] uppercase tracking-wider opacity-60 mb-1">ADMIN PASSWORD</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-on-surface py-2 px-1 font-label-bold text-sm text-on-surface focus:outline-none focus:border-milano-red"
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
                <h1 className="font-display-xl text-3xl sm:text-5xl uppercase">REGISTERED USERS DATABASE</h1>
                <p className="font-body-md text-xs text-on-surface/70 uppercase tracking-wider mt-1">
                  CHRONOLOGICAL TIME-WISE ENTRY AUDIT OF ALL CLIENT PROFILES.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Time-wise Sorting Toggle Button */}
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="px-4 py-2.5 bg-on-surface text-lemon-chiffon font-label-bold text-xs uppercase tracking-wider hover:bg-milano-red transition-colors border-2 border-on-surface cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {sortAsc ? "TIME-WISE: OLDEST FIRST ↑" : "TIME-WISE: LATEST FIRST ↓"}
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-5 py-2.5 bg-milano-red text-lemon-chiffon font-label-bold text-xs uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span> Create New User
                </button>
              </div>
            </div>

            {toastMsg && (
              <div className="p-4 bg-on-surface text-green-400 font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{toastMsg}</span>
              </div>
            )}

            {/* Real-time Search Bar & Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface p-4 border-2 border-on-surface shadow-sm">
              <div className="relative w-full sm:w-96">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/50 text-xl">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Name or Mobile Number..."
                  className="w-full bg-lemon-chiffon border-2 border-on-surface pl-10 pr-9 py-2 font-label-bold text-xs uppercase focus:outline-none focus:border-milano-red tracking-wider text-on-surface placeholder:text-on-surface/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/50 hover:text-milano-red cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
              </div>

              <div className="font-label-bold text-xs uppercase text-on-surface/70">
                DISPLAYING <span className="text-milano-red font-bold">{sortedUsers.length}</span> OF {users.length} USERS
              </div>
            </div>

            {/* Registered Users Table with Time-wise Registration Column */}
            <div className="overflow-x-auto border-2 border-on-surface bg-surface">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-on-surface text-lemon-chiffon font-label-bold text-xs uppercase tracking-wider border-b-2 border-on-surface">
                    <th className="p-4">User ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Member Since</th>
                    <th className="p-4">Mobile No</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-on-surface/20 font-body-md text-sm">
                  {sortedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center bg-surface">
                        <span className="material-symbols-outlined text-4xl text-on-surface/30 mb-2">search_off</span>
                        <h4 className="font-display-xl text-base uppercase text-on-surface/70">
                          {searchQuery ? `NO USERS MATCHING "${searchQuery}"` : "NO REGISTERED USERS FOUND"}
                        </h4>
                        <p className="font-body-md text-xs text-on-surface/50 mt-1 uppercase tracking-wider">
                          Try searching with a different user name or mobile number.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    sortedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-lemon-chiffon/50 transition-colors">
                      <td className="p-4 font-label-bold text-xs uppercase text-on-surface/50">{u.id}</td>
                      <td className="p-4 font-headline-md uppercase">
                        {u.name}
                        {u.status === "banned" && (
                          <span className="ml-2 bg-milano-red text-lemon-chiffon text-[9px] font-label-bold px-1.5 py-0.5 uppercase border border-milano-red">
                            BANNED
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-on-surface/80">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 font-label-bold text-[10px] uppercase border ${
                          u.role === "Admin" ? "bg-milano-red text-lemon-chiffon border-milano-red" : "bg-lemon-chiffon text-on-surface border-on-surface"
                        }`}>
                          {u.role || "VIP Client"}
                        </span>
                      </td>
                      <td className="p-4 font-label-bold text-xs text-on-surface/60">{u.member_since || "JUL 2025"}</td>
                      <td className="p-4 font-label-bold text-xs text-milano-red whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">call</span>
                          <span>{u.phone || "+91 98765 43210"}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/users/user-detail?id=${u.id}`}
                            className="h-7 px-2.5 bg-on-surface text-lemon-chiffon border border-on-surface font-label-bold text-[10px] uppercase hover:bg-milano-red transition-colors inline-flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px] leading-none">account_box</span>
                            <span>Profile</span>
                          </Link>
                          <button
                            onClick={() => handleToggleBan(u.id, u.status)}
                            className={`h-7 px-2.5 font-label-bold text-[10px] uppercase transition-colors border inline-flex items-center justify-center cursor-pointer ${
                              u.status === "banned"
                                ? "bg-green-700 text-lemon-chiffon border-green-700 hover:bg-on-surface"
                                : "bg-milano-red text-lemon-chiffon border-milano-red hover:bg-on-surface"
                            }`}
                          >
                            {u.status === "banned" ? "UNBAN" : "BAN"}
                          </button>
                          <button
                            onClick={() => handleToggleRole(u.id, u.role)}
                            className="h-7 px-2.5 border border-on-surface font-label-bold text-[10px] uppercase hover:bg-on-surface hover:text-lemon-chiffon transition-colors inline-flex items-center justify-center cursor-pointer"
                          >
                            Toggle {u.role === "Admin" ? "VIP" : "Admin"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="h-7 px-2.5 border border-milano-red text-milano-red font-label-bold text-[10px] uppercase hover:bg-milano-red hover:text-lemon-chiffon transition-colors inline-flex items-center justify-center cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </main>

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-lemon-chiffon border-4 border-on-surface w-full max-w-md p-6 shadow-[8px_8px_0px_0px_#a90e02] space-y-4">
            <div className="flex justify-between items-center border-b-2 border-on-surface pb-3">
              <h3 className="font-display-xl text-xl uppercase">Create Database User</h3>
              <button onClick={() => setShowAddUserModal(false)} className="material-symbols-outlined hover:text-milano-red cursor-pointer">
                close
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block font-label-bold text-[10px] uppercase opacity-60 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-on-surface py-1 font-label-bold text-sm focus:outline-none focus:border-milano-red uppercase"
                  placeholder="e.g. Marcus Vance"
                />
              </div>
              <div>
                <label className="block font-label-bold text-[10px] uppercase opacity-60 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-on-surface py-1 font-label-bold text-sm focus:outline-none focus:border-milano-red"
                  placeholder="marcus@thedrop.com"
                />
              </div>
              <div>
                <label className="block font-label-bold text-[10px] uppercase opacity-60 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-on-surface py-1 font-label-bold text-sm focus:outline-none focus:border-milano-red"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block font-label-bold text-[10px] uppercase opacity-60 mb-1">Account Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-surface border-2 border-on-surface p-2 font-label-bold text-xs uppercase"
                >
                  <option value="VIP Client">VIP Client</option>
                  <option value="Admin">Admin Director</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-milano-red text-lemon-chiffon font-headline-md text-xs uppercase tracking-widest hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface">
                  Create User
                </button>
                <button type="button" onClick={() => setShowAddUserModal(false)} className="px-5 py-3 border-2 border-on-surface font-label-bold text-xs uppercase hover:bg-on-surface hover:text-lemon-chiffon cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="w-full bg-on-surface text-lemon-chiffon border-t-4 border-milano-red py-6 px-4 md:px-margin-desktop text-center font-label-bold text-xs uppercase tracking-widest text-lemon-chiffon/60">
        THE DROP ADMIN PORTAL // CHRONOLOGICAL USER DIRECTORY AUDIT
      </footer>
    </div>
  );
}
