"use client"

import { usePreferences } from "@/lib/use-preferences"
import { X } from "lucide-react"

interface PreferencesModalProps {
  open: boolean
  onClose: () => void
}

export function PreferencesModal({ open, onClose }: PreferencesModalProps) {
  const { preferences, updatePreferences } = usePreferences()

  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
      onClick={onClose}
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        className="w-full max-w-md rounded-3xl glass-surface p-5 border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-light text-neon-white">Preferences</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors border border-white/10" aria-label="Close">
            <X className="w-5 h-5 text-white/90" />
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          {/* Durations */}
          <div>
            <h3 className="text-sm font-medium text-white/85 mb-2">Durations (minutes)</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/85">Focus</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={preferences.focusDuration}
                  onChange={(e) => updatePreferences({ focusDuration: Number.parseInt(e.target.value) })}
                  className="w-24 px-3 py-2 rounded-lg glass-surface border border-white/15 text-white text-center focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/85">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={preferences.shortBreakDuration}
                  onChange={(e) => updatePreferences({ shortBreakDuration: Number.parseInt(e.target.value) })}
                  className="w-24 px-3 py-2 rounded-lg glass-surface border border-white/15 text-white text-center focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/85">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={preferences.longBreakDuration}
                  onChange={(e) => updatePreferences({ longBreakDuration: Number.parseInt(e.target.value) })}
                  className="w-24 px-3 py-2 rounded-lg glass-surface border border-white/15 text-white text-center focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <h3 className="text-sm font-medium text-white/85 mb-2">Options</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-white/85">Auto-start breaks</span>
                <input
                  type="checkbox"
                  checked={preferences.autoStartBreaks}
                  onChange={(e) => updatePreferences({ autoStartBreaks: e.target.checked })}
                  className="w-5 h-5 rounded bg-white/10 border-white/15 accent-[var(--color-phase-focus)]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-white/85">Auto-start focus</span>
                <input
                  type="checkbox"
                  checked={preferences.autoStartFocus}
                  onChange={(e) => updatePreferences({ autoStartFocus: e.target.checked })}
                  className="w-5 h-5 rounded bg-white/10 border-white/15 accent-[var(--color-phase-focus)]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-white/85">Sound notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.soundEnabled}
                  onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })}
                  className="w-5 h-5 rounded bg-white/10 border-white/15 accent-[var(--color-phase-focus)]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-white/85">Desktop notifications</span>
                <input
                  type="checkbox"
                  checked={preferences.notificationEnabled}
                  onChange={(e) => updatePreferences({ notificationEnabled: e.target.checked })}
                  className="w-5 h-5 rounded bg-white/10 border-white/15 accent-[var(--color-phase-focus)]"
                />
              </label>
            </div>
          </div>

          {/* Audio Settings */}
          <div>
            <h3 className="text-sm font-medium text-white/85 mb-2">Audio</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-white/85">Sound Volume</label>
                  <span className="text-xs text-white/60">{Math.round(preferences.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={preferences.soundVolume}
                  onChange={(e) => updatePreferences({ soundVolume: Number.parseFloat(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-accent-cyan) 0%, var(--color-accent-cyan) ${preferences.soundVolume * 100}%, rgba(255,255,255,0.1) ${preferences.soundVolume * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>
              
              {/* Background music removed */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full mt-5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-colors border border-white/15"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
