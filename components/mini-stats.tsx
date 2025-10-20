"use client"

import { useStats } from "@/lib/use-stats"

export function MiniStats() {
  const { todayPomodoros, todayMinutes } = useStats()

  return (
    <div className="flex items-center gap-6 px-6 py-3 rounded-2xl glass-surface">
      <div className="text-center">
        <div className="text-2xl font-light text-neon-white">{todayPomodoros}</div>
        <div className="text-xs text-white/75">Pomodoros</div>
      </div>
      <div className="w-px h-8 bg-white/20" />
      <div className="text-center">
        <div className="text-2xl font-light text-neon-white">{todayMinutes}</div>
        <div className="text-xs text-white/75">Minutes</div>
      </div>
    </div>
  )
}
