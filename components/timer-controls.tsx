"use client"

import { Play, Pause, RotateCcw } from "lucide-react"

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export function TimerControls({ isRunning, onStart, onPause, onReset }: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={isRunning ? onPause : onStart}
        className="w-16 h-16 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 border"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 0 20px rgba(0, 217, 255, 0.3), 0 0 40px rgba(0, 217, 255, 0.1)",
        }}
        aria-label={isRunning ? "Pause" : "Start"}
      >
        {isRunning ? (
          <Pause className="w-6 h-6 text-[#00d9ff]" fill="currentColor" />
        ) : (
          <Play className="w-6 h-6 text-[#00d9ff] ml-1" fill="currentColor" />
        )}
      </button>
      <button
        onClick={onReset}
        className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/15"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
        }}
        aria-label="Reset"
      >
        <RotateCcw className="w-5 h-5 text-white/85" />
      </button>
    </div>
  )
}
