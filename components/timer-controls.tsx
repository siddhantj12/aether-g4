"use client"

import { Play, Pause, RotateCcw, Target } from "lucide-react"

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onFocusStart?: () => void
}

export function TimerControls({ isRunning, onStart, onPause, onReset, onFocusStart }: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={isRunning ? onPause : onStart}
        className="w-16 h-16 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 border"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 0 20px rgba(255, 0, 0, 0.5), 0 0 40px rgba(255, 0, 0, 0.25)",
        }}
        aria-label={isRunning ? "Pause" : "Start"}
      >
        {isRunning ? (
          <Pause className="w-6 h-6 text-[#ff0000]" fill="currentColor" />
        ) : (
          <Play className="w-6 h-6 text-[#ff0000] ml-1" fill="currentColor" />
        )}
      </button>
      {onFocusStart && (
        <button
          onClick={onFocusStart}
          className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/15"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
          }}
          aria-label="Start Focus"
        >
          <Target className="w-5 h-5 text-white/85" />
        </button>
      )}
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
