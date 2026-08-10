// components/animations/StatBarGroup.tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { StatBar } from "./StateBar";

type Stat = {
  label: string;
  from: number;
  to: number;
};

type StatBarGroupProps = {
  stats: [Stat, Stat]; // exactly two, matching your Anxiety/Productivity case
  className?: string;
};

export function StatBarGroup({ stats, className }: StatBarGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const fillRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const percentRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: groupRef.current, // ONE trigger, watching the whole group
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      stats.forEach((stat, i) => {
        const counter = { value: stat.from };

        // every tween below is placed at position 0 —
        // all four (2 widths + 2 counters) start on the exact same frame
        tl.fromTo(
          fillRefs[i].current,
          { width: `${stat.from}%` },
          { width: `${stat.to}%`, duration: 1.2, ease: "power2.inOut" },
          0,
        ).to(
          counter,
          {
            value: stat.to,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => {
              if (percentRefs[i].current) {
                percentRefs[i].current.textContent = `${Math.round(counter.value)}%`;
              }
            },
          },
          0,
        );
      });
    },
    { scope: groupRef },
  );

  return (
    <div ref={groupRef} className={`w-full flex flex-col gap-10 items-center ${className ?? ""}`}>
      {stats.map((stat, i) => (
        <StatBar
          key={stat.label}
          label={stat.label}
          from={stat.from}
          fillRef={fillRefs[i]}
          percentRef={percentRefs[i]}
        />
      ))}
    </div>
  );
}