import { Link } from "react-router-dom";
import { PiArrowRightBold, PiSparkleBold } from "react-icons/pi";
import ScrollReveal from "./ScrollReveal";

const CTA = () => {
  return (
    <section className="landing-section">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal variant="scale">
          <div className="relative overflow-hidden rounded-3xl bg-surface-1 border border-border">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-purple-500/5 to-cyan-500/5" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-6">
                <PiSparkleBold className="w-6 h-6 text-accent" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-txt mb-4">
                Ready to build smarter?
              </h2>
              <p className="text-txt-secondary max-w-lg mx-auto mb-8">
                Join thousands of developers who are shipping faster with Lumina.
                Start your first conversation today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/app"
                  className="group flex items-center gap-2.5 px-8 py-4 rounded-full bg-accent text-white font-semibold text-sm hover:bg-accent-light transition-all duration-200 hover:shadow-xl hover:shadow-accent/25 active:scale-95"
                >
                  Start Building for Free
                  <PiArrowRightBold className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="#pricing"
                  className="flex items-center gap-2 px-6 py-4 rounded-full text-txt-secondary text-sm font-medium hover:text-txt transition-colors"
                >
                  View Pricing
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTA;
