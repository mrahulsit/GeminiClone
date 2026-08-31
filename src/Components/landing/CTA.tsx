import { Link } from "react-router-dom";
import { PiArrowRightBold, PiSparkleBold } from "react-icons/pi";
import ScrollReveal from "./ScrollReveal";

const CTA = () => {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal variant="scale">
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-accent/60 via-purple-500/30 to-cyan-400/40">
            <div className="relative overflow-hidden rounded-3xl bg-surface-1 px-8 py-16 sm:px-16 sm:py-20 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-purple-500/5 to-cyan-500/5" />
              <div className="absolute -top-32 -right-32 w-72 h-72 bg-accent/10 rounded-full blur-[90px]" />
              <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-purple-500/10 rounded-full blur-[90px]" />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-6 shadow-lg shadow-accent/10">
                  <PiSparkleBold className="w-6 h-6 text-accent" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-txt font-display tracking-tight mb-4">
                  Ready to <span className="text-gradient">build smarter?</span>
                </h2>
                <p className="text-txt-secondary max-w-lg mx-auto mb-9 leading-relaxed">
                  Join thousands of developers shipping faster with Lumina. Start
                  your first conversation in seconds — free forever.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/app"
                    className="group gradient-btn flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-semibold text-sm active:scale-95"
                  >
                    Start building — free
                    <PiArrowRightBold className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    to="/app"
                    className="flex items-center gap-2 px-6 py-4 rounded-2xl text-txt-secondary text-sm font-medium hover:text-txt hover:bg-surface-2 transition-colors"
                  >
                    Try it now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTA;