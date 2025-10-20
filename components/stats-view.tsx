"use client"

import { useStats } from "@/lib/use-stats"

export function StatsView() {
  const { weeklyData, todayPomodoros, todayMinutes, weekTotal } = useStats()

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1)

  return (
    <div className="flex flex-col gap-8 p-8 rounded-3xl glass-surface">
      <div>
        <h2 className="text-2xl font-light text-neon-white mb-2">Your Progress</h2>
        <p className="text-sm text-white/90">Track your focus sessions over time</p>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-surface">
          <div className="text-3xl font-light text-neon-white mb-1">{todayPomodoros}</div>
          <div className="text-xs text-white/75">Today's Pomodoros</div>
        </div>
        <div className="p-4 rounded-xl glass-surface">
          <div className="text-3xl font-light text-neon-white mb-1">{todayMinutes}</div>
          <div className="text-xs text-white/75">Today's Minutes</div>
        </div>
        <div className="p-4 rounded-xl glass-surface">
          <div className="text-3xl font-light text-neon-white mb-1">{weekTotal}</div>
          <div className="text-xs text-white/75">Week Total</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div>
        <h3 className="text-sm font-medium text-white/90 mb-4">This Week</h3>
        <div className="flex items-end justify-between gap-3 h-48">
          {weeklyData.map((day, i) => {
            const height = (day.minutes / maxMinutes) * 100
            const isToday = i === new Date().getDay()

            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-40">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      isToday
                        ? "bg-[var(--color-phase-focus)] shadow-[0_0_20px_var(--color-phase-focus-glow)]"
                        : "bg-white/10"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className={`text-xs ${isToday ? "text-neon-white" : "text-white/75"}`}>{day.day}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
