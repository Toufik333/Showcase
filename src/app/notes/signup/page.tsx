"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StickyNote, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NotesSignupPage() {
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

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/notes/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/notes");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-[#fbfbfd]">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d1d1f] text-white shadow-sm">
            <StickyNote size={22} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-[#86868b]">
            Start capturing notes synced to MongoDB Atlas
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="mt-1 text-xs text-amber-600">
                Password must be at least 6 characters
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
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1d1d1f] placeholder-zinc-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-zinc-100 ${
                passwordMismatch
                  ? "border-red-300 focus:border-red-400"
                  : "border-zinc-200/80 focus:border-zinc-400"
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
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d1d1f] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#333] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-[#86868b]">
          Already have an account?{" "}
          <Link
            href="/notes/login"
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
