/**
 * ============================================================
 * PENGUJIAN BLACK BOX - EQUIVALENCE CLASS PARTITIONING
 * Aplikasi: Notes App (CRUD Catatan)
 * Metode: Equivalence Class Partitioning (ECP)
 * Referensi: Modul 09 - Black Box Testing, UKPL
 * ============================================================
 *
 * Fungsi yang diuji: validateNoteInput(title, content)
 *
 * Spesifikasi:
 *   - title  : string, tidak boleh kosong, maksimal 100 karakter
 *   - content: string, tidak boleh kosong, maksimal 5000 karakter
 *
 * Partisi Ekuivalensi:
 * ┌─────────────┬──────────────────────────────┬──────────────────────────────┐
 * │  Parameter  │       Kelas Valid             │       Kelas Tidak Valid       │
 * ├─────────────┼──────────────────────────────┼──────────────────────────────┤
 * │   title     │ 1 ≤ panjang ≤ 100 karakter   │ kosong / panjang > 100       │
 * │   content   │ 1 ≤ panjang ≤ 5000 karakter  │ kosong / panjang > 5000      │
 * └─────────────┴──────────────────────────────┴──────────────────────────────┘
 */

import { describe, it, expect } from "vitest";

// ── Fungsi yang diuji ──────────────────────────────────────────────────────────
interface ValidationResult {
  valid: boolean;
  errors: { title?: string; content?: string };
}

function validateNoteInput(title: string, content: string): ValidationResult {
  const errors: { title?: string; content?: string } = {};

  if (!title || title.trim() === "") {
    errors.title = "Judul tidak boleh kosong";
  } else if (title.trim().length > 100) {
    errors.title = "Judul maksimal 100 karakter";
  }

  if (!content || content.trim() === "") {
    errors.content = "Isi catatan tidak boleh kosong";
  } else if (content.trim().length > 5000) {
    errors.content = "Isi catatan maksimal 5000 karakter";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ── Test Suite ─────────────────────────────────────────────────────────────────
describe("Equivalence Class Partitioning - validateNoteInput", () => {

  // ── KELAS VALID ──────────────────────────────────────────────────────────────
  describe("Kelas Valid", () => {

    it("TC-V01: title dan content normal → valid", () => {
      // Partisi: 1 ≤ title ≤ 100, 1 ≤ content ≤ 5000
      const result = validateNoteInput("Belajar Next.js", "Hari ini belajar membuat aplikasi notes.");
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("TC-V02: title tepat 1 karakter → valid", () => {
      // Nilai representatif batas bawah kelas valid title
      const result = validateNoteInput("A", "Isi catatan valid.");
      expect(result.valid).toBe(true);
    });

    it("TC-V03: title tepat 100 karakter → valid", () => {
      // Nilai representatif batas atas kelas valid title
      const title = "A".repeat(100);
      const result = validateNoteInput(title, "Isi catatan valid.");
      expect(result.valid).toBe(true);
    });

    it("TC-V04: content tepat 1 karakter → valid", () => {
      // Nilai representatif batas bawah kelas valid content
      const result = validateNoteInput("Judul Valid", "X");
      expect(result.valid).toBe(true);
    });

    it("TC-V05: content tepat 5000 karakter → valid", () => {
      // Nilai representatif batas atas kelas valid content
      const content = "B".repeat(5000);
      const result = validateNoteInput("Judul Valid", content);
      expect(result.valid).toBe(true);
    });

    it("TC-V06: title dan content dengan spasi di awal/akhir → valid (di-trim)", () => {
      // Input dengan whitespace, setelah trim masih valid
      const result = validateNoteInput("  Judul dengan spasi  ", "  Isi dengan spasi  ");
      expect(result.valid).toBe(true);
    });
  });

  // ── KELAS TIDAK VALID - TITLE ────────────────────────────────────────────────
  describe("Kelas Tidak Valid - title", () => {

    it("TC-I01: title kosong (string kosong) → tidak valid", () => {
      // Partisi tidak valid: title = ""
      const result = validateNoteInput("", "Isi catatan valid.");
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBe("Judul tidak boleh kosong");
    });

    it("TC-I02: title hanya spasi → tidak valid", () => {
      // Partisi tidak valid: title hanya whitespace
      const result = validateNoteInput("   ", "Isi catatan valid.");
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBe("Judul tidak boleh kosong");
    });

    it("TC-I03: title 101 karakter → tidak valid", () => {
      // Partisi tidak valid: title > 100 karakter
      const title = "A".repeat(101);
      const result = validateNoteInput(title, "Isi catatan valid.");
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBe("Judul maksimal 100 karakter");
    });

    it("TC-I04: title 200 karakter → tidak valid", () => {
      // Nilai representatif kelas tidak valid title > 100
      const title = "Z".repeat(200);
      const result = validateNoteInput(title, "Isi catatan valid.");
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBe("Judul maksimal 100 karakter");
    });
  });

  // ── KELAS TIDAK VALID - CONTENT ──────────────────────────────────────────────
  describe("Kelas Tidak Valid - content", () => {

    it("TC-I05: content kosong (string kosong) → tidak valid", () => {
      // Partisi tidak valid: content = ""
      const result = validateNoteInput("Judul Valid", "");
      expect(result.valid).toBe(false);
      expect(result.errors.content).toBe("Isi catatan tidak boleh kosong");
    });

    it("TC-I06: content hanya spasi → tidak valid", () => {
      // Partisi tidak valid: content hanya whitespace
      const result = validateNoteInput("Judul Valid", "     ");
      expect(result.valid).toBe(false);
      expect(result.errors.content).toBe("Isi catatan tidak boleh kosong");
    });

    it("TC-I07: content 5001 karakter → tidak valid", () => {
      // Partisi tidak valid: content > 5000 karakter
      const content = "C".repeat(5001);
      const result = validateNoteInput("Judul Valid", content);
      expect(result.valid).toBe(false);
      expect(result.errors.content).toBe("Isi catatan maksimal 5000 karakter");
    });

    it("TC-I08: content 10000 karakter → tidak valid", () => {
      // Nilai representatif kelas tidak valid content > 5000
      const content = "D".repeat(10000);
      const result = validateNoteInput("Judul Valid", content);
      expect(result.valid).toBe(false);
      expect(result.errors.content).toBe("Isi catatan maksimal 5000 karakter");
    });
  });

  // ── KELAS TIDAK VALID - KEDUANYA ─────────────────────────────────────────────
  describe("Kelas Tidak Valid - title dan content sekaligus", () => {

    it("TC-I09: title dan content keduanya kosong → dua error", () => {
      // Multi-partisi tidak valid
      const result = validateNoteInput("", "");
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.content).toBeDefined();
    });

    it("TC-I10: title > 100 dan content > 5000 → dua error", () => {
      // Multi-partisi tidak valid: keduanya melebihi batas
      const result = validateNoteInput("A".repeat(101), "B".repeat(5001));
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBe("Judul maksimal 100 karakter");
      expect(result.errors.content).toBe("Isi catatan maksimal 5000 karakter");
    });
  });
});
