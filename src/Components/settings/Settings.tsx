import { useContext, useEffect, useState } from "react";
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
  PiNotePencilBold,
  PiSignOutBold,
} from "react-icons/pi";

const FONT_SIZES = [
  { value: "sm" as const, label: "Small", size: "text-xs" },
  { value: "md" as const, label: "Medium", size: "text-sm" },
  { value: "lg" as const, label: "Large", size: "text-base" },
];

const THINKING_LEVELS = [
  { value: "none" as const, label: "Off", desc: "No thinking shown" },
  { value: "low" as const, label: "Low", desc: "Brief, high-level reasoning" },
  { value: "medium" as const, label: "Medium", desc: "Balanced step-by-step reasoning" },
  { value: "high" as const, label: "High", desc: "Deep, thorough reasoning" },
];

const Section = ({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-accent" />
      <h3 className="text-sm font-semibold text-txt">{title}</h3>
    </div>
    {hint && <p className="text-xs text-txt-muted mb-3 ml-6">{hint}</p>}
    {children}
  </div>
);

const ThemePref = () => {
  const { theme, setTheme } = useContext(Context);
  return (
    <div className="grid grid-cols-2 gap-3">
      {(["light", "dark"] as const).map((t) => {
        const active = theme === t;
        const dark = t === "dark";
        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`relative p-3 rounded-2xl border text-left transition-all ${
              active
                ? "border-accent bg-accent/[0.06] ring-2 ring-accent/25"
                : "border-border bg-surface-1 hover:border-accent/40"
            }`}
          >
            <div
              className={`pointer-events-none relative mb-2.5 h-16 rounded-lg overflow-hidden border ${
                dark ? "bg-[#0f0f12] border-[#2a2a2e]" : "bg-white border-[#e5e5ea]"
              }`}
            >
              <div className={`flex items-center gap-1 px-2 py-1 ${dark ? "bg-[#1c1c21]" : "bg-[#f3f3f5]"}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
              </div>
              <div className="space-y-1.5 p-2">
                <div className={`w-3/5 h-1.5 rounded-full ${dark ? "bg-[#2c2c31]" : "bg-[#e8e8ec]"}`} />
                <div className={`ml-auto w-4/5 h-2.5 rounded-md ${dark ? "bg-[#3d3d44]" : "bg-[#e2e2e7]"}`} />
                <div className={`w-2/3 h-1.5 rounded-full ${dark ? "bg-[#2c2c31]" : "bg-[#e8e8ec]"}`} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${active ? "text-txt" : "text-txt-secondary"}`}>
                {dark ? "Dark" : "Light"}
              </span>
              {active && <PiCheckBold className="w-4 h-4 text-accent ml-auto" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};

const Settings = () => {
  const {
    settingsOpen,
    setSettingsOpen,
    accent,
    setAccent,
    fontSize,
    setFontSize,
    thinkingLevel,
    setThinkingLevel,
    customInstructions,
    setCustomInstructions,
    logout,
  } = useContext(Context);

  const [tab, setTab] = useState<"appearance" | "preferences">("appearance");

  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSettingsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settingsOpen, setSettingsOpen]);

  if (!settingsOpen) return null;

  const NavItem = ({
    active,
    danger,
    icon: Icon,
    label,
    onClick,
  }: {
    active?: boolean;
    danger?: boolean;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        danger
          ? "text-red-500 hover:bg-red-500/10"
          : active
            ? "bg-surface-2 text-txt"
            : "text-txt-secondary hover:bg-surface-2/60 hover:text-txt"
      }`}
    >
      <Icon
        className={`w-[18px] h-[18px] ${danger ? "text-red-500" : active ? "text-accent" : "text-txt-muted"}`}
      />
      {label}
    </button>
  );

  const tabClass = (active: boolean) =>
    `flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      active ? "bg-surface-0 text-txt shadow-sm" : "text-txt-muted hover:text-txt"
    }`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4"
      onClick={() => setSettingsOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[720px] h-[min(86vh,680px)] flex flex-col bg-surface-1 border border-border rounded-3xl shadow-2xl shadow-black/30 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-bold text-txt font-display">Settings</h2>
            <p className="text-xs text-txt-muted mt-0.5">Customize your Lumina experience</p>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-2 rounded-xl hover:bg-surface-2 text-txt-muted hover:text-txt transition-colors"
            title="Close (Esc)"
          >
            <PiXBold className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col sm:flex-row min-h-0">
          {/* Left nav (desktop, ChatGPT style) */}
          <nav className="hidden sm:flex w-56 shrink-0 flex-col border-r border-border p-2.5">
            <div className="space-y-1">
              <NavItem
                icon={PiPaletteBold}
                label="Appearance"
                active={tab === "appearance"}
                onClick={() => setTab("appearance")}
              />
              <NavItem
                icon={PiBrainBold}
                label="Preferences"
                active={tab === "preferences"}
                onClick={() => setTab("preferences")}
              />
            </div>
            <div className="mt-auto pt-2 border-t border-border">
              <NavItem icon={PiSignOutBold} label="Sign out" danger onClick={logout} />
            </div>
          </nav>

          {/* Mobile segmented control */}
          <div className="sm:hidden px-6 pt-3 pb-2 border-b border-border">
            <div className="flex gap-1 bg-surface-2 p-1 rounded-xl">
              <button onClick={() => setTab("appearance")} className={tabClass(tab === "appearance")}>
                <PiPaletteBold className="w-4 h-4" />
                Appearance
              </button>
              <button onClick={() => setTab("preferences")} className={tabClass(tab === "preferences")}>
                <PiBrainBold className="w-4 h-4" />
                Preferences
              </button>
            </div>
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {tab === "appearance" ? (
              <>
                <Section icon={PiSunBold} title="Theme" hint="Choose how Lumina looks">
                  <ThemePref />
                </Section>

                <Section icon={PiPaletteBold} title="Accent Color" hint="Used for highlights and actions">
                  <div className="grid grid-cols-7 gap-2">
                    {Object.entries(ACCENTS).map(([key, color]) => {
                      const active = accent === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setAccent(key)}
                          className={`relative aspect-square rounded-xl transition-all ${
                            active
                              ? "scale-105 ring-2 ring-offset-2 ring-offset-surface-1 shadow-lg"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.base }}
                          title={key.charAt(0).toUpperCase() + key.slice(1)}
                          aria-label={key}
                        >
                          {active && (
                            <PiCheckBold className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section icon={PiTextAaBold} title="Font Size" hint="Adjust the size of chat text">
                  <div className="grid grid-cols-3 gap-2">
                    {FONT_SIZES.map((fs) => {
                      const active = fontSize === fs.value;
                      return (
                        <button
                          key={fs.value}
                          onClick={() => setFontSize(fs.value)}
                          className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border transition-all ${
                            active
                              ? "bg-accent/15 border-accent/40 text-txt"
                              : "bg-surface-1 border-border text-txt-secondary hover:border-accent/30"
                          }`}
                        >
                          <span className={`font-semibold leading-none ${fs.size}`}>Aa</span>
                          <span className="text-xs font-medium">{fs.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </Section>
              </>
            ) : (
              <>
                <Section icon={PiBrainBold} title="Thinking Level" hint="How much reasoning Lumina shows before answering">
                  <div className="space-y-1.5">
                    {THINKING_LEVELS.map((level) => {
                      const active = thinkingLevel === level.value;
                      return (
                        <button
                          key={level.value}
                          onClick={() => setThinkingLevel(level.value)}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                            active
                              ? "bg-accent/15 border-accent/40"
                              : "bg-surface-1 border-border hover:border-accent/30"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              active ? "border-accent" : "border-txt-muted/40"
                            }`}
                          >
                            {active && <span className="w-2 h-2 rounded-full bg-accent" />}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-txt block">{level.label}</span>
                            <span className="text-[11px] text-txt-muted block">{level.desc}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section icon={PiNotePencilBold} title="Custom Instructions" hint="Included in every conversation — tell Lumina how to respond">
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    placeholder="e.g. Always respond with concise bullet points. Write in British English."
                    className="w-full px-4 py-3 rounded-xl bg-surface-1 border border-border text-sm text-txt placeholder:text-txt-muted outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all resize-y"
                  />
                  <p className="text-[10px] text-txt-muted mt-1 text-right">
                    {customInstructions.length}/1000
                  </p>
                </Section>
              </>
            )}

            {/* Mobile sign-out */}
            <div className="sm:hidden pt-4 border-t border-border">
              <NavItem icon={PiSignOutBold} label="Sign out" danger onClick={logout} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;