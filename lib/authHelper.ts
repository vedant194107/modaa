"use client";

import { syncGuestCartToUser } from "./cartHelper";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  role?: string;
  avatar?: string;
  memberSince?: string;
}

const SESSION_KEY = "the_drop_user_session";
const USERS_KEY = "the_drop_registered_users";

const defaultUser: UserSession = {
  id: "usr_vip_01",
  name: "Vedant Dayala",
  email: "vedant@thedrop.com",
  isLoggedIn: true,
  memberSince: "MAR 2024",
};

export function getAuthUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  try {
    const user = JSON.parse(session);
    return user && user.isLoggedIn ? user : null;
  } catch (e) {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getAuthUser() !== null;
}

export async function loginUserAsync(email: string, password?: string): Promise<{ success: boolean; error?: string; user?: UserSession }> {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!password) {
    return { success: false, error: "Please enter your password." };
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success && data.user) {
      const sessionUser: UserSession = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || "VIP Client",
        isLoggedIn: true,
        memberSince: data.user.memberSince || "JUL 2025",
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      syncGuestCartToUser(sessionUser);
      window.dispatchEvent(new CustomEvent("auth-updated", { detail: sessionUser }));
      return { success: true, user: sessionUser };
    }

    return { success: false, error: data.error || "Authentication failed." };
  } catch (err) {
    return loginUser(email, password);
  }
}

export async function signupUserAsync(name: string, email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserSession }> {
  if (!name.trim()) return { success: false, error: "Please enter your full name." };
  if (!email || !email.includes("@")) return { success: false, error: "Please enter a valid email address." };
  if (!password || password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.toLowerCase().trim(), password }),
    });

    const data = await res.json();

    if (data.success && data.user) {
      const sessionUser: UserSession = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || "VIP Client",
        isLoggedIn: true,
        memberSince: data.user.memberSince || "JUL 2025",
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      syncGuestCartToUser(sessionUser);
      window.dispatchEvent(new CustomEvent("auth-updated", { detail: sessionUser }));
      return { success: true, user: sessionUser };
    }

    return { success: false, error: data.error || "Registration failed." };
  } catch (err) {
    return signupUser(name, email, password);
  }
}

export function loginUser(email: string, password?: string): { success: boolean; error?: string; user?: UserSession } {
  if (typeof window === "undefined") return { success: false, error: "Window not available" };

  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!password) {
    return { success: false, error: "Please enter your password." };
  }

  const cleanEmail = email.toLowerCase().trim();

  // Allow default VIP user
  if (cleanEmail === "vedant@thedrop.com" && password === "password123") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(defaultUser));
    syncGuestCartToUser(defaultUser);
    window.dispatchEvent(new CustomEvent("auth-updated", { detail: defaultUser }));
    return { success: true, user: defaultUser };
  }

  // Check registered users list
  const registeredRaw = localStorage.getItem(USERS_KEY);
  let registeredUsers: any[] = [];
  if (registeredRaw) {
    try {
      registeredUsers = JSON.parse(registeredRaw);
    } catch (e) {}
  }

  const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!existingUser) {
    return { success: false, error: "No account found with this email. Please register first." };
  }

  if (existingUser.password !== password) {
    return { success: false, error: "Incorrect password. Please check your credentials." };
  }

  const sessionUser: UserSession = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    isLoggedIn: true,
    memberSince: existingUser.memberSince || "JUL 2025",
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  syncGuestCartToUser(sessionUser);
  window.dispatchEvent(new CustomEvent("auth-updated", { detail: sessionUser }));

  return { success: true, user: sessionUser };
}

export function signupUser(name: string, email: string, password: string): { success: boolean; error?: string; user?: UserSession } {
  if (typeof window === "undefined") return { success: false, error: "Window not available" };

  if (!name.trim()) return { success: false, error: "Please enter your full name." };
  if (!email || !email.includes("@")) return { success: false, error: "Please enter a valid email address." };
  if (!password || password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

  const cleanEmail = email.toLowerCase().trim();
  const registeredRaw = localStorage.getItem(USERS_KEY);
  let registeredUsers: any[] = [];
  if (registeredRaw) {
    try {
      registeredUsers = JSON.parse(registeredRaw);
    } catch (e) {}
  }

  if (registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: "Email is already registered. Please sign in." };
  }

  const newUser: UserSession = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    isLoggedIn: true,
    memberSince: "JUL 2025",
  };

  registeredUsers.push({ ...newUser, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(registeredUsers));

  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  syncGuestCartToUser(newUser);
  window.dispatchEvent(new CustomEvent("auth-updated", { detail: newUser }));

  return { success: true, user: newUser };
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("the_drop_guest_cart");
  localStorage.removeItem("the_drop_cart_items");
  window.dispatchEvent(new CustomEvent("auth-updated", { detail: null }));
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: [] }));
}
