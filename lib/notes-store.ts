import fs from "fs";
import path from "path";
import { Note, CreateNoteInput, UpdateNoteInput } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "notes.json");

// Pastikan folder data dan file JSON ada
function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

function readNotes(): Note[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Note[];
}

function writeNotes(notes: Note[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), "utf-8");
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function getAllNotes(): Note[] {
  return readNotes().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getNoteById(id: string): Note | null {
  const notes = readNotes();
  return notes.find((n) => n.id === id) ?? null;
}

export function createNote(input: CreateNoteInput): Note {
  const notes = readNotes();
  const now = new Date().toISOString();
  const newNote: Note = {
    id: generateId(),
    title: input.title.trim(),
    content: input.content.trim(),
    createdAt: now,
    updatedAt: now,
  };
  notes.push(newNote);
  writeNotes(notes);
  return newNote;
}

export function updateNote(id: string, input: UpdateNoteInput): Note | null {
  const notes = readNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  notes[idx] = {
    ...notes[idx],
    title: input.title.trim(),
    content: input.content.trim(),
    updatedAt: new Date().toISOString(),
  };
  writeNotes(notes);
  return notes[idx];
}

export function deleteNote(id: string): boolean {
  const notes = readNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return false;
  notes.splice(idx, 1);
  writeNotes(notes);
  return true;
}
