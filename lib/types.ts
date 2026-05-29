export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title: string;
  content: string;
}

// State untuk State Transition Testing
export type NoteState =
  | "IDLE"
  | "CREATING"
  | "VIEWING"
  | "EDITING"
  | "DELETING"
  | "SAVED"
  | "ERROR";
