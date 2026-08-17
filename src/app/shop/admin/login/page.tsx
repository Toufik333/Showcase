"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, User, Loader2, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [adminId, setAdminId] = useState("admin1");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/shop/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_id: adminId, password }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Login failed.");
      }

      // Redirect to admin dashboard
      router.push("/shop/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Storefront
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xs mb-3">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
              Admin Portal Login
            </h1>
            <p className="mt-1 text-xs text-[#86868b]">
              Access customer orders and fulfillments
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Admin ID Dropdown */}
            <div>
              <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                Select Admin Account
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#86868b]">
                  <User size={15} />
                </div>
                <select
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-xs text-[#1d1d1f] focus:border-zinc-900 focus:outline-none transition-all"
                >
                  <option value="admin1">admin1 (Fixed Account 1)</option>
                  <option value="admin2">admin2 (Fixed Account 2)</option>
                  <option value="admin3">admin3 (Fixed Account 3)</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#86868b]">
                  <Lock size={15} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-zinc-900 focus:outline-none transition-all"
                />
              </div>
              <p className="mt-1 text-[11px] text-[#86868b]">
                Default password for seeded admins is <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-zinc-800">admin123</code>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Log In to Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
