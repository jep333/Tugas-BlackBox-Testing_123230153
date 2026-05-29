import { NextRequest, NextResponse } from "next/server";
import { getAllNotes, createNote } from "@/lib/notes-store";

export async function GET() {
  try {
    const notes = getAllNotes();
    return NextResponse.json({ success: true, data: notes });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    // Validasi input (Equivalence Class Partitioning)
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Judul tidak boleh kosong" },
        { status: 400 }
      );
    }

    if (title.trim().length > 100) {
      return NextResponse.json(
        { success: false, error: "Judul maksimal 100 karakter" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Isi catatan tidak boleh kosong" },
        { status: 400 }
      );
    }

    if (content.trim().length > 5000) {
      return NextResponse.json(
        { success: false, error: "Isi catatan maksimal 5000 karakter" },
        { status: 400 }
      );
    }

    const note = createNote({ title, content });
    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal membuat note" },
      { status: 500 }
    );
  }
}
