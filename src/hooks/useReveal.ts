import { useEffect, useRef, useState } from "react";

export type RevealVariant = "up" | "down" | "left" | "right" | "scale" | "fade" | "blur";

export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -56px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible } as const;
}

/** Staggered drop-in: children animate one after another (0.08s gap). Use on a grid/row. */
export function useStagger<T extends HTMLElement>(count: number, opts?: { delayMs?: number; threshold?: number }) {
  const delay = opts?.delayMs ?? 82;
  const { ref, visible } = useReveal<T>(opts?.threshold ?? 0.12);
  const delays = visible ? Array.from({ length: count }, (_, i) => `${i * delay}ms`) : [];
  return { ref, visible, delays, delay } as const;
}

/** Scroll-linked progress 0→1 for the element passing through viewport. Respects prefers-reduced-motion. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when top enters bottom of viewport, 1 when bottom leaves top
        const start = r.top - vh;
        const end = r.bottom;
        const span = vh + r.height;
        const p = Math.min(1, Math.max(0, (-start) / span));
        setProgress(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);
  return { ref, progress } as const;
}

export function revealClasses(visible: boolean, variant: RevealVariant = "up") {
  if (!visible) {
    if (variant === "scale") return "reveal-scale";
    if (variant === "fade") return "reveal-fade";
    if (variant === "blur") return "reveal-blur";
    if (variant === "left") return "reveal-left";
    if (variant === "right") return "reveal-right";
    if (variant === "down") return "reveal-down";
    return "reveal";
  }
  if (variant === "scale") return "reveal-scale-in";
  if (variant === "fade") return "reveal-fade-in";
  if (variant === "blur") return "reveal-blur-in";
  if (variant === "left") return "reveal-left-in";
  if (variant === "right") return "reveal-right-in";
  if (variant === "down") return "reveal-down-in";
  return "reveal-in";
}
