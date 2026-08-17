"use client";

import { Pin, PinOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

const colorMap: Record<string, { bg: string; border: string; dot: string }> = {
  default: {
    bg: "bg-white",
    border: "border-zinc-200/80",
    dot: "bg-zinc-300",
  },
  yellow: {
    bg: "bg-amber-50/60",
    border: "border-amber-200/60",
    dot: "bg-amber-400",
  },
  green: {
    bg: "bg-emerald-50/60",
    border: "border-emerald-200/60",
    dot: "bg-emerald-400",
  },
  blue: {
    bg: "bg-sky-50/60",
    border: "border-sky-200/60",
    dot: "bg-sky-400",
  },
  purple: {
    bg: "bg-violet-50/60",
    border: "border-violet-200/60",
    dot: "bg-violet-400",
  },
  pink: {
    bg: "bg-pink-50/60",
    border: "border-pink-200/60",
    dot: "bg-pink-400",
  },
  orange: {
    bg: "bg-orange-50/60",
    border: "border-orange-200/60",
    dot: "bg-orange-400",
  },
  red: {
    bg: "bg-red-50/60",
    border: "border-red-200/60",
    dot: "bg-red-400",
  },
};

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
}

export default function NoteCard({ note, onClick, onTogglePin }: NoteCardProps) {
  const colors = colorMap[note.color] || colorMap.default;
  const timeAgo = formatDistanceToNow(new Date(note.updatedAt), {
    addSuffix: true,
  });

  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full flex-col rounded-2xl border ${colors.border} ${colors.bg} p-5 text-left shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:scale-[1.015] focus:outline-none focus:ring-2 focus:ring-zinc-300/60`}
    >
      {/* Pin button */}
      <button
        onClick={onTogglePin}
        className={`absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
          note.pinned
            ? "bg-zinc-800 text-white shadow-sm"
            : "text-zinc-300 opacity-0 group-hover:opacity-100 hover:bg-zinc-100 hover:text-zinc-600"
        }`}
        aria-label={note.pinned ? "Unpin note" : "Pin note"}
      >
        {note.pinned ? (
          <Pin size={13} strokeWidth={2} />
        ) : (
          <PinOff size={13} strokeWidth={2} />
        )}
      </button>

      {/* Color dot + Title */}
      <div className="flex items-center gap-2 pr-8">
        <span
          className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${colors.dot}`}
        />
        <h3 className="truncate text-sm font-semibold tracking-tight text-[#1d1d1f]">
          {note.title}
        </h3>
      </div>

      {/* Content preview */}
      {note.content && (
        <p className="mt-2.5 line-clamp-4 text-[13px] leading-relaxed text-[#86868b]">
          {note.content}
        </p>
      )}

      {/* Timestamp */}
      <span className="mt-3 block text-[11px] text-zinc-400">{timeAgo}</span>
    </button>
  );
}
