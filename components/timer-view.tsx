"use client"

import { TimerRing } from "./timer-ring"
import { TimerControls } from "./timer-controls"
import { PhaseChip } from "./phase-chip"
import { MiniStats } from "./mini-stats"
import { useTimer } from "@/lib/use-timer"
import { useEffect, useState } from "react"

export function TimerView() {
  const { timeLeft, phase, isRunning, start, pause, reset, progress, startFocus } = useTimer()
  const [banner, setBanner] = useState<string | null>(null)

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  useEffect(() => {
    // show a brief banner when entering a break or returning to focus
    if (phase === "break" || phase === "long") {
      setBanner("Break started — recharge")
      const t = setTimeout(() => setBanner(null), 2000)
      return () => clearTimeout(t)
    }
    if (phase === "focus") {
      setBanner("Focus started — stay in the zone")
      const t = setTimeout(() => setBanner(null), 1500)
      return () => clearTimeout(t)
    }
  }, [phase])

  return (
    <div className="flex flex-col items-center gap-8 mt-20">
      <PhaseChip phase={phase} />

      <div className="relative">
        <TimerRing progress={progress} phase={phase} isRunning={isRunning} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-7xl font-light tabular-nums tracking-tight timer-display-glow">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>
        {banner && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl glass-surface border border-white/10 text-white text-sm shadow-2xl">
            {banner}
          </div>
        )}
      </div>

      <TimerControls isRunning={isRunning} onStart={start} onPause={pause} onReset={reset} onFocusStart={startFocus} />

      <MiniStats />
    </div>
  )
}
