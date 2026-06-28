import { create } from 'zustand'
import type { Note } from '@/types/note'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { bindStoreToLocalStorage, readLocalStorage } from '@/hooks/useLocalStorage'

type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>

interface NoteStore {
  notes: Note[]
  addNote: (data: NoteInput) => Note
  updateNote: (id: string, data: Partial<NoteInput>) => void
  deleteNote: (id: string) => void
  reset: () => void
}

const defaultState = { notes: [] as Note[] }

const persisted = readLocalStorage(STORAGE_KEYS.notes, defaultState)

export const useNoteStore = create<NoteStore>((set) => ({
  notes: persisted.notes,

  addNote: (data) => {
    const now = new Date().toISOString()
    const note: Note = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    set((state) => ({ notes: [...state.notes, note] }))
    return note
  },

  updateNote: (id, data) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n,
      ),
    }))
  },

  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    }))
  },

  reset: () => set(defaultState),
}))

bindStoreToLocalStorage(useNoteStore, STORAGE_KEYS.notes, (state) => ({
  notes: state.notes,
}))
