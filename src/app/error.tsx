"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
        <AlertCircle size={28} />
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f] sm:text-2xl">
        Something went wrong!
      </h2>
      <p className="mt-2 max-w-md text-xs text-[#86868b]">
        {error?.message || "An unexpected error occurred while loading this page."}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-medium text-[#1d1d1f] hover:bg-zinc-50 transition-colors"
        >
          <Home size={14} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
