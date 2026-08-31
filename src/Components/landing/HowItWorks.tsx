import { PiPencilSimpleBold, PiLightningBold, PiArrowsClockwiseBold } from "react-icons/pi";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    title: "Describe your idea",
    description: "Tell Lumina what you want to build, write, or understand — in plain words.",
    icon: PiPencilSimpleBold,
  },
  {
    title: "Lumina processes",
    description: "Streams a response in real time, reasoning openly and pulling live sources when needed.",
    icon: PiLightningBold,
  },
  {
    title: "Review & iterate",
    description: "Edit your message, regenerate, or ask follow-ups until it's exactly right.",
    icon: PiArrowsClockwiseBold,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/70 border border-border text-[11px] font-semibold text-accent uppercase tracking-widest">
            How it works
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-txt font-display tracking-tight">
            Up and running in <span className="text-gradient">under a minute</span>
          </h2>
          <p className="mt-3 text-txt-secondary max-w-xl mx-auto">
            No setup, no configuration. Just open a chat and start.
          </p>
        </ScrollReveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-accent/40 via-purple-500/40 to-cyan-400/40 border-t border-dashed border-border/60" />

          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 120}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex items-center gap-3">
                  <span className="w-20 h-20 rounded-2xl bg-surface-1 border border-border flex items-center justify-center shadow-lg shadow-black/20 ring-4 ring-surface-0">
                    <step.icon className="w-8 h-8 text-accent" />
                  </span>
                </div>
                <span className="mt-5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-[11px] font-bold">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-txt font-display">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-txt-secondary max-w-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;