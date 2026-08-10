// components/animations/RiseFromFloor.tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type RiseFromFloorProps = {
  children: ReactNode;
  className?: string;      // classes for the inner content (your actual styling)
  maskClassName?: string;  // classes for the outer mask, rarely needed beyond overflow-hidden
  delay?: number;
  duration?: number;
  trigger?: "scroll" | "immediate";
};

export function RiseFromFloor({
  children,
  className,
  maskClassName,
  delay = 0,
  duration = 0.9,
  trigger = "scroll",
}: RiseFromFloorProps) {
  const maskRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const vars = {
        yPercent: 0,
        duration,
        delay,
        ease: "power3.out",
      };

      if (trigger === "scroll") {
        gsap.fromTo(contentRef.current, { yPercent: 130 }, {
          ...vars,
          scrollTrigger: {
            trigger: maskRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      } else {
        gsap.fromTo(contentRef.current, { yPercent: 100 }, vars);
      }
    },
    { scope: maskRef },
  );

  return (
    <div ref={maskRef} className={`overflow-hidden ${maskClassName ?? ""}`}>
      <div ref={contentRef} className={className}>
        {children}
      </div>
    </div>
  );
}