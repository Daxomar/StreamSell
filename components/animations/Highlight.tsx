// components/animations/Highlight.tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type HighlightProps = {
  children: ReactNode;
  delay?: number;
};

export function Highlight({ children, delay = 0 }: HighlightProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        bgRef.current,
        { scaleX: 0 },
        { scaleX: 1.1, duration: 1.1, ease: "power2.inOut", transformOrigin: "left center", delay },
      ).fromTo(
        textRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power1.out" },
        "-=0.2", // text starts fading + rising while the sweep is still ~mid-way across
      );
    },
    { scope: wrapRef },
  );

  return (
    <span ref={wrapRef} className="relative inline-block  rounded-md px-1 mb-2">
      <span ref={bgRef} className="absolute inset-0 rounded-md bg-white" />
      <span ref={textRef} className="relative inline-block text-black font-medium">
        {children}
      </span>
    </span>
  );
}