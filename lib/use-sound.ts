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

  // Background music presets
  const startBackgroundMusic = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const oscillators: OscillatorNode[] = []
    const gains: GainNode[] = []

    const connect = (node: AudioNode, gainValue: number) => {
      const gain = ctx.createGain()
      gain.gain.value = gainValue
      node.connect(gain)
      gain.connect(ctx.destination)
      gains.push(gain)
    }

    if (preferences.backgroundMusicPreset === "mellow") {
      const frequencies = [261.63, 329.63, 392.0, 523.25]
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const filter = ctx.createBiquadFilter()
        osc.type = "sine"
        osc.frequency.value = freq
        filter.type = "lowpass"
        filter.frequency.value = 1000
        filter.Q.value = 0.7
        osc.connect(filter)
        connect(filter, (preferences.backgroundMusicVolume * 0.08) / (i + 1))
        osc.start()
        oscillators.push(osc)
      })
    } else if (preferences.backgroundMusicPreset === "lofi") {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      osc1.type = "triangle"
      osc2.type = "triangle"
      osc1.frequency.value = 220
      osc2.frequency.value = 220 * 2
      osc2.detune.value = -15
      filter.type = "lowpass"
      filter.frequency.value = 800
      lfo.type = "sine"
      lfo.frequency.value = 0.2
      lfoGain.gain.value = 5
      lfo.connect(lfoGain)
      lfoGain.connect(osc1.detune)
      lfoGain.connect(osc2.detune)
      const mix = ctx.createGain()
      mix.gain.value = 1
      osc1.connect(mix)
      osc2.connect(mix)
      mix.connect(filter)
      connect(filter, preferences.backgroundMusicVolume * 0.06)
      osc1.start(); osc2.start(); lfo.start()
      oscillators.push(osc1, osc2, lfo)
    } else if (preferences.backgroundMusicPreset === "rain") {
      const bufferSize = 2 * ctx.sampleRate
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.6
      }
      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true
      const hp = ctx.createBiquadFilter()
      hp.type = "highpass"; hp.frequency.value = 400
      const lp = ctx.createBiquadFilter()
      lp.type = "lowpass"; lp.frequency.value = 6000
      whiteNoise.connect(hp)
      hp.connect(lp)
      connect(lp, preferences.backgroundMusicVolume * 0.05)
      whiteNoise.start()
      // Use a dummy oscillator array entry to manage stop
      // We'll stop by stopping the BufferSource via stored reference
      oscillators.push((whiteNoise as unknown) as OscillatorNode)
    }

    setBackgroundMusic({ oscillators, gains })
  }, [preferences.backgroundMusicVolume, preferences.backgroundMusicPreset])

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

  // Restart music when preset changes
  useEffect(() => {
    if (!preferences.backgroundMusicEnabled) return
    stopBackgroundMusic()
    startBackgroundMusic()
  }, [preferences.backgroundMusicPreset])

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
