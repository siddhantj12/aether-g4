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

    // Professional short chime (subtle glock-like)
    const gain = ctx.createGain()
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 1800
    lp.Q.value = 0.7
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.14 * preferences.soundVolume, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    const freqs = [587.33, 880.0] // D5, A5
    const oscs: OscillatorNode[] = []
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator()
      o.type = "triangle"
      o.frequency.value = f
      o.connect(lp)
      oscs.push(o)
    })
    lp.connect(gain)
    gain.connect(ctx.destination)
    oscs.forEach((o) => o.start(now))
    oscs.forEach((o) => o.stop(now + 0.32))
  }, [preferences.soundEnabled, preferences.soundVolume])

  const playStart = useCallback(() => {
    if (!preferences.soundEnabled) return
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Professional, short start tone (two-note pluck)
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 1800
    lp.Q.value = 0.8

    const mk = (freq: number, delay = 0) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = "triangle"
      o.frequency.value = freq
      g.gain.setValueAtTime(0, now + delay)
      g.gain.linearRampToValueAtTime(0.12 * preferences.soundVolume, now + delay + 0.01)
      g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.18)
      o.connect(lp)
      lp.connect(g)
      g.connect(ctx.destination)
      o.start(now + delay)
      o.stop(now + delay + 0.2)
    }

    mk(740.0, 0) // F#5
    mk(987.77, 0.03) // B5 slight stagger
  }, [preferences.soundEnabled, preferences.soundVolume])

  const playPause = useCallback(() => {
    if (!preferences.soundEnabled) return
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Professional short pause tone (gentle down blip)
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 1600
    lp.Q.value = 0.8

    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = "triangle"
    o.frequency.setValueAtTime(740.0, now)
    o.frequency.exponentialRampToValueAtTime(523.25, now + 0.18)
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(0.11 * preferences.soundVolume, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    o.connect(lp)
    lp.connect(g)
    g.connect(ctx.destination)
    o.start(now)
    o.stop(now + 0.22)
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
