"use client";

import { Search } from "lucide-react";
import { useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="group relative flex items-center"
      onClick={() => inputRef.current?.focus()}
    >
      <Search
        size={16}
        className="absolute left-3.5 text-zinc-400 transition-colors group-focus-within:text-[#1d1d1f]"
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search notes…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-sm text-[#1d1d1f] placeholder-zinc-400 outline-none transition-all duration-200 focus:border-zinc-400 focus:bg-white focus:shadow-sm sm:w-72"
      />
      {value && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          className="absolute right-3 text-xs text-zinc-400 transition-colors hover:text-zinc-600"
        >
          Clear
        </button>
      )}
    </div>
  );
}
