import { PiStarFill, PiQuotesBold } from "react-icons/pi";
import ScrollReveal from "./ScrollReveal";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  initials: string;
  gradient: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Alexandre",
    role: "Software Engineer",
    content:
      "Lumina has become my pair programmer. It writes clean code, catches bugs before I do, and explains the reasoning — so I actually learn.",
    initials: "A",
    gradient: "from-accent to-purple-500",
  },
  {
    name: "Maria",
    role: "Product Designer",
    content:
      "The image generation is incredible. I concept fresh visuals for client pitches in seconds instead of an afternoon.",
    initials: "M",
    gradient: "from-pink-500 to-orange-400",
  },
  {
    name: "James",
    role: "Product Manager",
    content:
      "The visible thinking is a game-changer. I can see the AI's reasoning and trust its outputs far more than a black box.",
    initials: "J",
    gradient: "from-cyan-400 to-blue-500",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 top-24 mx-auto w-96 h-64 bg-accent/8 rounded-full blur-[110px] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/70 border border-border text-[11px] font-semibold text-accent uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-txt font-display tracking-tight">
            Loved by people who <span className="text-gradient">ship stuff</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 100}>
              <div className="relative flex flex-col h-full rounded-2xl border border-border bg-surface-1/70 backdrop-blur p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10">
                <PiQuotesBold className="absolute top-5 right-5 w-6 h-6 text-accent/15" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <PiStarFill key={s} className="w-3.5 h-3.5 text-amber-400" />
                  ))}
                </div>
                <blockquote className="flex-1">
                  <p className="text-sm text-txt-secondary leading-relaxed">{t.content}</p>
                </blockquote>
                <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-surface-0 text-sm font-bold`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-txt">{t.name}</p>
                    <p className="text-xs text-txt-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;