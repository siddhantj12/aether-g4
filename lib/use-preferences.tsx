"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export interface Preferences {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  autoStartBreaks: boolean
  autoStartFocus: boolean
  soundEnabled: boolean
  soundVolume: number
  tickSoundEnabled: boolean
  backgroundMusicEnabled: boolean
  backgroundMusicVolume: number
  backgroundMusicPreset: "mellow" | "lofi" | "rain"
  notificationEnabled: boolean
}

const AETHER_STORAGE_KEY = "aether-preferences"
const LEGACY_FLOW_STORAGE_KEY = "flow-preferences"

const defaultPreferences: Preferences = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  soundVolume: 1,
  tickSoundEnabled: false,
  backgroundMusicEnabled: true,
  backgroundMusicVolume: 0.2,
  backgroundMusicPreset: "mellow",
  notificationEnabled: true,
}

type PreferencesContextValue = {
  preferences: Preferences
  updatePreferences: (updates: Partial<Preferences>) => void
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)

  // Initialize from storage (supports legacy key)
  useEffect(() => {
    try {
      const storedAether = typeof window !== "undefined" ? localStorage.getItem(AETHER_STORAGE_KEY) : null
      const storedFlow = typeof window !== "undefined" ? localStorage.getItem(LEGACY_FLOW_STORAGE_KEY) : null

      if (storedAether) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(storedAether) })
        return
      }
      if (storedFlow) {
        const parsed = JSON.parse(storedFlow)
        setPreferences({ ...defaultPreferences, ...parsed })
        // migrate to new key
        localStorage.setItem(AETHER_STORAGE_KEY, JSON.stringify({ ...defaultPreferences, ...parsed }))
        localStorage.removeItem(LEGACY_FLOW_STORAGE_KEY)
        return
      }
    } catch {
      // ignore
    }
  }, [])

  const updatePreferences = useCallback((updates: Partial<Preferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates }
      try {
        localStorage.setItem(AETHER_STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const value = useMemo<PreferencesContextValue>(() => ({ preferences, updatePreferences }), [preferences, updatePreferences])

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext)
  if (!ctx) {
    // Fallback to a stateful instance if provider is missing (prevents hard crash)
    // but strongly prefer wrapping the app with PreferencesProvider
    return {
      preferences: defaultPreferences,
      updatePreferences: () => {},
    }
  }
  return ctx
}
