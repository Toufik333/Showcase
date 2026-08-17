"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#fbfbfd] text-[#1d1d1f] font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[#1d1d1f]">
            Application Error
          </h1>
          <p className="mt-2 text-xs text-[#86868b] max-w-sm">
            {error?.message || "A critical error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 transition-colors"
          >
            Refresh Application
          </button>
        </div>
      </body>
    </html>
  );
}
