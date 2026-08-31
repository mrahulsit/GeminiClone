import {
  PiChatCircleDotsBold,
  PiImageBold,
  PiCodeBold,
  PiBrainBold,
  PiGlobeSimpleBold,
  PiShieldCheckBold,
} from "react-icons/pi";
import type { IconType } from "react-icons";
import ScrollReveal from "./ScrollReveal";

interface Feature {
  title: string;
  description: string;
  icon: IconType;
  chip: string;
  iconClass: string;
  hoverClass: string;
}

const FEATURES: Feature[] = [
  {
    title: "Chat & streaming",
    description: "Real-time conversations with smooth, token-by-token streaming responses.",
    icon: PiChatCircleDotsBold,
    chip: "bg-accent/12 text-accent",
    iconClass: "text-accent",
    hoverClass: "hover:border-accent/40 hover:shadow-accent/15",
  },
  {
    title: "Image generation",
    description: "Create stunning visuals from a text prompt powered by imagen 3.0.",
    icon: PiImageBold,
    chip: "bg-cyan-500/12 text-cyan-400",
    iconClass: "text-cyan-400",
    hoverClass: "hover:border-cyan-400/40 hover:shadow-cyan-400/15",
  },
  {
    title: "Code generation",
    description: "Write, debug, and explain production-ready code in any language.",
    icon: PiCodeBold,
    chip: "bg-green-500/12 text-green-400",
    iconClass: "text-green-400",
    hoverClass: "hover:border-green-400/40 hover:shadow-green-400/15",
  },
  {
    title: "Visible thinking",
    description: "Peek into the model's reasoning process and trust every answer more.",
    icon: PiBrainBold,
    chip: "bg-purple-500/12 text-purple-400",
    iconClass: "text-purple-400",
    hoverClass: "hover:border-purple-400/40 hover:shadow-purple-400/15",
  },
  {
    title: "Web search",
    description: "Ask about live topics and get answers backed by real, citable sources.",
    icon: PiGlobeSimpleBold,
    chip: "bg-sky-500/12 text-sky-400",
    iconClass: "text-sky-400",
    hoverClass: "hover:border-sky-400/40 hover:shadow-sky-400/15",
  },
  {
    title: "Private & secure",
    description: "Your chats are yours. Encrypted at rest and stored with care.",
    icon: PiShieldCheckBold,
    chip: "bg-amber-500/12 text-amber-400",
    iconClass: "text-amber-400",
    hoverClass: "hover:border-amber-400/40 hover:shadow-amber-400/15",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/70 border border-border text-[11px] font-semibold text-accent uppercase tracking-widest">
            Features
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-txt font-display tracking-tight">
            Everything you need to <span className="text-gradient">build with AI</span>
          </h2>
          <p className="mt-3 text-txt-secondary max-w-xl mx-auto">
            From instant answers to production code — one polished workspace for
            you to create, explore, and ship.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 70}>
              <div
                className={`group relative h-full rounded-2xl border border-border bg-surface-1/70 backdrop-blur p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${feature.hoverClass}`}
              >
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-white/3 blur-2xl transition-all duration-300 group-hover:bg-white/5" />
                <span
                  className={`relative inline-flex w-12 h-12 rounded-xl items-center justify-center ${feature.chip}`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconClass}`} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-txt font-display">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-txt-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;