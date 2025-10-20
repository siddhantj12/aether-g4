"use client"

import { useState, useEffect, useRef, useCallback } from "react"
let invokeRef: undefined | ((cmd: string, args?: any) => Promise<any>)
try {
  // Lazy import to avoid SSR issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  invokeRef = require("@tauri-apps/api/core").invoke
} catch {}
import { usePreferences } from "./use-preferences"
import { useStats } from "./use-stats"
import { useSound } from "./use-sound"

type Phase = "focus" | "break" | "long"

export function useTimer() {
  const { preferences } = usePreferences()
  const { incrementPomodoro } = useStats()
  const { playChime, playStart, playPause, playTick } = useSound()

  const [phase, setPhase] = useState<Phase>("focus")
  const [timeLeft, setTimeLeft] = useState(preferences.focusDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

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
      // Add minutes actually completed in this focus session
      try {
        const secondsCompleted = getDuration("focus") - timeLeft
        const minutesCompleted = Math.round(secondsCompleted / 60)
        const today = new Date().toDateString()
        const stored = localStorage.getItem("aether-stats") || localStorage.getItem("flow-stats")
        const stats = stored ? JSON.parse(stored) : {}
        const todayStats = stats[today] || { pomodoros: 0, minutes: 0 }
        todayStats.pomodoros += 1
        todayStats.minutes = (todayStats.minutes || 0) + minutesCompleted
        stats[today] = todayStats
        localStorage.setItem("aether-stats", JSON.stringify(stats))
      } catch {}

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

    // Native notification + web fallback
    const sendNotice = async (title: string, body: string) => {
      if (!invokeRef) return
      try {
        await invokeRef("send_notification", { title, body })
      } catch {}
      try {
        if ("Notification" in window) {
          if (Notification.permission === "granted") new Notification(title, { body })
          else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((p) => {
              if (p === "granted") new Notification(title, { body })
            })
          }
        }
      } catch {}
    }
    if (preferences.notificationEnabled) {
      if (phase === "focus") {
        sendNotice("Aether", "Focus complete. Time for a break.")
      } else if (phase === "break" || phase === "long") {
        sendNotice("Aether", "Break over. Back to focus.")
      }
    }

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
          if (preferences.tickSoundEnabled) {
            playTick()
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
  }, [isRunning, timeLeft, phase, getDuration, nextPhase, preferences.tickSoundEnabled, playTick])

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

  const startFocus = () => {
    setPhase("focus")
    setTimeLeft(getDuration("focus"))
    setIsRunning(true)
    playStart()
  }

  // Update timer when preferences change - always update to reflect new duration
  useEffect(() => {
    // Reset to new duration regardless of running state
    setTimeLeft(getDuration(phase))
  }, [preferences.focusDuration, preferences.shortBreakDuration, preferences.longBreakDuration, phase, getDuration])

  return {
    timeLeft,
    phase,
    isRunning,
    progress,
    start,
    pause,
    reset,
    startFocus,
  }
}
