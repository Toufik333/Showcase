"use client";

import { useState, useEffect, useRef } from "react";
import { X, Trash2, Pin, PinOff } from "lucide-react";
import type { Note } from "./NoteCard";

const NOTE_COLORS = [
  { id: "default", label: "Default", class: "bg-white border-zinc-300" },
  { id: "yellow", label: "Yellow", class: "bg-amber-300" },
  { id: "green", label: "Green", class: "bg-emerald-400" },
  { id: "blue", label: "Blue", class: "bg-sky-400" },
  { id: "purple", label: "Purple", class: "bg-violet-400" },
  { id: "pink", label: "Pink", class: "bg-pink-400" },
  { id: "orange", label: "Orange", class: "bg-orange-400" },
  { id: "red", label: "Red", class: "bg-red-400" },
];

interface NoteModalProps {
  note: Note | null; // null = create new
  onClose: () => void;
  onSave: (data: {
    title: string;
    content: string;
    color: string;
    pinned: boolean;
  }) => void;
  onDelete: (id: string) => void;
}

export default function NoteModal({
  note,
  onClose,
  onSave,
  onDelete,
}: NoteModalProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [color, setColor] = useState(note?.color || "default");
  const [pinned, setPinned] = useState(note?.pinned || false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus title on open
    setTimeout(() => titleRef.current?.focus(), 100);

    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), content: content.trim(), color, pinned });
  };

  const isEditing = !!note;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-lg rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="text-base font-semibold tracking-tight text-[#1d1d1f]">
            {isEditing ? "Edit Note" : "New Note"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Title input */}
          <input
            ref={titleRef}
            type="text"
            placeholder="Note title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm font-medium text-[#1d1d1f] placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
          />

          {/* Content textarea */}
          <textarea
            placeholder="Write your note…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={10000}
            rows={8}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm leading-relaxed text-[#1d1d1f] placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
          />

          {/* Color picker */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[#86868b]">Color</span>
            <div className="flex gap-2">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`h-6 w-6 rounded-full border-2 transition-all duration-200 ${
                    c.class
                  } ${
                    color === c.id
                      ? "scale-110 border-zinc-800 shadow-sm"
                      : "border-transparent hover:scale-105"
                  }`}
                  aria-label={`Color: ${c.label}`}
                />
              ))}
            </div>
          </div>

          {/* Pin toggle */}
          <button
            onClick={() => setPinned(!pinned)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
              pinned
                ? "bg-zinc-800 text-white"
                : "bg-zinc-100 text-[#86868b] hover:bg-zinc-200"
            }`}
          >
            {pinned ? <Pin size={13} /> : <PinOff size={13} />}
            {pinned ? "Pinned" : "Pin this note"}
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4">
          <div>
            {isEditing && !showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
              >
                <Trash2 size={13} />
                Delete
              </button>
            )}
            {isEditing && showDeleteConfirm && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500">Delete this note?</span>
                <button
                  onClick={() => onDelete(note!._id)}
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-[#86868b] transition-colors hover:bg-zinc-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="rounded-xl bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isEditing ? "Save changes" : "Create note"}
          </button>
        </div>
      </div>
    </div>
  );
}
