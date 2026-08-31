import { useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import UseCases from "./UseCases";
import Testimonials from "./Testimonials";
import CTA from "./CTA";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";

const Landing = () => {
  // Force dark mode for the landing page
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("landing-dark");
    return () => {
      root.classList.remove("landing-dark");
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-0 text-txt overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <UseCases />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
