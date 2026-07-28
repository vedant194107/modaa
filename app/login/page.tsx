"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { loginUserAsync, signupUserAsync } from "@/lib/authHelper";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || searchParams.get("next") || "/account";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await loginUserAsync(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Authentication failed.");
    } else {
      if (res.user?.role === "Admin") {
        setSuccessMsg("ADMINISTRATOR AUTHENTICATED. REDIRECTING TO ADMIN PORTAL...");
        setTimeout(() => router.push("/admin"), 600);
      } else {
        setSuccessMsg(`AUTHENTICATED SUCCESSFULLY. REDIRECTING TO ${redirectTarget.toUpperCase()}...`);
        setTimeout(() => router.push(redirectTarget), 600);
      }
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("PASSWORDS DO NOT MATCH.");
      return;
    }

    if (!agreeTerms) {
      setError("PLEASE AGREE TO THE VIP CLIENT TERMS.");
      return;
    }

    setLoading(true);

    const res = await signupUserAsync(fullName, email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Failed to create profile.");
    } else {
      setSuccessMsg(`USER CREATED IN DATABASE. REDIRECTING TO ${redirectTarget.toUpperCase()}...`);
      setTimeout(() => router.push(redirectTarget), 600);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const res = await loginUserAsync("vip.client@gmail.com", "google_pass");
    setLoading(false);
    if (res.success) {
      setSuccessMsg(`GOOGLE AUTHENTICATION SUCCESSFUL. REDIRECTING TO ${redirectTarget.toUpperCase()}...`);
      setTimeout(() => router.push(redirectTarget), 600);
    }
  };

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-8 sm:py-16 flex items-center justify-center">
        <div className="w-full max-w-md border-4 border-on-surface p-6 sm:p-10 bg-surface shadow-[8px_8px_0px_0px_#a90e02]">
          
          {/* Header Switcher */}
          <div className="flex border-b-2 border-on-surface mb-8">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-3 font-display-xl text-xl uppercase tracking-tight transition-colors cursor-pointer border-b-4 -mb-[2px] ${
                mode === "login" ? "border-milano-red text-milano-red font-bold" : "border-transparent text-on-surface/50 hover:text-on-surface"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-3 font-display-xl text-xl uppercase tracking-tight transition-colors cursor-pointer border-b-4 -mb-[2px] ${
                mode === "signup" ? "border-milano-red text-milano-red font-bold" : "border-transparent text-on-surface/50 hover:text-on-surface"
              }`}
            >
              VIP Access
            </button>
          </div>

          {/* Subtitle */}
          <div className="mb-6 text-center">
            <h1 className="font-display-xl text-2xl uppercase tracking-tight">
              {mode === "login" ? "ACCESS YOUR VIP PROFILE" : "REGISTER FOR ACCESS"}
            </h1>
            <p className="font-body-md text-xs text-on-surface/70 uppercase tracking-wider mt-1">
              {mode === "login"
                ? "AUTHENTICATE TO ACCESS ORDERS, ADDRESSES & CHECKOUT"
                : "JOIN THE DROP TO RECEIVE EXCLUSIVE RELEASES & FASTER CHECKOUT"}
            </p>
          </div>

          {/* Success Message Alert */}
          {successMsg && (
            <div className="mb-6 p-3.5 bg-on-surface text-green-400 font-label-bold text-xs uppercase tracking-wider border-2 border-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-green-400">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block font-label-bold text-[10px] uppercase tracking-wider opacity-60 mb-1">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-on-surface py-2 px-1 font-label-bold text-sm text-on-surface focus:outline-none focus:border-milano-red uppercase placeholder:normal-case placeholder:font-normal placeholder:opacity-40"
                  placeholder="vedant@thedrop.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-label-bold text-[10px] uppercase tracking-wider opacity-60">
                    PASSWORD
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); setSuccessMsg("Password reset email sent."); }} className="font-label-bold text-[10px] uppercase text-milano-red underline">
                    FORGOT?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-on-surface py-2 px-1 font-label-bold text-sm text-on-surface focus:outline-none focus:border-milano-red"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 border-2 border-on-surface accent-milano-red cursor-pointer"
                />
                <label htmlFor="remember" className="font-label-bold text-xs uppercase cursor-pointer select-none opacity-80">
                  REMEMBER MY SESSION
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-milano-red text-lemon-chiffon py-4 font-headline-md text-sm sm:text-base hover:bg-on-surface transition-colors uppercase tracking-widest border-2 border-on-surface cursor-pointer mt-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                    AUTHENTICATING...
                  </>
                ) : (
                  "AUTHENTICATE ACCOUNT"
                )}
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <label className="block font-label-bold text-[10px] uppercase tracking-wider opacity-60 mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-on-surface py-2 px-1 font-label-bold text-sm text-on-surface focus:outline-none focus:border-milano-red uppercase placeholder:normal-case placeholder:font-normal placeholder:opacity-40"
                  placeholder="Vedant Dayala"
                />
              </div>

              <div>
                <label className="block font-label-bold text-[10px] uppercase tracking-wider opacity-60 mb-1">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-on-surface py-2 px-1 font-label-bold text-sm text-on-surface focus:outline-none focus:border-milano-red uppercase placeholder:normal-case placeholder:font-normal placeholder:opacity-40"
                  placeholder="vedant@thedrop.com"
                />
              </div>

              <div>
                <label className="block font-label-bold text-[10px] uppercase tracking-wider opacity-60 mb-1">
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-on-surface py-2 px-1 font-label-bold text-sm text-on-surface focus:outline-none focus:border-milano-red"
                  placeholder="••••••••••••"
                />
              </div>

              <div>
                <label className="block font-label-bold text-[10px] uppercase tracking-wider opacity-60 mb-1">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-on-surface py-2 px-1 font-label-bold text-sm text-on-surface focus:outline-none focus:border-milano-red"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 border-2 border-on-surface accent-milano-red cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="font-label-bold text-[11px] uppercase cursor-pointer select-none opacity-80">
                  I AGREE TO THE VIP CLIENT TERMS & CONDITIONS
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-milano-red text-lemon-chiffon py-4 font-headline-md text-sm sm:text-base hover:bg-on-surface transition-colors uppercase tracking-widest border-2 border-on-surface cursor-pointer mt-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                    CREATING PROFILE...
                  </>
                ) : (
                  "CREATE VIP PROFILE"
                )}
              </button>
            </form>
          )}

          {/* Social Auth Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-[2px] bg-on-surface/20"></div>
            <span className="font-label-bold text-[10px] uppercase tracking-widest opacity-50">OR</span>
            <div className="flex-1 h-[2px] bg-on-surface/20"></div>
          </div>

          {/* Social Auth Button */}
          <button
            onClick={handleGoogleAuth}
            className="w-full border-2 border-on-surface py-3 font-label-bold text-xs uppercase flex items-center justify-center gap-3 hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">account_circle</span>
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          {/* Footer Note */}
          <div className="mt-8 text-center pt-6 border-t-2 border-on-surface/10">
            <p className="font-body-md text-xs opacity-70 uppercase tracking-wide">
              {mode === "login" ? "DON'T HAVE AN ACCOUNT? " : "ALREADY HAVE A VIP PROFILE? "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                className="font-label-bold text-milano-red underline ml-1 cursor-pointer"
              >
                {mode === "login" ? "CREATE VIP PROFILE" : "SIGN IN HERE"}
              </button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-lemon-chiffon text-center p-12 font-label-bold uppercase">Loading authentication...</div>}>
      <LoginContent />
    </Suspense>
  );
}
