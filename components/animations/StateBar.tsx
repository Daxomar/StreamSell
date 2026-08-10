// components/animations/StatBar.tsx
"use client";

import type { RefObject } from "react";

type StatBarProps = {
  label: string;
  from: number;
  fillRef: RefObject<HTMLDivElement | null>;
  percentRef: RefObject<HTMLDivElement | null>;
};

export function StatBar({ label, from, fillRef, percentRef }: StatBarProps) {
  return (
    <div className=" glassmorphism flex h-[45px] md:h-[55px] w-full max-w-[90%] md:max-w-[30%] items-center justify-between rounded-xl pr-4">
      <div
        ref={fillRef}
        className="flex h-full items-center justify-between overflow-hidden rounded-xl bg-white pl-4"
        style={{ width: `${from}%` }}
      >
        <div className="whitespace-nowrap md:text-lg font-semibold text-black">{label}</div>
        <div className=" w-6 shrink-0 -rotate-90 border-2 border-black rounded-4xl" />
      </div>
      <div ref={percentRef} className="text-lg font-semibold text-white">
        {from}%
      </div>
    </div>
  );
}