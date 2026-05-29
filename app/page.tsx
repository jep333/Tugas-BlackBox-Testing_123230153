"use client";

import { useCallback, useEffect, useState } from "react";
import NoteCard from "@/components/NoteCard";
import NoteModal from "@/components/NoteModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Toast, { ToastType } from "@/components/Toast";
import { Note } from "@/lib/types";

interface ToastState {
  message: string;
  type: ToastType;
}

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");

  // Modal states
  const [noteModal, setNoteModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    note: Note | null;
  }>({ isOpen: false, mode: "create", note: null });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    noteId: string;
    noteTitle: string;
  }>({ isOpen: false, noteId: "", noteTitle: "" });

  const [toast, setToast] = useState<ToastState | null>(null);

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notes");
      const json = await res.json();
      if (json.success) setNotes(json.data);
    } catch {
      showToast("Gagal memuat catatan", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  function showToast(message: string, type: ToastType) {
    setToast({ message, type });
  }

  // Create
  function openCreateModal() {
    setNoteModal({ isOpen: true, mode: "create", note: null });
  }

  // Edit
  function openEditModal(note: Note) {
    setNoteModal({ isOpen: true, mode: "edit", note });
  }

  // Delete
  function openDeleteModal(id: string) {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    setDeleteModal({ isOpen: true, noteId: id, noteTitle: note.title });
  }

  async function handleSave(title: string, content: string) {
    setIsSaving(true);
    try {
      if (noteModal.mode === "create") {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setNotes((prev) => [json.data, ...prev]);
        showToast("Catatan berhasil disimpan", "success");
      } else {
        const res = await fetch(`/api/notes/${noteModal.note!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setNotes((prev) =>
          prev.map((n) => (n.id === noteModal.note!.id ? json.data : n))
        );
        showToast("Catatan berhasil diperbarui", "success");
      }
      setNoteModal({ isOpen: false, mode: "create", note: null });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notes/${deleteModal.noteId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setNotes((prev) => prev.filter((n) => n.id !== deleteModal.noteId));
      showToast("Catatan berhasil dihapus", "success");
      setDeleteModal({ isOpen: false, noteId: "", noteTitle: "" });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  // Filter notes berdasarkan search
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-none">Notes</h1>
              <p className="text-xs text-slate-400 mt-0.5">{notes.length} catatan</p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Catatan Baru</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari catatan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg className="w-8 h-8 animate-spin text-violet-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-slate-400">Memuat catatan...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-slate-600 font-medium">
                {search ? "Catatan tidak ditemukan" : "Belum ada catatan"}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {search
                  ? `Tidak ada catatan yang cocok dengan "${search}"`
                  : "Klik tombol + untuk membuat catatan pertama kamu"}
              </p>
            </div>
            {!search && (
              <button
                onClick={openCreateModal}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
              >
                Buat Catatan
              </button>
            )}
          </div>
        ) : (
          <>
            {search && (
              <p className="text-sm text-slate-500 mb-4">
                Menampilkan <span className="font-medium text-slate-700">{filteredNotes.length}</span> hasil untuk &quot;{search}&quot;
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <NoteModal
        isOpen={noteModal.isOpen}
        mode={noteModal.mode}
        note={noteModal.note}
        onClose={() => setNoteModal({ isOpen: false, mode: "create", note: null })}
        onSave={handleSave}
        isLoading={isSaving}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        noteTitle={deleteModal.noteTitle}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, noteId: "", noteTitle: "" })}
        isLoading={isDeleting}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
