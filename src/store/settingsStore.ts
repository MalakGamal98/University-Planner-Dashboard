import { create } from 'zustand'
import { DEFAULT_ACCENT } from '@/lib/accentColors'
import { applyAccentColor } from '@/lib/accentColors'
import { applyTheme, type ThemeMode } from '@/lib/theme'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { bindStoreToLocalStorage, readLocalStorage } from '@/hooks/useLocalStorage'

export interface SettingsData {
  theme: ThemeMode
  userName: string
  accentColor: string
}

interface SettingsStore extends SettingsData {
  updateSettings: (partial: Partial<SettingsData>) => void
  reset: () => void
}

export const DEFAULT_SETTINGS: SettingsData = {
  theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  userName: '',
  accentColor: DEFAULT_ACCENT.base,
}

const persisted = readLocalStorage<SettingsData>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)

applyTheme(persisted.theme)
applyAccentColor(persisted.accentColor)

export const useSettingsStore = create<SettingsStore>((set) => ({
  theme: persisted.theme,
  userName: persisted.userName,
  accentColor: persisted.accentColor,

  updateSettings: (partial) => {
    if (partial.theme !== undefined) applyTheme(partial.theme)
    if (partial.accentColor !== undefined) applyAccentColor(partial.accentColor)
    set(partial)
  },

  reset: () => {
    applyTheme(DEFAULT_SETTINGS.theme)
    applyAccentColor(DEFAULT_SETTINGS.accentColor)
    set(DEFAULT_SETTINGS)
  },
}))

bindStoreToLocalStorage(useSettingsStore, STORAGE_KEYS.settings, (state) => ({
  theme: state.theme,
  userName: state.userName,
  accentColor: state.accentColor,
}))
