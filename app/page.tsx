// import Link from "next/link";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen flex-col bg-[#faf9f6] font-sans text-[#1a1a1a]">
//       {/* Hero section — nav lives inside this, image behind both */}
//       <section className="relative flex min-h-screen flex-col items-center py-4 justify-between">
//         {/* Background image */}
//         <Image
//           src="/Hero.png"
//           alt=""
//           fill
//           priority
//           className="object-cover"
//         />
//         {/* Optional dark overlay so nav/text stay readable over the image */}
//         <div className="absolute inset-0 bg-[#262626]/15" />

//         {/* Nav — relative + z-10 so it sits above the image */}
//         <nav className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-12 max-w-[750px]  bg-white text-[#262626 rounded-2xl ">
//           {/* <Link href="/" className="text-lg font-semibold tracking-tight text-white">
//             StreamSell
//           </Link> */}
//           <div className="hidden items-center justify-between gap-8 text-sm font-medium  sm:flex ]">
//             <Link href="#how" className="hover:text-white/70">
//               Home
//             </Link>
//             <Link href="#earnings" className="hover:text-white/70">
//               About
//             </Link>
//             <Link href="#faq" className="hover:text-white/70">
//               Services
//             </Link>
//             <Link href="#faq" className="hover:text-white/70">
//               Projects
//             </Link>
//             <Link href="#faq" className="hover:text-white/70">
//               Blogs
//             </Link>
//           </div>
//           {/* <div className="flex items-center gap-3">
//             <Link href="/login" className="text-sm font-medium text-white">
//               Log in
//             </Link>
//             <Link
//               href="/signup"
//               className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
//             >
//               Become a reseller
//             </Link>
//           </div> */}
//         </nav>


//         <div className="flex flex-col relative z-10 text-white gap-15">
//           <div className="flex flex-col gap-10 items-center ">
//             <div className="font-['Volkhov'] font-normal text-center leading-[40px] tracking-[-0.25px] text-white text-[clamp(40px,5vw+1rem,91px)]">
//               Plan your day

//             </div>
//             <div className="font-['Volkhov'] font-normal text-center leading-[40px] tracking-[-0.25px] text-white text-[clamp(40px,5vw+1rem,91px)]">
//               without
//               <span className="font-['Instrument_Serif'] italic"> overwhelm</span>
//             </div>
//             <div className="font-['inter'] text-md text-white">
//               Fix is a simple, ADHD-friendly planner <br></br>that turns your thoughs into a clear plan
//             </div>
//           </div>

//           <div className="flex gap-4 items-center pl-3  py-1 rounded-xl bg-black/30 font-['inter'] text-md text-white">
//             <div className="">No clutter. No complicated setup. Just your day, clearly planed</div>
//             <Button className="bg-white text-black font-bold">Join the waitlist</Button>
//           </div>
//         </div>
//       </section>
//       {/* Hero content */}
//       <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-white">
//         {/* build here */}
//       </main>

//     </div>
//   );
// }


"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { Menu, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordian"
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";
import { Highlight } from "@/components/animations/Highlight";
import { StatBar } from "@/components/animations/StateBar";
import { StatBarGroup } from "@/components/animations/StatBarGroup";
import { FadeInGroup } from "@/components/animations/FadeInGroup";
import { RiseFromFloor } from "@/components/animations/RiseFromFloor";
import { PinnedShowcase } from "@/components/sections/PinnedShowcase";
gsap.registerPlugin(TextPlugin);

const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#blogs", label: "Blogs" },
];
export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const typedTextRef = useRef<HTMLSpanElement>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);


  const items = [
    {
      value: "notifications",
      trigger: "Is Fixa made for people with ADHD?",
      content:
        "Fixa is designed with ADHD-friendly planning in mind: low-friction task creation, less visual noise, and a structure that helps you start without overthinking. It’s not a “perfect productivity” system it’s a calmer way to move through your day.",
    },
    {
      value: "privacy",
      trigger: "What makes Fixa different from other to-do apps?",
      content:
        "Most to-do apps give you more features, more lists, and more pressure. Fixa focuses on what actually helps: clarity, gentle structure, and a simple flow that doesn’t overwhelm your brain.",
    },
    {
      value: "billing",
      trigger: "Will Fixa help me stay focused?",
      content:
        "Yes. Fixa includes focus tools like a timer to help you stay in the zone. But the bigger difference is how the app feels: fewer distractions, fewer decisions, and a calmer interface that makes it easier to keep going.",
    },
    {
      value: "billingss",
      trigger: "Does Fixa replace therapy or ADHD medication?",
      content:
        "No. Fixa isn’t medical treatment, and it doesn’t replace professional support. It’s a planning tool that can support your day-to-day life alongside whatever works best for you.",
    },
    {
      value: "billings",
      trigger: "How do you handle privacy?",
      content:
        "Your tasks are personal and we treat them that way. We’re building Fixa with privacy and security in mind, and we’ll share clear details before launch so you know exactly what’s stored and why.",
    },
  ]



  // scroll-spy — unchanged
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => !!el,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: 0.5 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // safety fallback so a slow video doesn't hang the reveal forever
  useEffect(() => {
    const fallback = setTimeout(() => setVideoReady(true), 2500);
    return () => clearTimeout(fallback);
  }, []);

  // preloader timeline — now waits for videoReady
  useGSAP(
    () => {
      if (!videoReady) return;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
        },
      });

      tl.fromTo(
        typedTextRef.current,
        { opacity: 1, filter: "blur(4px)", text: "" },
        { filter: "blur(0px)", duration: 1.1, text: "STREAMHUB", ease: "none" },
      )
        .to({}, { duration: 0.4 })
        .to(overlayRef.current, { yPercent: -100, duration: 0.9 })
        .fromTo(
          ".fade-in",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
          "-=0.7",
        );
    },
    { scope: pageRef, dependencies: [videoReady] },
  );

  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (menuOpen) {
      gsap.fromTo(
        menuRef.current,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)", transformOrigin: "top center" },
      );
    }
  }, [menuOpen]);

  return (
    <div ref={pageRef} className="relative">
      {/* ================= PRELOADER OVERLAY — uncommented ================= */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      >
        <span
          ref={typedTextRef}
          className="font-['Instrument_Serif'] italic text-6xl md:text-7xl font-normal tracking-wide text-black"
        />
      </div>

      <div className="flex min-h-screen flex-col bg-[#faf9f6] font-sans text-[#1a1a1a]">
        <section
          id="hero"
          className="relative flex h-dvh flex-col items-center py-4 justify-between"
        >
          {/* <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster="/Hero.png"
            onCanPlayThrough={() => setVideoReady(true)}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/hero-bg-two.mp4" type="video/mp4" />
          </video> */}

          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/Hero.png"
            className="absolute inset-0 h-full w-full object-cover"
          >
            {/* Mobile screens (max width 768px): gets scaled down & compressed */}
            <source
              media="(max-width: 768px)"
              src="https://res.cloudinary.com/db3rq2cce/video/upload/w_720,q_auto,vc_h264,f_mp4/v1/hero-bg-mobile_a45exx.mp4"
              type="video/mp4"
            />

            {/* Desktop / Large screens: gets full quality / original size */}
            <source
              src="https://res.cloudinary.com/db3rq2cce/video/upload/q_auto,vc_h264,f_mp4/v1/hero-bg-mobile_a45exx.mp4"
              type="video/mp4"
            />
          </video>

          {/* ...rest of your hero unchanged... */}
          <div className="absolute inset-0 bg-[#262626]/15" />

          {/* Spacer — keeps the content below pushed down the same amount the
              nav used to occupy, since the nav no longer sits in normal flow */}
          <div className="h-[60px] sm:h-[68px]" aria-hidden />

          <div className="flex flex-col relative z-10 text-white gap-14 md:gap-18">
            <div className="flex flex-col gap-1 md:gap-12 items-center">
              <div className="fade-in font-['Volkhov'] font-normal text-center  leading-[40px] tracking-[-0.25px] text-white text-[clamp(42px,5vw+1rem,91px)]">
                Sell subscriptions
              </div>
              <div className="fade-in font-['Volkhov'] font-normal text-center  leading-[40px] tracking-[-0.25px] text-white text-[clamp(42px,5vw+1rem,91px)]">
                keep
                <span className="font-['Instrument_Serif'] italic"> the markup</span>
              </div>
              <div className="fade-in font-['inter'] text-md text-white text-center mt-2">
                StreamSell gives you a storefront to resell <br />
                Netflix, Spotify and more at your own price
              </div>
            </div>

            <div className=" md:hidden fade-in flex flex-col mx-8 text-center  md:flex-row gap-2 items-center  rounded-xl  font-['inter'] text-sm text-white">
              <div className="font-medium glassmorphism px-6 py-5 rounded-2xl">No inventory. No accounts to manage. Just your link, and your earnings.</div>
              <Button className="bg-white text-black font-bold mr-2 ">Become a reseller</Button>
            </div>
            <div className=" md:flex hidden fade-in  flex-col mx-6 text-center  md:flex-row gap-4 items-center pl-3 py-2 rounded-xl glassmorphism font-['inter'] text-sm text-white">
              <div className="font-medium">No inventory. No accounts to manage. Just your link, and your earnings.</div>
              <Button size="lg" className="bg-white text-black font-bold mr-2">Become a reseller</Button>
            </div>
          </div>
        </section>

        {/* ================= NAV — fixed, same look, tied to sections ================= */}
        <div className="fixed left-1/2 top-4 z-50  max-w-[750px] -translate-x-1/2">
          <nav className="fade-in flex items-center justify-between rounded-2xl bg-white px-6 py-4 text-[#262626] sm:px-12 w-full ">
            {/* Desktop links */}
            <div className="hidden items-center justify-between   w-full  gap-8 text-sm font-medium sm:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-center transition-colors ${activeSection === link.href.slice(1)
                    ? "bg-[#262626] text-white"
                    : "hover:text-black/60"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger toggle */}
            <button
              className="ml-auto sm:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Mobile dropdown */}
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute left-0 top-full mt-2 flex w-full origin-top flex-col gap-1 rounded-2xl bg-white p-2 shadow-lg sm:hidden"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-1 py-2 text-sm font-medium ${activeSection === link.href.slice(1)
                      ? "bg-black text-white"
                      : "hover:text-black/60"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>

        {/* ================= Sections tied to nav links ================= */}
        <section id="about" className="relative bg-[#EAEAEA]">
          <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-20 rounded-t-[32px]  px-6 pt-40 py-16">
            <Reveal y={60} className="mt-2 max-w-[40%] max-h-[46px] bg-black/5 px-3 py-2 text-black/50 rounded-md">
              ADHD-Friendly
            </Reveal>

            <Reveal y={60} delay={0.25} className="flex flex-col gap-8 font-['inter'] font-semibold text-[28px] md:text-[32px]">
              <div className="">
                Here, you stop fighting your brain <br className="hidden md:flex" />
                and start working with it
              </div>
              <div className="text-black/50">
                We provide clear tools designed <br className="hidden md:flex" />
                specifically for people with ADHD.
                <br />
                More <span><Highlight delay={0.2}>calm inside</Highlight>  — more <br /></span>
                <Highlight delay={0.5}>impact outside</Highlight>
              </div>
            </Reveal>
          </div>

          <div className="relative flex min-h-[80dvh] flex-col mx-4 rounded-2xl items-center justify-end mb">
            <Image src="/ManWatchingMovie.png" alt="" fill priority className="object-cover rounded-2xl" />
            <div className="w-full flex flex-col relative z-10 text-white mb-20 items-center">
              <StatBarGroup
                stats={[
                  { label: "Anxiety", from: 80, to: 41 },
                  { label: "Productivity", from: 41, to: 80 },
                ]}
              />
            </div>
          </div>
        </section>

        {/* <section id="services" className="flex min-h-screen flex-col gap-10 md:gap-15 pt-40 px-5 lg:px-27">
          <div className="flex flex-col gap-10">
            <div className="font-['inter'] font text-[26px] md:text-[32px] text-black/50">Traditional planners don't<br></br>work well for many people</div>
            <div className="font-['Volkhov'] font-semibold   leading-[40px] text-[clamp(49px,5vw+1rem,91px)]">Fixa is designed differently </div>
          </div>

          <div className="w-full grid md:grid-cols-3  gap-3 ">
            <div className="w-full flex flex-col justify-between border-2 border-black p-6 md:p-10  min-h-[240px] md:min-h-[380px] bg-[#262626] text-white rounded-3xl">
              <div className="w-10 h-10  border-white bg-white rounded-full"></div>
              <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6 ">
                <div className=" font-semibold ">Know what to do next</div>
                <div className="font-medium text-white/50">Fixa removes the clutter that makes<br></br> planning feel exhausting</div>
              </div>
            </div>
            <div className=" w-full flex flex-col justify-between border-2 border-black p-6 md:p-10   min-h-[240px] md:min-h-[380px] bg-[#262626] text-white rounded-3xl">
              <div className="w-10 h-10  border-white bg-white rounded-full"></div>
              <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6 ">
                <div className=" font-semibold ">One simple plan for today</div>
                <div className="font-medium text-white/50">it helps you focus on today without<br></br>feeling like you're behind</div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-between border-2 border-black p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#262626] text-white rounded-3xl">
              <div className="w-10 h-10  border-white bg-white rounded-full"></div>
              <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6 ">
                <div className=" font-semibold ">Add tasks naturally by speaking</div>
                <div className="font-medium text-white/50">You can just say what you need to do<br></br>and fixa gently takes it from there</div>
              </div>
            </div>
          </div>
        </section> */}


        <section id="services" className=" bg-[#EAEAEA] flex min-h-screen flex-col gap-6 md:gap-10 pt-40 px-5 lg:px-27">
          <div className="flex flex-col gap-4 md:gap-8">
            <RiseFromFloor maskClassName="py-1">
              <div className="font-['inter'] text-[26px] md:text-[32px] text-black/50">
                Traditional planners don't<br />work well for many people
              </div>
            </RiseFromFloor>

            <RiseFromFloor delay={0.15} maskClassName="pt-3 pb-8">
              <div className="font-['Volkhov'] font-semibold leading-[40px] text-[clamp(49px,5vw+1rem,91px)] ">
                Fixa is designed differently
              </div>
            </RiseFromFloor>
          </div>

          <FadeInGroup className="w-full grid md:grid-cols-3 gap-3" stagger={0.5} y={60}>
            <div className="w-full flex flex-col justify-between  p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#000000]/5  rounded-3xl">
              <div className="w-10 h-10  bg-black/50 rounded-full"></div>
              <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6">
                <div className="font-semibold">Know what to do next</div>
                <div className="font-medium text-black/50">
                  Fixa removes the clutter that makes<br /> planning feel exhausting
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col justify-between  p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#000000]/5  rounded-3xl">
              <div className="w-10 h-10  bg-black/50 rounded-full"></div>
              <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6">
                <div className="font-semibold">Know what to do next</div>
                <div className="font-medium text-black/50">
                  Fixa removes the clutter that makes<br /> planning feel exhausting
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col justify-between  p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#000000]/5  rounded-3xl">
              <div className="w-10 h-10  bg-black/50 rounded-full"></div>
              <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6">
                <div className="font-semibold">Know what to do next</div>
                <div className="font-medium text-black/50">
                  Fixa removes the clutter that makes<br /> planning feel exhausting
                </div>
              </div>
            </div>
          </FadeInGroup>
        </section>


        {/* keep this */}
        {/* <section
          id="projects"
          // className="flex  flex-col bg-[radial-gradient(circle_at_5%_10%,#e8e8e8_0%,#8a8a8a_25%,#3a3a3a_55%,#262626_80%,#0a0a0a_100%)]"
          className=" h-full flex flex-col bg-[radial-gradient(ellipse_120%_120%_at_0%_0%,#585858_0%,#8a8a8a_32%,#262626_80%,#0a0a0a_100%)]"
        >
          <div className="bg-[#262626] h-[10dvh] w-full rounded-b-[60px]"></div>
          <div className="w-full h-dvh  rounded-b-[70px] px-27 mt-20 flex  justify-between ">
            <div className="w-full h-full flex flex-col gap-5  ">
              <div className="font-['inter'] font-bold text-[26px] md:text-[32px] text-white"> Tools that work with <br></br> your mind, not against it</div>
              <div className="flex flex-col gap-3">
                <div className="px-4 py-2 rounded-[10px] glassmorphism text-white font-semibold w-fit">Designed for calm, not chaos</div>
                <div className="px-4 py-2 rounded-[10px] glassmorphism text-white font-bold w-fit">The effortless way to begin</div>
                <div className="px-4 py-2 rounded-[10px] glassmorphism text-white font-semibold w-fit">Stay fully focused</div>
                <div className="px-4 py-2 rounded-[10px] glassmorphism text-white font-semibold w-fit">Small steps, Zero guilt</div>
              </div>
            </div>
            <div className="w-full h-full grid justify-center gap-15">
              <div className="w-full h-full max-h-[550px] space-y-8  p-10 glassmorphism max-w-[500px] rounded-3xl">
                <div className="flex flex-col gap-2 ">
                  <div className="w-10 h-10 rounded-full bg-white"></div>
                  <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
                </div>
                <div className="flex items-center justify-center  w-full ">
                  <img src="/netflix.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                </div>
                <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
              </div>

              <div className="w-full h-full max-h-[550px] space-y-8  p-10 glassmorphism max-w-[500px] rounded-3xl">
                <div className="flex flex-col gap-2 ">
                  <div className="w-10 h-10 rounded-full bg-white"></div>
                  <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
                </div>
                <div className="flex items-center justify-center  w-full ">
                  <img src="/prime.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                </div>
                <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
              </div>

              <div className="w-full h-full max-h-[550px] space-y-8  p-10 glassmorphism max-w-[500px] rounded-3xl">
                <div className="flex flex-col gap-2 ">
                  <div className="w-10 h-10 rounded-full bg-white"></div>
                  <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
                </div>
                <div className="flex items-center justify-center  w-full ">
                  <img src="/crunchyrol.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                </div>
                <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
              </div>

              <div className="w-full h-full max-h-[550px] space-y-8  p-10 glassmorphism max-w-[500px] rounded-3xl">
                <div className="flex flex-col gap-2 ">
                  <div className="w-10 h-10 rounded-full bg-white"></div>
                  <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
                </div>
                <div className="flex items-center justify-center  w-full ">
                  <img src="/sportify.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                </div>
                <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
              </div>
            </div>
          </div>
        </section> */}


        <section
          id="projects"
          // className="h-full flex flex-col overflow-x-hidden md:overflow-x-visible bg-[radial-gradient(ellipse_120%_120%_at_0%_0%,#585858_0%,#8a8a8a_32%,#262626_80%,#0a0a0a_100%)]"
          className="h-full flex flex-col overflow-x-hidden md:overflow-x-visible bg-[radial-gradient(circle_at_30%_35%,#a68a3a_0%,#6b6428_30%,#3a3a22_60%,#262619_100%)]"

        >
          <div className="bg-[#EAEAEA] h-[10dvh] w-full rounded-b-[60px]" />

          <div className="w-full mt-20 pb-40">
            <PinnedShowcase
              heading={<>Tools that work with <br /> your mind, not against it</>}
              items={[
                {
                  pill: "Designed for calm, not chaos",
                  card: (
                    <div className="w-full max-h-[550px] space-y-8 p-10 bg-white/10 backdrop-blur-[2px] border-white/10 before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:border before:border-white/20 max-w-[500px] rounded-3xl">
                      <div className="flex flex-col gap-2">
                        <div className="w-10 h-10 rounded-full bg-white" />
                        <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
                      </div>
                      <div className="flex items-center justify-center w-full">
                        <img src="/netflix.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                      </div>
                      <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
                    </div>
                  ),
                },
                {
                  pill: "The effortless way to begin",
                  card: (<div className="w-full max-h-[550px] space-y-8 p-10 glassmorphism max-w-[500px] rounded-3xl">
                    <div className="flex flex-col gap-2">
                      <div className="w-10 h-10 rounded-full bg-white" />
                      <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <img src="/prime.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                    </div>
                    <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
                  </div>),
                },
                {
                  pill: "Stay fully focused",
                  card: (<div className="w-full max-h-[550px] space-y-8 p-10 glassmorphism max-w-[500px] rounded-3xl">
                    <div className="flex flex-col gap-2">
                      <div className="w-10 h-10 rounded-full bg-white" />
                      <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <img src="/crunchyrol.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                    </div>
                    <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
                  </div>),
                },
                {
                  pill: "Small steps, Zero guilt",
                  card: (<div className="w-full max-h-[550px] space-y-8 p-10 glassmorphism max-w-[500px] rounded-3xl">
                    <div className="flex flex-col gap-2">
                      <div className="w-10 h-10 rounded-full bg-white" />
                      <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <img src="/sportify.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                    </div>
                    <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
                  </div>),
                },
              ]}
            />
          </div>
        </section>


        <section id="blogs" className="flex min-h-screen flex-col px-6 rounded-t-[60px]  bg-[#EAEAEA] -mt-15 mb-15">
          <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-20 rounded-t-[32px]  px-6 pt-40 py-16">
            <Reveal y={60} className="mt-2 max-w-[40%] max-h-[46px] bg-black/5 px-3 py-2 text-black/50 rounded-md">
              ADHD-Friendly
            </Reveal>

            <Reveal y={60} delay={0.25} className="flex flex-col gap-8 font-['inter'] font-semibold text-[28px] md:text-[32px]">
              <div className="text-black/50">
                We're here to help. If you didn't find the<br className="hidden md:flex" /> answer to your question, feel free to<br />
                <span className="mr-3"><Highlight delay={0.2}>email us</Highlight></span>   anytime.
              </div>
            </Reveal>
          </div>


          <div className="flex flex-col items-center justify-center">
            <Accordion
              type="multiple"
              className="flex flex-col md:max-w-[55%] gap-3 "
              defaultValue={["notifications"]}
            >
              {items.map((item) => (
                <AccordionItem
                  className="px-7 md:max-h-[160px] py-6 rounded-[24px] bg-[#000000]/5 gap-6"
                  key={item.value}
                  value={item.value}
                >
                  <AccordionTrigger className="font-['inter']  text-[16px] md:text-[18px] font-semibold">
                    {item.trigger}
                  </AccordionTrigger>
                  <AccordionContent className="font-['inter'] text-sm md:text-[16px] font-medium text-black/60">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </section>

        <section id="blogs" className="flex min-h-[50dvh ] flex-col px-6 rounded-t-[20px]  bg-[#262626] mt-15 mx-6">
        </section>



      </div>
    </div>
  );
}