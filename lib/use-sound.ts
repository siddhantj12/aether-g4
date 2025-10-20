"use client"

import { usePreferences } from "./use-preferences"
import { useRef, useCallback } from "react"

export function useSound() {
  const { preferences } = usePreferences()
  const audioContextRef = useRef<AudioContext | null>(null)

  const playChime = useCallback(() => {
    if (!preferences.soundEnabled) return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Create a rich, pleasant chime with multiple harmonics
    const oscillator1 = ctx.createOscillator()
    const oscillator2 = ctx.createOscillator()
    const oscillator3 = ctx.createOscillator()
    const gainNode = ctx.createGain()

    // Harmonic frequencies for a bell-like sound
    oscillator1.frequency.value = 523.25 // C5
    oscillator2.frequency.value = 659.25 // E5
    oscillator3.frequency.value = 783.99 // G5

    oscillator1.type = "sine"
    oscillator2.type = "sine"
    oscillator3.type = "sine"

    oscillator1.connect(gainNode)
    oscillator2.connect(gainNode)
    oscillator3.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Smooth volume envelope
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.4 * preferences.soundVolume, now + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.2)

    oscillator1.start(now)
    oscillator2.start(now)
    oscillator3.start(now)
    oscillator1.stop(now + 1.2)
    oscillator2.stop(now + 1.2)
    oscillator3.stop(now + 1.2)
  }, [preferences.soundEnabled, preferences.soundVolume])

  const playStart = useCallback(() => {
    if (!preferences.soundEnabled) return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.frequency.setValueAtTime(400, now)
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1)
    oscillator.type = "sine"

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.3 * preferences.soundVolume, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    oscillator.start(now)
    oscillator.stop(now + 0.2)
  }, [preferences.soundEnabled, preferences.soundVolume])

  const playPause = useCallback(() => {
    if (!preferences.soundEnabled) return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.frequency.setValueAtTime(600, now)
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1)
    oscillator.type = "sine"

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.3 * preferences.soundVolume, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    oscillator.start(now)
    oscillator.stop(now + 0.2)
  }, [preferences.soundEnabled, preferences.soundVolume])

  const playTick = useCallback(() => {
    if (!preferences.tickSoundEnabled) return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.frequency.value = 1200
    oscillator.type = "sine"

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.05, now + 0.001)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

    oscillator.start(now)
    oscillator.stop(now + 0.05)
  }, [preferences.tickSoundEnabled])

  return { playChime, playTick, playStart, playPause }
}
