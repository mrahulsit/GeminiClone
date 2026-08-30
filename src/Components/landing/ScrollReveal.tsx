import { type ReactNode } from "react";
import {
  useReveal,
  type RevealVariant,
} from "../../hooks/useReveal";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  className?: string;
  as?: "div" | "section" | "li";
  threshold?: number;
}

const ScrollReveal = ({
  children,
  variant = "up",
  className = "",
  as: Tag = "div",
  threshold = 0.15,
}: ScrollRevealProps) => {
  const { ref, visible } = useReveal<HTMLElement>(threshold);

  const baseClass =
    variant === "up"
      ? "reveal"
      : variant === "down"
        ? "reveal-down"
        : variant === "left"
          ? "reveal-left"
          : variant === "right"
            ? "reveal-right"
            : variant === "scale"
              ? "reveal-scale"
              : variant === "fade"
                ? "reveal-fade"
                : "reveal-blur";

  const activeClass =
    variant === "up"
      ? "reveal-in"
      : variant === "down"
        ? "reveal-down-in"
        : variant === "left"
          ? "reveal-left-in"
          : variant === "right"
            ? "reveal-right-in"
            : variant === "scale"
              ? "reveal-scale-in"
              : variant === "fade"
                ? "reveal-fade-in"
                : "reveal-blur-in";

  return (
    <Tag
      ref={ref as any}
      className={`${visible ? activeClass : baseClass} ${className}`}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
