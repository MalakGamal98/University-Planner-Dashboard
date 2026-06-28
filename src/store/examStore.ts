import { create } from 'zustand'
import type { Exam } from '@/types/exam'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { bindStoreToLocalStorage, readLocalStorage } from '@/hooks/useLocalStorage'

type ExamInput = Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>

interface ExamStore {
  exams: Exam[]
  addExam: (data: ExamInput) => Exam
  updateExam: (id: string, data: Partial<ExamInput>) => void
  deleteExam: (id: string) => void
  reset: () => void
}

const defaultState = { exams: [] as Exam[] }

const persisted = readLocalStorage(STORAGE_KEYS.exams, defaultState)

export const useExamStore = create<ExamStore>((set) => ({
  exams: persisted.exams,

  addExam: (data) => {
    const now = new Date().toISOString()
    const exam: Exam = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    set((state) => ({ exams: [...state.exams, exam] }))
    return exam
  },

  updateExam: (id, data) => {
    set((state) => ({
      exams: state.exams.map((e) =>
        e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e,
      ),
    }))
  },

  deleteExam: (id) => {
    set((state) => ({
      exams: state.exams.filter((e) => e.id !== id),
    }))
  },

  reset: () => set(defaultState),
}))

bindStoreToLocalStorage(useExamStore, STORAGE_KEYS.exams, (state) => ({
  exams: state.exams,
}))
