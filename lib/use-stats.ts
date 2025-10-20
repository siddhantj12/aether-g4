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
    loadStats()
  }, [])

  const loadStats = () => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem("aether-stats") || localStorage.getItem("flow-stats")

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

      const stored = localStorage.getItem("aether-stats") || localStorage.getItem("flow-stats")
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
    const stored = localStorage.getItem("aether-stats") || localStorage.getItem("flow-stats")
    const stats = stored ? JSON.parse(stored) : {}

    const todayStats = stats[today] || { pomodoros: 0, minutes: 0 }
    todayStats.pomodoros += 1
    // Minutes will be added by the caller based on actual focus duration

    stats[today] = todayStats
    localStorage.setItem("aether-stats", JSON.stringify(stats))

    setTodayPomodoros(todayStats.pomodoros)
    setTodayMinutes(todayStats.minutes)
    loadStats()
  }

  const weekTotal = weeklyData.reduce((sum, day) => sum + day.minutes, 0)

  return {
    todayPomodoros,
    todayMinutes,
    weeklyData,
    weekTotal,
    incrementPomodoro,
  }
}
