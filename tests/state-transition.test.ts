/**
 * ============================================================
 * PENGUJIAN BLACK BOX - STATE TRANSITION TESTING
 * Aplikasi: Notes App (CRUD Catatan)
 * Metode: State Transition Testing
 * Referensi: Modul 09 - Black Box Testing, UKPL
 * ============================================================
 *
 * State Transition Diagram:
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │                                                         │
 *   │   [IDLE] ──openCreate──► [CREATING]                     │
 *   │     ▲                       │                           │
 *   │     │              submit valid / cancel                │
 *   │     │                  ↙         ↘                      │
 *   │   [SAVED]         [IDLE]       [ERROR]                  │
 *   │     ▲                                                   │
 *   │     │                                                   │
 *   │   [IDLE] ──openEdit──► [EDITING]                        │
 *   │                            │                           │
 *   │                   submit valid / cancel                 │
 *   │                       ↙         ↘                      │
 *   │                   [SAVED]      [ERROR]                  │
 *   │                                                         │
 *   │   [IDLE] ──openDelete──► [DELETING]                     │
 *   │                              │                          │
 *   │                    confirm / cancel                     │
 *   │                        ↙         ↘                     │
 *   │                    [SAVED]      [IDLE]                  │
 *   │                                                         │
 *   └─────────────────────────────────────────────────────────┘
 *
 * Status:
 *   IDLE      - Tidak ada aksi aktif, menampilkan daftar notes
 *   CREATING  - Modal buat catatan terbuka
 *   EDITING   - Modal edit catatan terbuka
 *   DELETING  - Modal konfirmasi hapus terbuka
 *   SAVED     - Operasi berhasil disimpan/dihapus
 *   ERROR     - Terjadi kesalahan validasi atau server
 *
 * Kejadian (Events):
 *   openCreate   - Klik tombol "Catatan Baru"
 *   openEdit     - Klik tombol edit pada kartu note
 *   openDelete   - Klik tombol hapus pada kartu note
 *   submitValid  - Submit form dengan input valid
 *   submitInvalid- Submit form dengan input tidak valid
 *   cancel       - Klik tombol batal / tekan Escape
 *   confirmDelete- Konfirmasi hapus
 */

import { describe, it, expect, beforeEach } from "vitest";

// ── Model State Machine ────────────────────────────────────────────────────────
type NoteState = "IDLE" | "CREATING" | "EDITING" | "DELETING" | "SAVED" | "ERROR";
type NoteEvent =
  | "openCreate"
  | "openEdit"
  | "openDelete"
  | "submitValid"
  | "submitInvalid"
  | "cancel"
  | "confirmDelete";

interface StateMachineResult {
  state: NoteState;
  error?: string;
}

function transition(current: NoteState, event: NoteEvent): StateMachineResult {
  switch (current) {
    case "IDLE":
      if (event === "openCreate") return { state: "CREATING" };
      if (event === "openEdit")   return { state: "EDITING" };
      if (event === "openDelete") return { state: "DELETING" };
      return { state: "IDLE", error: `Event '${event}' tidak valid dari state IDLE` };

    case "CREATING":
      if (event === "submitValid")   return { state: "SAVED" };
      if (event === "submitInvalid") return { state: "ERROR" };
      if (event === "cancel")        return { state: "IDLE" };
      return { state: "CREATING", error: `Event '${event}' tidak valid dari state CREATING` };

    case "EDITING":
      if (event === "submitValid")   return { state: "SAVED" };
      if (event === "submitInvalid") return { state: "ERROR" };
      if (event === "cancel")        return { state: "IDLE" };
      return { state: "EDITING", error: `Event '${event}' tidak valid dari state EDITING` };

    case "DELETING":
      if (event === "confirmDelete") return { state: "SAVED" };
      if (event === "cancel")        return { state: "IDLE" };
      return { state: "DELETING", error: `Event '${event}' tidak valid dari state DELETING` };

    case "SAVED":
      // Setelah SAVED, otomatis kembali ke IDLE
      return { state: "IDLE" };

    case "ERROR":
      // Dari ERROR bisa kembali ke state sebelumnya (CREATING/EDITING)
      // Disederhanakan: kembali ke IDLE
      if (event === "cancel") return { state: "IDLE" };
      return { state: "ERROR", error: `Event '${event}' tidak valid dari state ERROR` };

    default:
      return { state: "IDLE" };
  }
}

// Helper: jalankan urutan transisi
function runSequence(events: NoteEvent[]): NoteState {
  let state: NoteState = "IDLE";
  for (const event of events) {
    const result = transition(state, event);
    state = result.state;
  }
  return state;
}

// ── Test Suite ─────────────────────────────────────────────────────────────────
describe("State Transition Testing - Notes App", () => {

  let state: NoteState;

  beforeEach(() => {
    state = "IDLE";
  });

  // ── TRANSISI VALID ───────────────────────────────────────────────────────────
  describe("Transisi Valid", () => {

    it("TC-ST01: IDLE → openCreate → CREATING", () => {
      const result = transition("IDLE", "openCreate");
      expect(result.state).toBe("CREATING");
      expect(result.error).toBeUndefined();
    });

    it("TC-ST02: CREATING → submitValid → SAVED", () => {
      const result = transition("CREATING", "submitValid");
      expect(result.state).toBe("SAVED");
    });

    it("TC-ST03: CREATING → cancel → IDLE", () => {
      const result = transition("CREATING", "cancel");
      expect(result.state).toBe("IDLE");
    });

    it("TC-ST04: CREATING → submitInvalid → ERROR", () => {
      const result = transition("CREATING", "submitInvalid");
      expect(result.state).toBe("ERROR");
    });

    it("TC-ST05: IDLE → openEdit → EDITING", () => {
      const result = transition("IDLE", "openEdit");
      expect(result.state).toBe("EDITING");
    });

    it("TC-ST06: EDITING → submitValid → SAVED", () => {
      const result = transition("EDITING", "submitValid");
      expect(result.state).toBe("SAVED");
    });

    it("TC-ST07: EDITING → cancel → IDLE", () => {
      const result = transition("EDITING", "cancel");
      expect(result.state).toBe("IDLE");
    });

    it("TC-ST08: EDITING → submitInvalid → ERROR", () => {
      const result = transition("EDITING", "submitInvalid");
      expect(result.state).toBe("ERROR");
    });

    it("TC-ST09: IDLE → openDelete → DELETING", () => {
      const result = transition("IDLE", "openDelete");
      expect(result.state).toBe("DELETING");
    });

    it("TC-ST10: DELETING → confirmDelete → SAVED", () => {
      const result = transition("DELETING", "confirmDelete");
      expect(result.state).toBe("SAVED");
    });

    it("TC-ST11: DELETING → cancel → IDLE", () => {
      const result = transition("DELETING", "cancel");
      expect(result.state).toBe("IDLE");
    });

    it("TC-ST12: SAVED → (auto) → IDLE", () => {
      // Setelah operasi berhasil, state kembali ke IDLE
      const result = transition("SAVED", "openCreate");
      expect(result.state).toBe("IDLE");
    });
  });

  // ── TRANSISI TIDAK VALID ─────────────────────────────────────────────────────
  describe("Transisi Tidak Valid (null transition)", () => {

    it("TC-ST13: IDLE → submitValid → tetap IDLE (tidak valid)", () => {
      // Tidak bisa submit dari IDLE tanpa membuka modal dulu
      const result = transition("IDLE", "submitValid");
      expect(result.state).toBe("IDLE");
      expect(result.error).toBeDefined();
    });

    it("TC-ST14: IDLE → confirmDelete → tetap IDLE (tidak valid)", () => {
      // Tidak bisa konfirmasi hapus tanpa membuka modal hapus
      const result = transition("IDLE", "confirmDelete");
      expect(result.state).toBe("IDLE");
      expect(result.error).toBeDefined();
    });

    it("TC-ST15: CREATING → openEdit → tetap CREATING (tidak valid)", () => {
      // Tidak bisa buka edit saat sedang di mode create
      const result = transition("CREATING", "openEdit");
      expect(result.state).toBe("CREATING");
      expect(result.error).toBeDefined();
    });

    it("TC-ST16: DELETING → submitValid → tetap DELETING (tidak valid)", () => {
      // Tidak bisa submit form saat modal hapus terbuka
      const result = transition("DELETING", "submitValid");
      expect(result.state).toBe("DELETING");
      expect(result.error).toBeDefined();
    });
  });

  // ── SEKUENSIAL (0-switch & 1-switch) ────────────────────────────────────────
  describe("Sekuensial Transisi (0-switch coverage)", () => {

    it("TC-ST17: Alur buat catatan berhasil (IDLE→CREATING→SAVED→IDLE)", () => {
      const finalState = runSequence(["openCreate", "submitValid"]);
      // SAVED otomatis kembali ke IDLE pada event berikutnya
      expect(finalState).toBe("SAVED");
    });

    it("TC-ST18: Alur buat catatan dibatalkan (IDLE→CREATING→IDLE)", () => {
      const finalState = runSequence(["openCreate", "cancel"]);
      expect(finalState).toBe("IDLE");
    });

    it("TC-ST19: Alur edit catatan berhasil (IDLE→EDITING→SAVED)", () => {
      const finalState = runSequence(["openEdit", "submitValid"]);
      expect(finalState).toBe("SAVED");
    });

    it("TC-ST20: Alur edit catatan dibatalkan (IDLE→EDITING→IDLE)", () => {
      const finalState = runSequence(["openEdit", "cancel"]);
      expect(finalState).toBe("IDLE");
    });

    it("TC-ST21: Alur hapus catatan berhasil (IDLE→DELETING→SAVED)", () => {
      const finalState = runSequence(["openDelete", "confirmDelete"]);
      expect(finalState).toBe("SAVED");
    });

    it("TC-ST22: Alur hapus catatan dibatalkan (IDLE→DELETING→IDLE)", () => {
      const finalState = runSequence(["openDelete", "cancel"]);
      expect(finalState).toBe("IDLE");
    });

    it("TC-ST23: Alur validasi gagal saat create (IDLE→CREATING→ERROR)", () => {
      const finalState = runSequence(["openCreate", "submitInvalid"]);
      expect(finalState).toBe("ERROR");
    });

    it("TC-ST24: Alur validasi gagal saat edit (IDLE→EDITING→ERROR)", () => {
      const finalState = runSequence(["openEdit", "submitInvalid"]);
      expect(finalState).toBe("ERROR");
    });
  });

  // ── 1-SWITCH COVERAGE ───────────────────────────────────────────────────────
  describe("1-Switch Coverage (dua transisi berurutan)", () => {

    it("TC-ST25: Buat → Batal → Edit (IDLE→CREATING→IDLE→EDITING)", () => {
      state = runSequence(["openCreate", "cancel"]);
      expect(state).toBe("IDLE");
      const result = transition(state, "openEdit");
      expect(result.state).toBe("EDITING");
    });

    it("TC-ST26: Hapus → Batal → Buat (IDLE→DELETING→IDLE→CREATING)", () => {
      state = runSequence(["openDelete", "cancel"]);
      expect(state).toBe("IDLE");
      const result = transition(state, "openCreate");
      expect(result.state).toBe("CREATING");
    });

    it("TC-ST27: Edit berhasil → kembali IDLE → Hapus (SAVED→IDLE→DELETING)", () => {
      // Setelah SAVED, state berikutnya adalah IDLE
      const afterSaved = transition("SAVED", "openCreate").state; // IDLE
      expect(afterSaved).toBe("IDLE");
      const result = transition(afterSaved, "openDelete");
      expect(result.state).toBe("DELETING");
    });
  });
});
