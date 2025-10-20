"use client"

import { useState } from "react"
import { TimerView } from "@/components/timer-view"
import { StatsView } from "@/components/stats-view"
import { PreferencesModal } from "@/components/preferences-modal"
import { Settings, BarChart3 } from "lucide-react"

export default function Home() {
  const [view, setView] = useState<"timer" | "stats">("timer")
  const [prefsOpen, setPrefsOpen] = useState(false)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Header */}
      <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-light tracking-wide text-neon-white">Aether, your free companion</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(view === "timer" ? "stats" : "timer")}
            className="p-2 rounded-lg glass-surface hover:bg-white/10 transition-colors"
            aria-label={view === "timer" ? "View stats" : "View timer"}
          >
            {view === "timer" ? (
              <BarChart3 className="w-5 h-5 text-white/90" />
            ) : (
              <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" d="M12 6v6l4 2" strokeWidth="2" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setPrefsOpen(true)}
            className="p-2 rounded-lg glass-surface hover:bg-white/10 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-white/90" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl">{view === "timer" ? <TimerView /> : <StatsView />}</div>

      {/* Preferences Modal */}
      <PreferencesModal open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </main>
  )
}
