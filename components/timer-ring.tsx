"use client"

interface TimerRingProps {
  progress: number
  phase: "focus" | "break" | "long"
  isRunning: boolean
}

export function TimerRing({ progress, phase, isRunning }: TimerRingProps) {
  const size = 320
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  const phaseColors = {
    focus: "#ff6b35",
    break: "#00f5d4",
    long: "#9d4edd",
  }

  return (
    <div className={isRunning ? "animate-[breathe_3s_ease-in-out_infinite]" : ""}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle with enhanced neon glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={phaseColors[phase]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-linear"
          style={{
            filter: `drop-shadow(0 0 12px ${phaseColors[phase]}) drop-shadow(0 0 24px ${phaseColors[phase]}80)`,
          }}
        />
      </svg>
    </div>
  )
}
