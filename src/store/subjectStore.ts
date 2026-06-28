import { create } from 'zustand'
import type { Subject } from '@/types/subject'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { bindStoreToLocalStorage, readLocalStorage } from '@/hooks/useLocalStorage'

type SubjectInput = Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>

interface SubjectStore {
  subjects: Subject[]
  addSubject: (data: SubjectInput) => Subject
  updateSubject: (id: string, data: Partial<SubjectInput>) => void
  deleteSubject: (id: string) => void
  reset: () => void
}

const defaultState = { subjects: [] as Subject[] }

const persisted = readLocalStorage(STORAGE_KEYS.subjects, defaultState)

export const useSubjectStore = create<SubjectStore>((set) => ({
  subjects: persisted.subjects,

  addSubject: (data) => {
    const now = new Date().toISOString()
    const subject: Subject = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    set((state) => ({ subjects: [...state.subjects, subject] }))
    return subject
  },

  updateSubject: (id, data) => {
    set((state) => ({
      subjects: state.subjects.map((s) =>
        s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s,
      ),
    }))
  },

  deleteSubject: (id) => {
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
    }))
  },

  reset: () => set(defaultState),
}))

bindStoreToLocalStorage(useSubjectStore, STORAGE_KEYS.subjects, (state) => ({
  subjects: state.subjects,
}))
