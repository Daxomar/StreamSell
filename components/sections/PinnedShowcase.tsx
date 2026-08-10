// components/sections/PinnedShowcase.tsx
"use client";

import { useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Button } from "../ui/button";

type ShowcaseItem = {
    pill: string;
    card: ReactNode; // the full card JSX for this item
};

type PinnedShowcaseProps = {
    heading: ReactNode;
    items: ShowcaseItem[];
};

export function PinnedShowcase({ heading, items }: PinnedShowcaseProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useGSAP(
        () => {
            cardRefs.current.forEach((card, i) => {
                if (!card) return;

                // 1) fade + slide in from the right; reverses on scroll back up
                gsap.fromTo(
                    card,
                    { opacity: 0, x: 80 },
                    {
                        opacity: 1,
                        x: 0,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%",
                            end: "top 40%",
                            scrub: true, // ties motion to scroll both directions (in AND out)
                        },
                    },
                );

                // 2) when this card is centered, mark its pill active
                ScrollTriggerActivate(card, i);
            });

            function ScrollTriggerActivate(card: HTMLDivElement, i: number) {
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "center 60%",
                        end: "center 40%",
                        onToggle: (self) => {
                            if (self.isActive) setActiveIndex(i);
                        },
                    },
                });
            }
        },
        { scope: sectionRef },
    );

    return (
        <div ref={sectionRef} className="flex flex-col gap-12 px-6 lg:flex-row lg:justify-between lg:gap-8 lg:px-27" >
            {/* LEFT — pins on desktop, static on mobile */}
            <div className="flex flex-col justify-between gap-5 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:max-w-[583px] lg:self-start">
                {/* TOP block — heading + pills */}
                <div className="flex flex-col gap-5">
                    <div className="font-['inter'] font-bold text-[26px] md:text-[32px] text-white">
                        {heading}
                    </div>
                    <div className="flex flex-col gap-3">
                        {items.map((item, i) => (
                            <div
                                key={i}
                                className={`w-fit rounded-[10px] text-white transition-all duration-300 ${activeIndex === i
                                        ? "glassmorphism bg-white/20 px-6 py-3 text-[18px] font-bold scale-[1.03]"
                                        : "glassmorphism px-4 py-2 text-[16px] font-semibold opacity-60"
                                    }`}
                            >
                                {item.pill}
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM block — pushed to the bottom by justify-between */}
                <div className="flex gap-4 flex-col font-['inter'] text-[16px] font-semibold text-white">
                    <div>No clutter. No complicated setup.<br /> just your day, clearly planned</div>
                    <Button size="lg" className="bg-white text-black font-bold mr-2 w-fit">Become a reseller</Button>
                </div>
            </div>

            {/* RIGHT — scrolls */}
            <div className="grid justify-center gap-15 lg:gap-24">
                {items.map((item, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            cardRefs.current[i] = el;
                        }}
                    >
                        {item.card}
                    </div>
                ))}
            </div>
        </div>
    );
}