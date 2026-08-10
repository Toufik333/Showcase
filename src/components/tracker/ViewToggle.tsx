"use client";

import { List, CalendarDays } from "lucide-react";

interface ViewToggleProps {
  view: "list" | "calendar";
  onChange: (view: "list" | "calendar") => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-xl border border-zinc-200/80 bg-white p-1 shadow-sm">
      <button
        onClick={() => onChange("list")}
        className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
          view === "list"
            ? "bg-[#1d1d1f] text-white shadow-sm"
            : "text-[#86868b] hover:text-[#1d1d1f]"
        }`}
      >
        <List size={14} />
        List
      </button>
      <button
        onClick={() => onChange("calendar")}
        className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
          view === "calendar"
            ? "bg-[#1d1d1f] text-white shadow-sm"
            : "text-[#86868b] hover:text-[#1d1d1f]"
        }`}
      >
        <CalendarDays size={14} />
        Calendar
      </button>
    </div>
  );
}
