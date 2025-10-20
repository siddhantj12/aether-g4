"use client"

interface PhaseChipProps {
  phase: "focus" | "break" | "long"
}

export function PhaseChip({ phase }: PhaseChipProps) {
  const phaseConfig = {
    focus: {
      label: "Focus Time",
      color: "#ff6b35",
      bgClass: "bg-[#ff6b35]/10",
      borderClass: "border-[#ff6b35]/30",
    },
    break: {
      label: "Short Break",
      color: "#00f5d4",
      bgClass: "bg-[#00f5d4]/10",
      borderClass: "border-[#00f5d4]/30",
    },
    long: {
      label: "Long Break",
      color: "#9d4edd",
      bgClass: "bg-[#9d4edd]/10",
      borderClass: "border-[#9d4edd]/30",
    },
  }

  const config = phaseConfig[phase]

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border ${config.bgClass} ${config.borderClass}`}
      style={{
        boxShadow: `0 0 20px ${config.color}20`,
      }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: config.color,
          boxShadow: `0 0 8px ${config.color}`,
        }}
      />
      <span className="text-sm font-medium" style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  )
}
