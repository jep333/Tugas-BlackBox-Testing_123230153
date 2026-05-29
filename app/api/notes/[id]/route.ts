import { NextRequest, NextResponse } from "next/server";
import { getNoteById, updateNote, deleteNote } from "@/lib/notes-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const note = getNoteById(id);
    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: note });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content } = body;

    // Validasi input
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

    const updated = updateNote(id, { title, content });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Note tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal mengupdate note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteNote(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Note tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Note berhasil dihapus" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal menghapus note" },
      { status: 500 }
    );
  }
}
