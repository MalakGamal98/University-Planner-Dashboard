import { removeLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { useSubjectStore } from './subjectStore'
import { useAssignmentStore } from './assignmentStore'
import { useExamStore } from './examStore'
import { useNoteStore } from './noteStore'
import { useSettingsStore } from './settingsStore'

export function resetAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => removeLocalStorage(key))

  // Remove legacy theme key from Phase 1
  removeLocalStorage('theme')

  useSubjectStore.getState().reset()
  useAssignmentStore.getState().reset()
  useExamStore.getState().reset()
  useNoteStore.getState().reset()
  useSettingsStore.getState().reset()
}
