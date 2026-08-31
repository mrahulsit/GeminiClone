import { Link } from "react-router-dom";
import {
  PiSparkleBold,
  PiArrowRightBold,
  PiPlayBold,
  PiImageBold,
  PiCodeBold,
  PiGlobeSimpleBold,
  PiCheckCircleFill,
  PiLightningBold,
} from "react-icons/pi";
import ScrollReveal from "./ScrollReveal";

const stats = [
  { value: "12k+", label: "Developers building" },
  { value: "4M+", label: "Messages generated" },
  { value: "99.9%", label: "Uptime guarantee" },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-surface-0">
      {/* Background */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-accent/14 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-purple-500/12 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-16 text-center">
        <ScrollReveal variant="down" delay={0}>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-2/80 border border-border text-xs font-medium text-txt-secondary backdrop-blur">
            <PiLightningBold className="w-3.5 h-3.5 text-accent" />
            Powered by Gemini AI
            <span className="w-1 h-1 rounded-full bg-txt-muted" />
            New · Gemini 3.6
          </span>
        </ScrollReveal>

        <ScrollReveal delay={70}>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold text-txt font-display tracking-tight">
            Think smarter.
            <br />
            <span className="text-gradient">Build faster.</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={140}>
          <p className="mt-6 text-base sm:text-lg text-txt-secondary max-w-2xl leading-relaxed">
            An AI companion for coding, reasoning, and creation — with real-time
            streaming, web search, image generation, and an explainable thinking
            process you can finally trust.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={210}>
          <div className="mt-9 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/app"
              className="gradient-btn flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-white font-semibold text-sm active:scale-95"
            >
              <PiSparkleBold className="w-4 h-4" />
              Start chatting — free
              <PiArrowRightBold className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border border-border bg-surface-1/60 backdrop-blur text-sm font-medium text-txt-secondary hover:text-txt hover:border-accent/40 transition-all"
            >
              <span className="w-6 h-6 rounded-lg bg-accent/12 flex items-center justify-center">
                <PiPlayBold className="w-3 h-3 text-accent" />
              </span>
              See how it works
            </a>
          </div>
          <p className="mt-4 text-xs text-txt-muted">
            No credit card required · Free forever plan
          </p>
        </ScrollReveal>

        {/* Floating feature chips */}
        <div className="hidden lg:block absolute left-[8%] top-[26%] animate-float">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-1 border border-border shadow-xl shadow-black/20">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <PiImageBold className="w-4 h-4 text-cyan-400" />
            </span>
            <div className="text-left">
              <p className="text-xs font-semibold text-txt">Image generation</p>
              <p className="text-[10px] text-txt-muted">imagen 3.0</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute right-[7%] top-[22%] animate-float-delay">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-1 border border-border shadow-xl shadow-black/20">
            <span className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <PiCodeBold className="w-4 h-4 text-purple-400" />
            </span>
            <div className="text-left">
              <p className="text-xs font-semibold text-txt">Code generation</p>
              <p className="text-[10px] text-txt-muted">TypeScript · Python</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute left-[13%] bottom-[18%] animate-float-delay">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-1 border border-border shadow-xl shadow-black/20">
            <span className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
              <PiGlobeSimpleBold className="w-4 h-4 text-green-400" />
            </span>
            <div className="text-left">
              <p className="text-xs font-semibold text-txt">Web search</p>
              <p className="text-[10px] text-txt-muted">Live sources</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute right-[12%] bottom-[22%] animate-float">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-1 border border-border shadow-xl shadow-black/20">
            <span className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <PiCheckCircleFill className="w-4 h-4 text-amber-400" />
            </span>
            <div className="text-left">
              <p className="text-xs font-semibold text-txt">Visible thinking</p>
              <p className="text-[10px] text-txt-muted">See the reasoning</p>
            </div>
          </div>
        </div>

        {/* Chat preview mockup */}
        <ScrollReveal variant="scale" delay={280} className="w-full max-w-3xl mt-16">
          <div className="relative rounded-3xl bg-surface-1/80 backdrop-blur border border-border shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs font-medium text-txt-muted">lumina.ai — chat</p>
              </div>
            </div>

            <div className="px-5 sm:px-7 py-6 flex flex-col gap-4">
              {/* User message */}
              <div className="self-end">
                <div className="max-w-sm bg-accent text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm font-medium shadow-lg shadow-accent/20 text-left">
                  Build a tiny React hook that tracks online status 🔌
                </div>
              </div>

              {/* Assistant message */}
              <div className="self-start max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                    <PiSparkleBold className="w-3 h-3 text-white" />
                  </span>
                  <span className="text-xs font-semibold text-txt">Lumina</span>
                </div>
                <div className="bg-surface-2/70 border border-border rounded-2xl rounded-tl-sm px-4 py-3.5 text-left">
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    Great idea! Here's a <span className="text-accent font-medium">useOnlineStatus</span> hook —
                  </p>
                  <div className="mt-3 rounded-xl bg-surface-0/90 border border-border p-3 font-mono text-[11px] leading-relaxed text-cyan-300/90">
                    <span className="text-purple-400">export function</span>{" "}
                    <span className="text-txt">useOnlineStatus() {'{'}
                    {"\n"}  const [online, setOnline] = useState(navigator.onLine);{"\n"}  ...
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-txt-secondary">
                    It updates in real time as the connection changes — try it on the{" "}
                    <span className="text-accent font-medium">network</span> tab.
                  </p>
                  {/* Streaming dots */}
                  <div className="mt-3 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent loader-dot" />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 loader-dot" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 loader-dot" />
                  </div>
                </div>
              </div>
            </div>

            {/* Glow edge */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-accent/40 via-purple-500/30 to-cyan-400/30 opacity-60 blur-sm -z-10" />
          </div>
        </ScrollReveal>
      </div>

      {/* Stats */}
      <div className="relative border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 90}>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-txt font-display">
                  <span className="text-gradient">{stat.value}</span>
                </p>
                <p className="mt-1 text-xs text-txt-muted">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;