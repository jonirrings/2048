"use client";

import { AnimationMode, ANIMATION_MODES } from "@/lib/constants";

interface SettingsProps {
  mode: AnimationMode;
  onModeChange: (mode: AnimationMode) => void;
  availableModes: AnimationMode[];
  orientationEnabled: boolean;
  onOrientationToggle: () => void;
  orientationSupported: boolean;
}

export function Settings({
  mode,
  onModeChange,
  availableModes,
  orientationEnabled,
  onOrientationToggle,
  orientationSupported,
}: SettingsProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Settings</h3>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-2">Animation Mode</label>
        <div className="flex flex-wrap gap-2">
          {ANIMATION_MODES.map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              disabled={!availableModes.includes(m)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                mode === m
                  ? "bg-[#8f7a66] text-white"
                  : availableModes.includes(m)
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {orientationSupported && (
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={orientationEnabled}
              onChange={onOrientationToggle}
              className="w-4 h-4 text-[#8f7a66] rounded"
            />
            <span className="text-sm text-gray-700">Tilt Control (Mobile)</span>
          </label>
        </div>
      )}
    </div>
  );
}
