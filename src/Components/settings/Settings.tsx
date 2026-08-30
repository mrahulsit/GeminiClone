import { useContext, useState } from "react";
import { Context } from "../../context/context";
import { ACCENTS } from "../../utils/constants";
import {
  PiXBold,
  PiSunBold,
  PiMoonBold,
  PiTextAaBold,
  PiPaletteBold,
  PiBrainBold,
  PiCheckBold,
} from "react-icons/pi";

const FONT_SIZES = [
  { value: "sm" as const, label: "Small", size: "text-xs" },
  { value: "md" as const, label: "Medium", size: "text-sm" },
  { value: "lg" as const, label: "Large", size: "text-base" },
];

const THINKING_LEVELS = [
  { value: "none" as const, label: "None", desc: "No thinking display" },
  { value: "low" as const, label: "Low", desc: "Brief reasoning" },
  { value: "medium" as const, label: "Medium", desc: "Standard reasoning" },
  { value: "high" as const, label: "High", desc: "Detailed reasoning" },
];

const Settings = () => {
  const {
    settingsOpen,
    setSettingsOpen,
    theme,
    toggleTheme,
    accent,
    setAccent,
    fontSize,
    setFontSize,
    thinkingLevel,
    setThinkingLevel,
    logout,
  } = useContext(Context);

  const [tab, setTab] = useState<"appearance" | "preferences">("appearance");

  if (!settingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg max-h-[85vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-gray-100">Settings</h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <PiXBold className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setTab("appearance")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === "appearance" ? "text-indigo-400 border-b-2 border-indigo-600" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <PiPaletteBold className="w-4 h-4 text-gray-400" />
              Appearance
            </div>
          </button>
          <button
            onClick={() => setTab("preferences")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === "preferences" ? "text-indigo-400 border-b-2 border-indigo-600" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <PiBrainBold className="w-4 h-4 text-gray-400" />
              Preferences
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6 space-y-6">
          {tab === "appearance" ? (
            <>
              {/* Theme */}
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  Theme
                  <span className="text-xs text-gray-500 ml-2">(Current: {theme === "dark" ? "Dark" : "Light"})</span>
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["light", "dark"].map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTheme()}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        theme === t
                          ? "bg-indigo-600/20 border-indigo-600/30 text-indigo-400"
                          : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {t === "dark" ? (
                          <PiMoonBold className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <PiSunBold className="w-4 h-4 text-gray-400" />
                        )}
                        {t === "dark" ? "Dark" : "Light"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <PiPaletteBold className="w-4 h-4 text-indigo-400" />
                  Accent Color
                </label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {Object.entries(ACCENTS).map(([key, color]) => (
                    <button
                      key={key}
                      onClick={() => setAccent(key as keyof typeof ACCENTS)}
                      className={`relative h-10 rounded-xl border-2 transition-all ${
                        accent === key ? "border-indigo-600 scale-105" : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.base }}
                    >
                      {accent === key && (
                        <PiCheckBold className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <PiTextAaBold className="w-4 h-4 text-indigo-400" />
                  Font Size
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {FONT_SIZES.map((fs) => (
                    <button
                      key={fs.value}
                      onClick={() => setFontSize(fs.value)}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        fontSize === fs.value
                          ? "bg-indigo-600/20 border-indigo-600/30 text-indigo-400"
                          : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      <div className={`flex items-center justify-center ${fs.size}`}>
                        {fs.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Thinking Level */}
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <PiBrainBold className="w-4 h-4 text-indigo-400" />
                  Thinking Level
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {THINKING_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setThinkingLevel(level.value)}
                      className={`px-4 py-3 rounded-xl border text-left transition-all ${
                        thinkingLevel === level.value
                          ? "bg-indigo-600/20 border-indigo-600/30 text-indigo-400"
                          : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      <p className="text-sm font-medium">{level.label}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {level.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Logout */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={logout}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-600 text-gray-300 text-sm font-medium hover:bg-gray-700/20 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;