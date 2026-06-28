export type ThemeMode = 'light' | 'dark'

export function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function toggleThemeMode(current: ThemeMode): ThemeMode {
  return current === 'light' ? 'dark' : 'light'
}
