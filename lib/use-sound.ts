"use client"

import { usePreferences } from "./use-preferences"
import { useRef, useCallback, useEffect, useState } from "react"

export function useSound() {
  const { preferences } = usePreferences()
  const audioContextRef = useRef<AudioContext | null>(null)
  const [backgroundMusic, setBackgroundMusic] = useState<{
    oscillators: OscillatorNode[]
    gains: GainNode[]
  } | null>(null)

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

    // Professional ascending sound with harmonics
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    // Smooth frequency sweep
    osc1.frequency.setValueAtTime(329.63, now) // E4
    osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.3) // C5
    osc2.frequency.setValueAtTime(392.00, now) // G4
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.3) // E5
    
    osc1.type = "sine"
    osc2.type = "sine"

    filter.type = "lowpass"
    filter.frequency.value = 2000
    filter.Q.value = 1

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Smooth, professional envelope - longer
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.2 * preferences.soundVolume, now + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.5)
    osc2.stop(now + 0.5)
  }, [preferences.soundEnabled, preferences.soundVolume])

  const playPause = useCallback(() => {
    if (!preferences.soundEnabled) return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Professional descending sound with harmonics
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    // Smooth frequency sweep down
    osc1.frequency.setValueAtTime(523.25, now) // C5
    osc1.frequency.exponentialRampToValueAtTime(329.63, now + 0.3) // E4
    osc2.frequency.setValueAtTime(659.25, now) // E5
    osc2.frequency.exponentialRampToValueAtTime(392.00, now + 0.3) // G4
    
    osc1.type = "sine"
    osc2.type = "sine"

    filter.type = "lowpass"
    filter.frequency.value = 2000
    filter.Q.value = 1

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Smooth, professional envelope - longer
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.2 * preferences.soundVolume, now + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.5)
    osc2.stop(now + 0.5)
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

  // Background music - happy and mellow ambient tones
  const startBackgroundMusic = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    
    // Create ambient pad with bright major chord harmonics for a happy, mellow sound
    const frequencies = [
      261.63, // C4 - brighter, happier root
      329.63, // E4 - major third
      392.00, // G4 - perfect fifth
      523.25, // C5 - octave up for shimmer
    ]

    const oscillators: OscillatorNode[] = []
    const gains: GainNode[] = []

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = "sine"
      osc.frequency.value = freq
      
      filter.type = "lowpass"
      filter.frequency.value = 1200 // Brighter filter for happier tone
      filter.Q.value = 0.7

      // Much quieter - reduced volume
      gain.gain.value = (preferences.backgroundMusicVolume * 0.08) / (i + 1)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      oscillators.push(osc)
      gains.push(gain)
    })

    setBackgroundMusic({ oscillators, gains })
  }, [preferences.backgroundMusicVolume])

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusic) {
      backgroundMusic.oscillators.forEach((osc) => {
        try {
          osc.stop()
        } catch (e) {
          // Already stopped
        }
      })
      setBackgroundMusic(null)
    }
  }, [backgroundMusic])

  // Control background music based on preferences
  useEffect(() => {
    if (preferences.backgroundMusicEnabled && !backgroundMusic) {
      startBackgroundMusic()
    } else if (!preferences.backgroundMusicEnabled && backgroundMusic) {
      stopBackgroundMusic()
    }
  }, [preferences.backgroundMusicEnabled, backgroundMusic, startBackgroundMusic, stopBackgroundMusic])

  // Update volume when preference changes
  useEffect(() => {
    if (backgroundMusic) {
      backgroundMusic.gains.forEach((gain, i) => {
        gain.gain.value = (preferences.backgroundMusicVolume * 0.08) / (i + 1)
      })
    }
  }, [preferences.backgroundMusicVolume, backgroundMusic])

  return { playChime, playTick, playStart, playPause, startBackgroundMusic, stopBackgroundMusic }
}
