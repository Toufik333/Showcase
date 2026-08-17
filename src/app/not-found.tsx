import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-[#86868b] mb-4">
        <FileQuestion size={32} />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
        404 — Page Not Found
      </h1>
      <p className="mt-2 text-xs text-[#86868b] max-w-sm">
        The page or resource you are looking for does not exist or has been moved.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Return to Portfolio
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-medium text-[#1d1d1f] hover:bg-zinc-50 transition-colors"
        >
          Browse Store
        </Link>
      </div>
    </div>
  );
}
