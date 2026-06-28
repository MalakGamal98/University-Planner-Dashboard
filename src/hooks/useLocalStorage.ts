import { useEffect, useRef, useState } from 'react'
import type { StoreApi } from 'zustand'

export function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeLocalStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function removeLocalStorage(key: string): void {
  localStorage.removeItem(key)
}

/**
 * Rehydrates a Zustand store from localStorage and subscribes to persist
 * the selected slice on every state change.
 */
export function bindStoreToLocalStorage<T>(
  store: StoreApi<T>,
  key: string,
  partialize: (state: T) => unknown,
): void {
  const saved = readLocalStorage<Partial<T> | null>(key, null)
  if (saved && typeof saved === 'object') {
    store.setState(saved as Partial<T>)
  }

  store.subscribe((state) => {
    writeLocalStorage(key, partialize(state))
  })
}

/**
 * Generic hook that keeps React state in sync with localStorage.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readLocalStorage(key, initialValue),
  )

  const setValue = (value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const next = value instanceof Function ? value(prev) : value
      writeLocalStorage(key, next)
      return next
    })
  }

  return [storedValue, setValue] as const
}

/**
 * React hook that wires a Zustand store slice to localStorage once on mount.
 * Prefer calling `bindStoreToLocalStorage` at module level for store init.
 */
export function useStoreLocalStorage<T>(
  store: StoreApi<T>,
  key: string,
  partialize: (state: T) => unknown,
) {
  const bound = useRef(false)

  useEffect(() => {
    if (bound.current) return
    bound.current = true
    bindStoreToLocalStorage(store, key, partialize)
  }, [store, key, partialize])
}
