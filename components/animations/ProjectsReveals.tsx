"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function ProjectsReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const behindRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        behindRef.current,
        { yPercent: -100 }, // starts fully tucked up behind the front panel
        {
          yPercent: 0,       // slides down into its natural position
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: true,      // ties the motion directly to scroll position
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section id="projects" ref={containerRef} className="relative">
      {/* FRONT panel — stays in front (higher z), its rounded bottom is the "lip" */}
      <div className="relative z-20 h-[70vh] w-full rounded-b-[100px] bg-[#faf9f6]" />

      {/* clipping wrapper — hides the behind-panel until it slides out past the lip */}
      <div className="relative z-10 -mt-[100px] overflow-hidden">
        <div
          ref={behindRef}
          className="min-h-dvh w-full rounded-b-[70px] bg-[radial-gradient(circle_at_30%_35%,#e8e8e8_0%,#8a8a8a_25%,#3a3a3a_55%,#262626_80%,#0a0a0a_100%)]"
        >
          1
        </div>
      </div>
    </section>
  );
}





        // <section id="projects" className="relative">
        //   {/* first panel — sticks in place while you scroll */}
        //   <div className="sticky top-0 h-dvh bg-[#faf9f6] rounded-b-[100px] flex items-center justify-center">
        //     first panel content
        //   </div>

        //   {/* second panel — scrolls up and covers the sticky first one */}
        //   <div className="relative z-10 min-h-dvh rounded-t-[70px] bg-[radial-gradient(circle_at_30%_35%,#e8e8e8_0%,#8a8a8a_25%,#3a3a3a_55%,#262626_80%,#0a0a0a_100%)] flex items-center justify-center">
        //     1
        //   </div>
        // </section>