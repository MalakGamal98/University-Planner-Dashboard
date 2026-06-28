import { create } from 'zustand'
import type { Assignment } from '@/types/assignment'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { bindStoreToLocalStorage, readLocalStorage } from '@/hooks/useLocalStorage'

type AssignmentInput = Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>

interface AssignmentStore {
  assignments: Assignment[]
  addAssignment: (data: AssignmentInput) => Assignment
  updateAssignment: (id: string, data: Partial<AssignmentInput>) => void
  deleteAssignment: (id: string) => void
  markComplete: (id: string) => void
  reset: () => void
}

const defaultState = { assignments: [] as Assignment[] }

const persisted = readLocalStorage(STORAGE_KEYS.assignments, defaultState)

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: persisted.assignments,

  addAssignment: (data) => {
    const now = new Date().toISOString()
    const assignment: Assignment = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    set((state) => ({ assignments: [...state.assignments, assignment] }))
    return assignment
  },

  updateAssignment: (id, data) => {
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a,
      ),
    }))
  },

  deleteAssignment: (id) => {
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    }))
  },

  markComplete: (id) => {
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.id === id
          ? { ...a, status: 'completed', updatedAt: new Date().toISOString() }
          : a,
      ),
    }))
  },

  reset: () => set(defaultState),
}))

bindStoreToLocalStorage(useAssignmentStore, STORAGE_KEYS.assignments, (state) => ({
  assignments: state.assignments,
}))
