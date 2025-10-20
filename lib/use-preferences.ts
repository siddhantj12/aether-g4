"use client"

import { useState, useEffect } from "react"

interface Preferences {
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
}

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
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)

  useEffect(() => {
    const stored = localStorage.getItem("flow-preferences")
    if (stored) {
      setPreferences(JSON.parse(stored))
    }
  }, [])

  const updatePreferences = (updates: Partial<Preferences>) => {
    const newPreferences = { ...preferences, ...updates }
    setPreferences(newPreferences)
    localStorage.setItem("flow-preferences", JSON.stringify(newPreferences))
  }

  return { preferences, updatePreferences }
}
