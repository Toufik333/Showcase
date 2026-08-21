"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft, StickyNote, User, LogOut } from "lucide-react";
import NoteCard from "@/components/notes/NoteCard";
import NoteModal from "@/components/notes/NoteModal";
import SearchBar from "@/components/notes/SearchBar";
import type { Note } from "@/components/notes/NoteCard";

export default function NotesPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ userId: string; username: string } | null>(
    null
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Fetch current user and notes
  const fetchNotes = useCallback(async () => {
    try {
      // First verify user session
      const meRes = await fetch("/api/notes/auth/me");
      if (meRes.status === 401) {
        router.push("/notes/login");
        return;
      }
      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData.user);
      }

      // Fetch user-scoped notes
      const res = await fetch("/api/notes");
      if (res.status === 401) {
        router.push("/notes/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleLogout = async () => {
    try {
      await fetch("/api/notes/auth/logout", { method: "POST" });
      router.push("/notes/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Filter notes client-side
  const filteredNotes = search.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  // Separate pinned and unpinned
  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  // Create or update a note
  const handleSave = async (data: {
    title: string;
    content: string;
    color: string;
    pinned: boolean;
  }) => {
    try {
      if (editingNote) {
        // Update
        const res = await fetch(`/api/notes/${editingNote._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const updated = await res.json();
          setNotes((prev) =>
            prev.map((n) => (n._id === updated._id ? updated : n))
          );
        }
      } else {
        // Create
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const created = await res.json();
          setNotes((prev) => [created, ...prev]);
        }
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    }
    closeModal();
  };

  // Delete a note
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
    closeModal();
  };

  // Toggle pin
  const handleTogglePin = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/notes/${note._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !note.pinned }),
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes((prev) =>
          prev.map((n) => (n._id === updated._id ? updated : n))
        );
      }
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/50 bg-[#fbfbfd]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#86868b] transition-colors hover:bg-zinc-100 hover:text-[#1d1d1f]"
              aria-label="Back to portfolio"
            >
              <ArrowLeft size={18} strokeWidth={1.75} />
            </a>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
                <StickyNote size={16} className="text-[#86868b]" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
                  Notes
                </h1>
              </div>
              {user && (
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                  <User size={12} className="text-zinc-500" />
                  {user.username}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:block">
              <SearchBar value={search} onChange={setSearch} />
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 rounded-xl bg-[#1d1d1f] px-3.5 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-zinc-800 hover:shadow-xs active:scale-[0.98]"
            >
              <Plus size={15} strokeWidth={2} />
              <span>New Note</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-2 text-xs font-medium text-[#1d1d1f] hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile search & user bar */}
        <div className="flex items-center justify-between gap-3 border-t border-zinc-100 px-6 py-2.5 md:hidden">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          {user && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-700 sm:hidden">
              <User size={11} className="text-zinc-500" />
              {user.username}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          /* Loading skeleton */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-zinc-200/80 bg-white p-5"
              >
                <div className="h-4 w-24 rounded-md bg-zinc-100" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full rounded-md bg-zinc-100" />
                  <div className="h-3 w-3/4 rounded-md bg-zinc-100" />
                </div>
                <div className="mt-4 h-3 w-16 rounded-md bg-zinc-100" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <StickyNote size={28} className="text-zinc-300" />
            </div>
            <h2 className="mt-5 text-lg font-semibold tracking-tight text-[#1d1d1f]">
              No notes yet
            </h2>
            <p className="mt-1.5 text-sm text-[#86868b]">
              Create your first note to get started.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-6 flex items-center gap-2 rounded-xl bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800"
            >
              <Plus size={16} strokeWidth={2} />
              New Note
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          /* No results */
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-sm text-[#86868b]">
              No notes match &ldquo;{search}&rdquo;
            </p>
          </div>
        ) : (
          <>
            {/* Pinned section */}
            {pinnedNotes.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-[#86868b]">
                  Pinned
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pinnedNotes.map((note, i) => (
                    <div
                      key={note._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <NoteCard
                        note={note}
                        onClick={() => openEditModal(note)}
                        onTogglePin={(e) => handleTogglePin(note, e)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Others */}
            {otherNotes.length > 0 && (
              <section>
                {pinnedNotes.length > 0 && (
                  <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-[#86868b]">
                    Others
                  </h2>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {otherNotes.map((note, i) => (
                    <div
                      key={note._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <NoteCard
                        note={note}
                        onClick={() => openEditModal(note)}
                        onTogglePin={(e) => handleTogglePin(note, e)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <NoteModal
          note={editingNote}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
