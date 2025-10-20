"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePreferences } from "./use-preferences"
import { useStats } from "./use-stats"
import { useSound } from "./use-sound"

type Phase = "focus" | "break" | "long"

export function useTimer() {
  const { preferences } = usePreferences()
  const { incrementPomodoro } = useStats()
  const { playChime, playStart, playPause } = useSound()

  const [phase, setPhase] = useState<Phase>("focus")
  const [timeLeft, setTimeLeft] = useState(preferences.focusDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout>()

  const getDuration = useCallback(
    (currentPhase: Phase) => {
      switch (currentPhase) {
        case "focus":
          return preferences.focusDuration * 60
        case "break":
          return preferences.shortBreakDuration * 60
        case "long":
          return preferences.longBreakDuration * 60
      }
    },
    [preferences],
  )

  const progress = ((getDuration(phase) - timeLeft) / getDuration(phase)) * 100

  const nextPhase = useCallback(() => {
    let newPhase: Phase
    let newSessionCount = sessionCount

    if (phase === "focus") {
      newSessionCount += 1
      incrementPomodoro()

      if (newSessionCount % 4 === 0) {
        newPhase = "long"
      } else {
        newPhase = "break"
      }
    } else {
      newPhase = "focus"
    }

    setPhase(newPhase)
    setSessionCount(newSessionCount)
    setTimeLeft(getDuration(newPhase))

    playChime()

    const shouldAutoStart = newPhase === "focus" ? preferences.autoStartFocus : preferences.autoStartBreaks

    if (!shouldAutoStart) {
      setIsRunning(false)
    }
  }, [phase, sessionCount, getDuration, incrementPomodoro, playChime, preferences])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            nextPhase()
            return getDuration(phase)
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, phase, getDuration, nextPhase])

  const start = () => {
    setIsRunning(true)
    playStart()
  }

  const pause = () => {
    setIsRunning(false)
    playPause()
  }

  const reset = () => {
    setIsRunning(false)
    setTimeLeft(getDuration(phase))
  }

  return {
    timeLeft,
    phase,
    isRunning,
    progress,
    start,
    pause,
    reset,
  }
}
