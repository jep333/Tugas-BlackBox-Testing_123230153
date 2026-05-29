"use client";

import { useEffect, useRef, useState } from "react";
import { Note } from "@/lib/types";

interface NoteModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  note?: Note | null;
  onClose: () => void;
  onSave: (title: string, content: string) => Promise<void>;
  isLoading?: boolean;
}

export default function NoteModal({
  isOpen,
  mode,
  note,
  onClose,
  onSave,
  isLoading = false,
}: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(mode === "edit" && note ? note.title : "");
      setContent(mode === "edit" && note ? note.content : "");
      setErrors({});
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, mode, note]);

  // Tutup modal dengan Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  function validate(): boolean {
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Judul tidak boleh kosong";
    } else if (title.trim().length > 100) {
      newErrors.title = "Judul maksimal 100 karakter";
    }
    if (!content.trim()) {
      newErrors.content = "Isi catatan tidak boleh kosong";
    } else if (content.trim().length > 5000) {
      newErrors.content = "Isi catatan maksimal 5000 karakter";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSave(title, content);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {mode === "create" ? "Catatan Baru" : "Edit Catatan"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Judul <span className="text-rose-500">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Masukkan judul catatan..."
              maxLength={100}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors
                ${errors.title
                  ? "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white"
                }`}
            />
            <div className="flex justify-between items-center">
              {errors.title ? (
                <p className="text-xs text-rose-500">{errors.title}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-slate-400 ml-auto">{title.length}/100</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Isi Catatan <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
              }}
              placeholder="Tulis catatan kamu di sini..."
              maxLength={5000}
              rows={6}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors resize-none
                ${errors.content
                  ? "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white"
                }`}
            />
            <div className="flex justify-between items-center">
              {errors.content ? (
                <p className="text-xs text-rose-500">{errors.content}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-slate-400 ml-auto">{content.length}/5000</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                mode === "create" ? "Simpan" : "Perbarui"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
