"use client"

import { TimerRing } from "./timer-ring"
import { TimerControls } from "./timer-controls"
import { PhaseChip } from "./phase-chip"
import { MiniStats } from "./mini-stats"
import { useTimer } from "@/lib/use-timer"

export function TimerView() {
  const { timeLeft, phase, isRunning, start, pause, reset, progress } = useTimer()

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex flex-col items-center gap-8">
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
      </div>

      <TimerControls isRunning={isRunning} onStart={start} onPause={pause} onReset={reset} />

      <MiniStats />
    </div>
  )
}
