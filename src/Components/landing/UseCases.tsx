import {
  PiCodeBold,
  PiLightbulbBold,
  PiPencilSimpleBold,
  PiBookOpenBold,
} from "react-icons/pi";
import type { IconType } from "react-icons";
import ScrollReveal from "./ScrollReveal";

interface UseCase {
  title: string;
  description: string;
  icon: IconType;
  chip: string;
}

const useCases: UseCase[] = [
  {
    title: "Write code",
    description: "Generate production-ready code, tests, and fixes in any language or framework.",
    icon: PiCodeBold,
    chip: "bg-indigo-500/12 text-indigo-400",
  },
  {
    title: "Explain concepts",
    description: "Break complex topics into clear, digestible explanations with examples.",
    icon: PiLightbulbBold,
    chip: "bg-purple-500/12 text-purple-400",
  },
  {
    title: "Help me write",
    description: "Draft emails, docs, and content that sound like you — fast.",
    icon: PiPencilSimpleBold,
    chip: "bg-orange-500/12 text-orange-400",
  },
  {
    title: "Learn something new",
    description: "Master new subjects with practical analogies, quizzes, and step-by-step plans.",
    icon: PiBookOpenBold,
    chip: "bg-green-500/12 text-green-400",
  },
];

const UseCases = () => {
  return (
    <section id="use-cases" className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/70 border border-border text-[11px] font-semibold text-accent uppercase tracking-widest">
            Use cases
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-txt font-display tracking-tight">
            What you can do with <span className="text-gradient">Lumina</span>
          </h2>
          <p className="mt-3 text-txt-secondary max-w-xl mx-auto">
            A few of the ways people put Lumina to work every day.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {useCases.map((useCase, i) => (
            <ScrollReveal key={useCase.title} delay={i * 90}>
              <div className="group h-full rounded-2xl border border-border bg-surface-1/70 backdrop-blur p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10">
                <span
                  className={`inline-flex w-11 h-11 rounded-xl items-center justify-center ${useCase.chip}`}
                >
                  <useCase.icon className="w-5 h-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-txt font-display">
                  {useCase.title}
                </h3>
                <p className="mt-2 text-sm text-txt-secondary leading-relaxed">
                  {useCase.description}
                </p>
                <div className="mt-4 h-px w-10 bg-accent/30 group-hover:w-full transition-all duration-300" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;