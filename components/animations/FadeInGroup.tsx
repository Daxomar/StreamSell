// components/animations/FadeInGroup.tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type FadeInGroupProps = {
  children: ReactNode;
  className?: string;
  itemSelector?: string; // which children inside to animate — defaults to direct children
  stagger?: number;
  y?: number;
};

export function FadeInGroup({
  children,
  className,
  itemSelector = ":scope > *",
  stagger = 0.1,
  y = 20,
}: FadeInGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = groupRef.current?.querySelectorAll(itemSelector);
      if (!items?.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: groupRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: groupRef },
  );

  return (
    <div ref={groupRef} className={className}>
      {children}
    </div>
  );
}