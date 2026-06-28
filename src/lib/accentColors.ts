export interface AccentPreset {
  id: string
  label: string
  base: string
  shades: Record<string, string>
}

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    id: 'indigo',
    label: 'Indigo',
    base: '#6366f1',
    shades: {
      '50': '#eef2ff',
      '100': '#e0e7ff',
      '200': '#c7d2fe',
      '300': '#a5b4fc',
      '400': '#818cf8',
      '500': '#6366f1',
      '600': '#4f46e5',
      '700': '#4338ca',
      '800': '#3730a3',
      '900': '#312e81',
    },
  },
  {
    id: 'violet',
    label: 'Violet',
    base: '#8b5cf6',
    shades: {
      '50': '#f5f3ff',
      '100': '#ede9fe',
      '200': '#ddd6fe',
      '300': '#c4b5fd',
      '400': '#a78bfa',
      '500': '#8b5cf6',
      '600': '#7c3aed',
      '700': '#6d28d9',
      '800': '#5b21b6',
      '900': '#4c1d95',
    },
  },
  {
    id: 'blue',
    label: 'Blue',
    base: '#3b82f6',
    shades: {
      '50': '#eff6ff',
      '100': '#dbeafe',
      '200': '#bfdbfe',
      '300': '#93c5fd',
      '400': '#60a5fa',
      '500': '#3b82f6',
      '600': '#2563eb',
      '700': '#1d4ed8',
      '800': '#1e40af',
      '900': '#1e3a8a',
    },
  },
  {
    id: 'emerald',
    label: 'Emerald',
    base: '#10b981',
    shades: {
      '50': '#ecfdf5',
      '100': '#d1fae5',
      '200': '#a7f3d0',
      '300': '#6ee7b7',
      '400': '#34d399',
      '500': '#10b981',
      '600': '#059669',
      '700': '#047857',
      '800': '#065f46',
      '900': '#064e3b',
    },
  },
  {
    id: 'rose',
    label: 'Rose',
    base: '#f43f5e',
    shades: {
      '50': '#fff1f2',
      '100': '#ffe4e6',
      '200': '#fecdd3',
      '300': '#fda4af',
      '400': '#fb7185',
      '500': '#f43f5e',
      '600': '#e11d48',
      '700': '#be123c',
      '800': '#9f1239',
      '900': '#881337',
    },
  },
  {
    id: 'amber',
    label: 'Amber',
    base: '#f59e0b',
    shades: {
      '50': '#fffbeb',
      '100': '#fef3c7',
      '200': '#fde68a',
      '300': '#fcd34d',
      '400': '#fbbf24',
      '500': '#f59e0b',
      '600': '#d97706',
      '700': '#b45309',
      '800': '#92400e',
      '900': '#78350f',
    },
  },
  {
    id: 'cyan',
    label: 'Cyan',
    base: '#06b6d4',
    shades: {
      '50': '#ecfeff',
      '100': '#cffafe',
      '200': '#a5f3fc',
      '300': '#67e8f9',
      '400': '#22d3ee',
      '500': '#06b6d4',
      '600': '#0891b2',
      '700': '#0e7490',
      '800': '#155e75',
      '900': '#164e63',
    },
  },
  {
    id: 'fuchsia',
    label: 'Fuchsia',
    base: '#d946ef',
    shades: {
      '50': '#fdf4ff',
      '100': '#fae8ff',
      '200': '#f5d0fe',
      '300': '#f0abfc',
      '400': '#e879f9',
      '500': '#d946ef',
      '600': '#c026d3',
      '700': '#a21caf',
      '800': '#86198f',
      '900': '#701a75',
    },
  },
]

export const DEFAULT_ACCENT = ACCENT_PRESETS[0]

export function getAccentPresetByBase(base: string): AccentPreset {
  return ACCENT_PRESETS.find((p) => p.base === base) ?? DEFAULT_ACCENT
}

export function applyAccentColor(base: string): void {
  const preset = getAccentPresetByBase(base)
  const root = document.documentElement
  root.style.setProperty('--color-primary', preset.base)
  Object.entries(preset.shades).forEach(([shade, color]) => {
    root.style.setProperty(`--color-primary-${shade}`, color)
  })
}
