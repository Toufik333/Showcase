"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tracker/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/tracker/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-[#fbfbfd]">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d1d1f] text-white">
            <UserPlus size={22} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            Create account
          </h1>
          <p className="mt-1 text-sm text-[#86868b]">
            Start tracking your finances today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-xs font-medium text-[#86868b] uppercase tracking-wider"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm text-[#1d1d1f] placeholder-zinc-400 outline-none transition-all duration-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              placeholder="Choose a username"
            />
            {username.length > 0 && username.length < 3 && (
              <p className="mt-1 text-xs text-amber-500">
                At least 3 characters required
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-[#86868b] uppercase tracking-wider"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-3 pr-11 text-sm text-[#1d1d1f] placeholder-zinc-400 outline-none transition-all duration-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="mt-1 text-xs text-amber-500">
                At least 6 characters required
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-medium text-[#86868b] uppercase tracking-wider"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1d1d1f] placeholder-zinc-400 outline-none transition-all duration-200 focus:ring-2 ${
                passwordMismatch
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-zinc-200/80 focus:border-zinc-400 focus:ring-zinc-100"
              }`}
              placeholder="Confirm your password"
            />
            {passwordMismatch && (
              <p className="mt-1 text-xs text-red-500">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || passwordMismatch}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d1d1f] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
            {!loading && (
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-[#86868b]">
          Already have an account?{" "}
          <Link
            href="/tracker/login"
            className="font-medium text-[#1d1d1f] hover:underline"
          >
            Sign in
          </Link>
        </p>

        {/* Back to portfolio */}
        <p className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors"
          >
            ← Back to Portfolio
          </Link>
        </p>
      </div>
    </div>
  );
}
