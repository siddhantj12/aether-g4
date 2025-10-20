"use client"

import { useState, useEffect } from "react"

interface DayStats {
  day: string
  minutes: number
  pomodoros: number
}

export function useStats() {
  const [todayPomodoros, setTodayPomodoros] = useState(0)
  const [todayMinutes, setTodayMinutes] = useState(0)
  const [weeklyData, setWeeklyData] = useState<DayStats[]>([])

  useEffect(() => {
    // One-time migration from legacy key
    try {
      const old = localStorage.getItem("flow-stats")
      const curr = localStorage.getItem("aether-stats")
      if (!curr && old) {
        localStorage.setItem("aether-stats", old)
        localStorage.removeItem("flow-stats")
      }
    } catch {}
    loadStats()
    const onUpdated = () => loadStats()
    if (typeof window !== "undefined") {
      window.addEventListener("aether-stats-updated", onUpdated)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("aether-stats-updated", onUpdated)
      }
    }
  }, [])

  const loadStats = () => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem("aether-stats")

    if (stored) {
      const stats = JSON.parse(stored)
      const todayStats = stats[today] || { pomodoros: 0, minutes: 0 }
      setTodayPomodoros(todayStats.pomodoros)
      setTodayMinutes(todayStats.minutes)
    }

    // Generate weekly data
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weekly: DayStats[] = days.map((day, i) => {
      const date = new Date()
      date.setDate(date.getDate() - date.getDay() + i)
      const dateStr = date.toDateString()

      const stored = localStorage.getItem("aether-stats")
      const stats = stored ? JSON.parse(stored) : {}
      const dayStats = stats[dateStr] || { pomodoros: 0, minutes: 0 }

      return {
        day,
        minutes: dayStats.minutes,
        pomodoros: dayStats.pomodoros,
      }
    })

    setWeeklyData(weekly)
  }

  const incrementPomodoro = () => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem("aether-stats")
    const stats = stored ? JSON.parse(stored) : {}

    const todayStats = stats[today] || { pomodoros: 0, minutes: 0 }
    todayStats.pomodoros += 1
    // Minutes will be added by the caller based on actual focus duration

    stats[today] = todayStats
    localStorage.setItem("aether-stats", JSON.stringify(stats))

    setTodayPomodoros(todayStats.pomodoros)
    setTodayMinutes(todayStats.minutes)
    loadStats()
    try { window.dispatchEvent(new Event("aether-stats-updated")) } catch {}
  }

  const addMinutes = (delta: number) => {
    if (!delta || delta <= 0) return
    const today = new Date().toDateString()
    const stored = localStorage.getItem("aether-stats")
    const stats = stored ? JSON.parse(stored) : {}
    const todayStats = stats[today] || { pomodoros: 0, minutes: 0 }
    todayStats.minutes = (todayStats.minutes || 0) + delta
    stats[today] = todayStats
    localStorage.setItem("aether-stats", JSON.stringify(stats))

    setTodayPomodoros(todayStats.pomodoros)
    setTodayMinutes(todayStats.minutes)
    loadStats()
    try { window.dispatchEvent(new Event("aether-stats-updated")) } catch {}
  }

  const resetStats = () => {
    try {
      localStorage.removeItem("aether-stats")
      localStorage.removeItem("flow-stats")
      setTodayPomodoros(0)
      setTodayMinutes(0)
      setWeeklyData([])
      loadStats()
      try { window.dispatchEvent(new Event("aether-stats-updated")) } catch {}
    } catch {}
  }

  const getRangeData = (daysBack: number): DayStats[] => {
    const result: DayStats[] = []
    const stored = localStorage.getItem("aether-stats")
    const stats = stored ? JSON.parse(stored) : {}

    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      const dayLabel = date.toLocaleDateString(undefined, { weekday: "short" })
      const dayStats = stats[dateStr] || { pomodoros: 0, minutes: 0 }
      result.push({ day: dayLabel, minutes: dayStats.minutes || 0, pomodoros: dayStats.pomodoros || 0 })
    }

    return result
  }

  const weekTotal = weeklyData.reduce((sum, day) => sum + day.minutes, 0)

  return {
    todayPomodoros,
    todayMinutes,
    weeklyData,
    weekTotal,
    incrementPomodoro,
    addMinutes,
    getRangeData,
    resetStats,
  }
}
