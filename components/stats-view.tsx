"use client"

import { useMemo, useState } from "react"
import { useStats } from "@/lib/use-stats"

export function StatsView() {
  const { getRangeData, todayPomodoros, todayMinutes, resetStats } = useStats()
  const [range] = useState<7>(7)
  const [selected, setSelected] = useState<number | null>(null)
  const data = useMemo(() => getRangeData(7), [getRangeData])
  const maxMinutes = useMemo(() => Math.max(...data.map((d) => d.minutes), 1), [data])
  const totalMinutes = useMemo(() => data.reduce((s, d) => s + d.minutes, 0), [data])
  const totalPomodoros = useMemo(() => data.reduce((s, d) => s + d.pomodoros, 0), [data])

  return (
    <div className="flex flex-col gap-6 p-6 rounded-3xl glass-surface mt-20 w-full max-w-2xl">
      <div>
        <h2 className="text-xl font-light text-neon-white mb-1">Your Progress</h2>
        <p className="text-xs text-white/80">Track your recent focus sessions</p>
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
          <div className="text-3xl font-light text-neon-white mb-1">{totalMinutes}</div>
          <div className="text-xs text-white/75">Range Total (min)</div>
        </div>
      </div>

      {/* Range Controls */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-lg text-sm bg-white/15">Last 7 days</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="text-sm text-white/70">Pomodoros: {totalPomodoros}</div>
          <button
            onClick={resetStats}
            className="px-3 py-1 rounded-lg text-sm bg-white/5 hover:bg-white/10 border border-white/10"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Chart */}
      <div>
        <h3 className="text-sm font-medium text-white/90 mb-3">Activity</h3>
        <div className="flex items-end justify-between gap-2 h-44">
          {data.map((day, i) => {
            const height = (day.minutes / maxMinutes) * 100
            const isToday = i === data.length - 1
            const isSelected = selected === i
            return (
              <button
                key={`${day.day}-${i}`}
                className="flex-1 flex flex-col items-center gap-1 focus:outline-none"
                onClick={() => setSelected(i)}
                aria-label={`Day ${day.day} with ${day.minutes} minutes and ${day.pomodoros} pomodoros`}
              >
                <div className="w-full flex items-end justify-center h-36">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      isSelected || isToday
                        ? "bg-[var(--color-phase-focus)] shadow-[0_0_14px_var(--color-phase-focus-glow)]"
                        : "bg-white/10"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className={`text-[11px] ${isToday ? "text-neon-white" : "text-white/70"}`}>{day.day}</div>
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 p-3 rounded-xl glass-surface border border-white/10">
            <div className="text-sm text-neon-white mb-1">{data[selected].day}</div>
            <div className="text-xs text-white/75">
              Minutes: {data[selected].minutes} • Pomodoros: {data[selected].pomodoros}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
