
// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { TextPlugin } from "gsap/TextPlugin";
// import { Menu, X } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../components/ui/accordian"
// import { Button } from "@/components/ui/button";
// import { Reveal } from "@/components/animations/Reveal";
// import { Highlight } from "@/components/animations/Highlight";
// import { StatBar } from "@/components/animations/StateBar";
// import { StatBarGroup } from "@/components/animations/StatBarGroup";
// import { FadeInGroup } from "@/components/animations/FadeInGroup";
// import { RiseFromFloor } from "@/components/animations/RiseFromFloor";
// import { PinnedShowcase } from "@/components/sections/PinnedShowcase";
// gsap.registerPlugin(TextPlugin);

// const NAV_LINKS = [
//   { href: "#hero", label: "Home" },
//   { href: "#about", label: "About" },
//   { href: "#services", label: "Services" },
//   { href: "#projects", label: "Projects" },
//   { href: "#blogs", label: "Blogs" },
// ];


// export const useScrollAnimation = () => {
//   const ref = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('grow-on-scroll');
//           observer.unobserve(entry.target);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (ref.current) observer.observe(ref.current);

//     return () => observer.disconnect();
//   }, []);

//   return ref;
// };

// export default function Home() {
//   const pageRef = useRef<HTMLDivElement>(null);
//   const overlayRef = useRef<HTMLDivElement>(null);
//   const typedTextRef = useRef<HTMLSpanElement>(null);
//   const [activeSection, setActiveSection] = useState("hero");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [videoReady, setVideoReady] = useState(false);
//   const animRef = useScrollAnimation();

// <div ref={animRef}>Content grows when scrolled into view</div>
//   const items = [
//     {
//       value: "notifications",
//       trigger: "Is Fixa made for people with ADHD?",
//       content:
//         "Fixa is designed with ADHD-friendly planning in mind: low-friction task creation, less visual noise, and a structure that helps you start without overthinking. It’s not a “perfect productivity” system it’s a calmer way to move through your day.",
//     },
//     {
//       value: "privacy",
//       trigger: "What makes Fixa different from other to-do apps?",
//       content:
//         "Most to-do apps give you more features, more lists, and more pressure. Fixa focuses on what actually helps: clarity, gentle structure, and a simple flow that doesn’t overwhelm your brain.",
//     },
//     {
//       value: "billing",
//       trigger: "Will Fixa help me stay focused?",
//       content:
//         "Yes. Fixa includes focus tools like a timer to help you stay in the zone. But the bigger difference is how the app feels: fewer distractions, fewer decisions, and a calmer interface that makes it easier to keep going.",
//     },
//     {
//       value: "billingss",
//       trigger: "Does Fixa replace therapy or ADHD medication?",
//       content:
//         "No. Fixa isn’t medical treatment, and it doesn’t replace professional support. It’s a planning tool that can support your day-to-day life alongside whatever works best for you.",
//     },
//     {
//       value: "billings",
//       trigger: "How do you handle privacy?",
//       content:
//         "Your tasks are personal and we treat them that way. We’re building Fixa with privacy and security in mind, and we’ll share clear details before launch so you know exactly what’s stored and why.",
//     },
//   ]



//   // scroll-spy — unchanged
//   useEffect(() => {
//     const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
//       (el): el is Element => !!el,
//     );
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
//         if (visible) setActiveSection(visible.target.id);
//       },
//       { threshold: 0.5 },
//     );
//     sections.forEach((s) => observer.observe(s));
//     return () => observer.disconnect();
//   }, []);

//   // safety fallback so a slow video doesn't hang the reveal forever
//   useEffect(() => {
//     const fallback = setTimeout(() => setVideoReady(true), 2500);
//     return () => clearTimeout(fallback);
//   }, []);

//   // preloader timeline — now waits for videoReady
//   useGSAP(
//     () => {
//       if (!videoReady) return;

//       const tl = gsap.timeline({
//         defaults: { ease: "power2.out" },
//         onComplete: () => {
//           if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
//         },
//       });

//       tl.fromTo(
//         typedTextRef.current,
//         { opacity: 1, filter: "blur(4px)", text: "" },
//         { filter: "blur(0px)", duration: 1.1, text: "STREAMHUB", ease: "none" },
//       )
//         .to({}, { duration: 0.4 })
//         .to(overlayRef.current, { yPercent: -100, duration: 0.9 })
//         .fromTo(
//           ".fade-in",
//           { opacity: 0, y: 24 },
//           { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
//           "-=0.7",
//         );
//     },
//     { scope: pageRef, dependencies: [videoReady] },
//   );

//   const menuRef = useRef<HTMLDivElement>(null);

//   useGSAP(() => {
//     if (menuOpen) {
//       gsap.fromTo(
//         menuRef.current,
//         { scaleY: 0, opacity: 0 },
//         { scaleY: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)", transformOrigin: "top center" },
//       );
//     }
//   }, [menuOpen]);





//   return (
//     <div ref={pageRef} className="relative">
//       {/* ================= PRELOADER OVERLAY — uncommented ================= */}
//       <div
//         ref={overlayRef}
//         className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
//       >
//         <span
//           ref={typedTextRef}
//           className="font-['Instrument_Serif'] italic text-6xl md:text-7xl font-normal tracking-wide text-black"
//         />
//       </div>

//       <div className="flex min-h-screen flex-col bg-[#EAEAEA] font-sans text-[#1a1a1a]">
//         <section
//           id="hero"
//           className="relative flex h-[110dvh] flex-col items-center py-25 justify-between"
//         >
//           {/* <video
//             ref={videoRef}
//             autoPlay
//             muted
//             loop
//             playsInline
//             poster="/Hero.png"
//             onCanPlayThrough={() => setVideoReady(true)}
//             className="absolute inset-0 h-full w-full object-cover"
//           >
//             <source src="/videos/hero-bg-two.mp4" type="video/mp4" />
//           </video> */}

//           <video
//             autoPlay
//             muted
//             loop
//             playsInline
//             preload="metadata"
//             poster="/Hero.png"
//             className="absolute inset-0 h-full w-full object-cover"
//           >
//             {/* Mobile screens (max width 768px): gets scaled down & compressed */}
//             <source
//               media="(max-width: 768px)"
//               src="https://res.cloudinary.com/db3rq2cce/video/upload/w_720,q_auto,vc_h264,f_mp4/v1/hero-bg-mobile_a45exx.mp4"
//               type="video/mp4"
//             />

//             {/* Desktop / Large screens: gets full quality / original size */}
//             <source
//               src="https://res.cloudinary.com/db3rq2cce/video/upload/q_auto,vc_h264,f_mp4/v1/hero-bg-mobile_a45exx.mp4"
//               type="video/mp4"
//             />
//           </video>

//           {/* ...rest of your hero unchanged... */}
//           <div className="absolute inset-0 bg-[#262626]/15" />

//           {/* Spacer — keeps the content below pushed down the same amount the
//               nav used to occupy, since the nav no longer sits in normal flow */}
//           <div className="h-[60px] sm:h-[68px]" aria-hidden />

//           <div className="flex flex-col relative z-10 text-white gap-14 md:gap-18">
//             <div className="flex flex-col gap-1 md:gap-12 items-center">
//               <div className="fade-in font-['Volkhov'] font-normal text-center  leading-[40px] tracking-[-0.25px] text-white text-[clamp(42px,5vw+1rem,91px)]">
//                 Sell subscriptions
//               </div>
//               <div className="fade-in font-['Volkhov'] font-normal text-center  leading-[40px] tracking-[-0.25px] text-white text-[clamp(42px,5vw+1rem,91px)]">
//                 keep
//                 <span className="font-['Instrument_Serif'] italic"> the markup</span>
//               </div>
//               <div className="fade-in font-['inter'] text-md text-white text-center mt-2">
//                 StreamSell gives you a storefront to resell <br />
//                 Netflix, Spotify and more at your own price
//               </div>
//             </div>

//             <div className=" md:hidden fade-in flex flex-col mx-8 text-center  md:flex-row gap-2 items-center  rounded-xl  font-['inter'] text-sm text-white">
//               <div className="font-medium glassmorphism px-6 py-5 rounded-2xl">No inventory. No accounts to manage. Just your link, and your earnings.</div>
//               <Button className="bg-white text-black font-bold mr-2 hover:bg-black/40 hover:text-black/40">Become a reseller</Button>
//             </div>
//             <div className=" md:flex hidden fade-in  flex-col mx-6 text-center  md:flex-row gap-4 items-center pl-3 py-2 rounded-xl glassmorphism font-['inter'] text-sm text-white">
//               <div className="font-medium">No inventory. No accounts to manage. Just your link, and your earnings.</div>
//               <Button size="lg" className="bg-white text-black font-bold mr-2 hover:bg-[#262626] hover:text-white">Become a reseller</Button>
//             </div>
//           </div>
//         </section>

//         {/* ================= NAV — fixed, same look, tied to sections ================= */}
//         <div className="fixed left-1/2 top-4 z-50  max-w-[750px] -translate-x-1/2">
//           <nav className="fade-in flex items-center justify-between rounded-2xl bg-white px-6 py-4 text-[#262626] sm:px-12 w-full ">
//             {/* Desktop links */}
//             <div className="hidden items-center justify-between   w-full  gap-8 text-sm font-medium sm:flex">
//               {NAV_LINKS.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={`rounded-full px-4 py-1.5 text-center transition-colors ${activeSection === link.href.slice(1)
//                     ? "bg-[#262626] text-white"
//                     : "hover:text-black/60"
//                     }`}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>

//             {/* Mobile hamburger toggle */}
//             <button
//               className="ml-auto sm:hidden"
//               onClick={() => setMenuOpen((v) => !v)}
//               aria-label="Toggle menu"
//             >
//               {menuOpen ? <X size={22} /> : <Menu size={22} />}
//             </button>

//             {/* Mobile dropdown */}
//             {menuOpen && (
//               <div
//                 ref={menuRef}
//                 className="absolute left-0 top-full mt-2 flex w-full origin-top flex-col gap-1 rounded-2xl bg-white p-2 shadow-lg sm:hidden"
//               >
//                 {NAV_LINKS.map((link) => (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     onClick={() => setMenuOpen(false)}
//                     className={`rounded-xl px-1 py-2 text-sm font-medium ${activeSection === link.href.slice(1)
//                       ? "bg-black text-white"
//                       : "hover:text-black/60"
//                       }`}
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </nav>
//         </div>

//         {/* ================= Sections tied to nav links ================= */}
//         <section id="about" className="relative bg-[#EAEAEA] -mt-15 rounded-t-[60px]">
//           <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-20 rounded-t-[32px]  px-6 pt-40 py-16">
//             <Reveal y={60} className="mt-2 max-w-[40%] max-h-[46px] bg-black/5 px-3 py-2 text-black/50 rounded-md">
//               Stream-Hub
//             </Reveal>

//             <Reveal y={60} delay={0.25} className="flex flex-col gap-8 font-['inter'] font-semibold text-[28px] md:text-[32px]">
//               <div className="">
//                 Want to stream for less?  <br className="hidden md:flex" />
//                 or sell access to such platforms for less?
//               </div>
//               <div className="text-black/50">
//                 We give you a storefront to resell <br className="hidden md:flex" />
//                 access to streaming platforms.
//                 <br />
//                 Cheaper <span><Highlight delay={0.2}>access</Highlight>  — more <br /></span>
//                 <Highlight delay={0.5}>potential profits</Highlight>
//               </div>
//             </Reveal>
//           </div>

//           <div className="relative flex min-h-[80dvh] flex-col mx-4 rounded-2xl items-center justify-end mb">
//             <Image src="/ManWatchingMovie.png" alt="" fill priority className="object-cover rounded-2xl" />
//             <div className="w-full flex flex-col relative z-10 text-white mb-20 items-center">
//               <StatBarGroup
//                 stats={[
//                   { label: "Anxiety", from: 80, to: 41 },
//                   { label: "Your margins", from: 41, to: 80 },
//                 ]}
//               />
//             </div>
//           </div>
//         </section>

//         {/* <section id="services" className="flex min-h-screen flex-col gap-10 md:gap-15 pt-40 px-5 lg:px-27">
//           <div className="flex flex-col gap-10">
//             <div className="font-['inter'] font text-[26px] md:text-[32px] text-black/50">Traditional planners don't<br></br>work well for many people</div>
//             <div className="font-['Volkhov'] font-semibold   leading-[40px] text-[clamp(49px,5vw+1rem,91px)]">Fixa is designed differently </div>
//           </div>

//           <div className="w-full grid md:grid-cols-3  gap-3 ">
//             <div className="w-full flex flex-col justify-between border-2 border-black p-6 md:p-10  min-h-[240px] md:min-h-[380px] bg-[#262626] text-white rounded-3xl">
//               <div className="w-10 h-10  border-white bg-white rounded-full"></div>
//               <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6 ">
//                 <div className=" font-semibold ">Know what to do next</div>
//                 <div className="font-medium text-white/50">Fixa removes the clutter that makes<br></br> planning feel exhausting</div>
//               </div>
//             </div>
//             <div className=" w-full flex flex-col justify-between border-2 border-black p-6 md:p-10   min-h-[240px] md:min-h-[380px] bg-[#262626] text-white rounded-3xl">
//               <div className="w-10 h-10  border-white bg-white rounded-full"></div>
//               <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6 ">
//                 <div className=" font-semibold ">One simple plan for today</div>
//                 <div className="font-medium text-white/50">it helps you focus on today without<br></br>feeling like you're behind</div>
//               </div>
//             </div>
//             <div className="w-full flex flex-col justify-between border-2 border-black p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#262626] text-white rounded-3xl">
//               <div className="w-10 h-10  border-white bg-white rounded-full"></div>
//               <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6 ">
//                 <div className=" font-semibold ">Add tasks naturally by speaking</div>
//                 <div className="font-medium text-white/50">You can just say what you need to do<br></br>and fixa gently takes it from there</div>
//               </div>
//             </div>
//           </div>
//         </section> */}


//         <section id="services" className=" bg-[#EAEAEA] flex min-h-screen flex-col gap-6 md:gap-10 pt-40 px-5 lg:px-27">
//           <div className="flex flex-col gap-4 md:gap-8">
//             <RiseFromFloor maskClassName="py-1">
//               <div className="font-['inter'] text-[26px] md:text-[32px] text-black/50">
//                 Traditional planners don't<br />work well for many people
//               </div>
//             </RiseFromFloor>

//             <RiseFromFloor delay={0.15} maskClassName="pt-3 pb-8">
//               <div className="font-['Volkhov'] font-semibold leading-[40px] text-[clamp(49px,5vw+1rem,91px)] ">
//                 Fixa is designed differently
//               </div>
//             </RiseFromFloor>
//           </div>

//           <FadeInGroup className="w-full grid md:grid-cols-3 gap-3" stagger={0.5} y={60}>
//             <div className="w-full flex flex-col justify-between  p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#000000]/5  rounded-3xl">
//               <div className="w-10 h-10  bg-black/50 rounded-full"></div>
//               <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6">
//                 <div className="font-semibold">Know what to do next</div>
//                 <div className="font-medium text-black/50">
//                   Fixa removes the clutter that makes<br /> planning feel exhausting
//                 </div>
//               </div>
//             </div>

//             <div className="w-full flex flex-col justify-between  p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#000000]/5  rounded-3xl">
//               <div className="w-10 h-10  bg-black/50 rounded-full"></div>
//               <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6">
//                 <div className="font-semibold">Know what to do next</div>
//                 <div className="font-medium text-black/50">
//                   Fixa removes the clutter that makes<br /> planning feel exhausting
//                 </div>
//               </div>
//             </div>

//             <div className="w-full flex flex-col justify-between  p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#000000]/5  rounded-3xl">
//               <div className="w-10 h-10  bg-black/50 rounded-full"></div>
//               <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6">
//                 <div className="font-semibold">Know what to do next</div>
//                 <div className="font-medium text-black/50">
//                   Fixa removes the clutter that makes<br /> planning feel exhausting
//                 </div>
//               </div>
//             </div>
//           </FadeInGroup>
//         </section>


//         {/* keep this */}
//         {/* <section
//           id="projects"
//           // className="flex  flex-col bg-[radial-gradient(circle_at_5%_10%,#e8e8e8_0%,#8a8a8a_25%,#3a3a3a_55%,#262626_80%,#0a0a0a_100%)]"
//           className=" h-full flex flex-col bg-[radial-gradient(ellipse_120%_120%_at_0%_0%,#585858_0%,#8a8a8a_32%,#262626_80%,#0a0a0a_100%)]"
//         >
//           <div className="bg-[#262626] h-[10dvh] w-full rounded-b-[60px]"></div>
//           <div className="w-full h-dvh  rounded-b-[70px] px-27 mt-20 flex  justify-between ">
//             <div className="w-full h-full flex flex-col gap-5  ">
//               <div className="font-['inter'] font-bold text-[26px] md:text-[32px] text-white"> Tools that work with <br></br> your mind, not against it</div>
//               <div className="flex flex-col gap-3">
//                 <div className="px-4 py-2 rounded-[10px] glassmorphism text-white font-semibold w-fit">Designed for calm, not chaos</div>
//                 <div className="px-4 py-2 rounded-[10px] glassmorphism text-white font-bold w-fit">The effortless way to begin</div>
//                 <div className="px-4 py-2 rounded-[10px] glassmorphism text-white font-semibold w-fit">Stay fully focused</div>
//                 <div className="px-4 py-2 rounded-[10px] glassmorphism text-white font-semibold w-fit">Small steps, Zero guilt</div>
//               </div>
//             </div>
//             <div className="w-full h-full grid justify-center gap-15">
//               <div className="w-full h-full max-h-[550px] space-y-8  p-10 glassmorphism max-w-[500px] rounded-3xl">
//                 <div className="flex flex-col gap-2 ">
//                   <div className="w-10 h-10 rounded-full bg-white"></div>
//                   <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
//                 </div>
//                 <div className="flex items-center justify-center  w-full ">
//                   <img src="/netflix.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
//                 </div>
//                 <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
//               </div>

//               <div className="w-full h-full max-h-[550px] space-y-8  p-10 glassmorphism max-w-[500px] rounded-3xl">
//                 <div className="flex flex-col gap-2 ">
//                   <div className="w-10 h-10 rounded-full bg-white"></div>
//                   <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
//                 </div>
//                 <div className="flex items-center justify-center  w-full ">
//                   <img src="/prime.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
//                 </div>
//                 <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
//               </div>

//               <div className="w-full h-full max-h-[550px] space-y-8  p-10 glassmorphism max-w-[500px] rounded-3xl">
//                 <div className="flex flex-col gap-2 ">
//                   <div className="w-10 h-10 rounded-full bg-white"></div>
//                   <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
//                 </div>
//                 <div className="flex items-center justify-center  w-full ">
//                   <img src="/crunchyrol.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
//                 </div>
//                 <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
//               </div>

//               <div className="w-full h-full max-h-[550px] space-y-8  p-10 glassmorphism max-w-[500px] rounded-3xl">
//                 <div className="flex flex-col gap-2 ">
//                   <div className="w-10 h-10 rounded-full bg-white"></div>
//                   <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
//                 </div>
//                 <div className="flex items-center justify-center  w-full ">
//                   <img src="/sportify.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
//                 </div>
//                 <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
//               </div>
//             </div>
//           </div>
//         </section> */}


//         <section
//           id="projects"
//           // className="h-full flex flex-col overflow-x-hidden md:overflow-x-visible bg-[radial-gradient(ellipse_120%_120%_at_0%_0%,#585858_0%,#8a8a8a_32%,#262626_80%,#0a0a0a_100%)]"
//           className="h-full flex flex-col overflow-x-hidden md:overflow-x-visible bg-[radial-gradient(circle_at_30%_35%,#a68a3a_0%,#6b6428_30%,#3a3a22_60%,#262619_100%)]"

//         >
//           <div className="bg-[#EAEAEA] h-[10dvh] w-full rounded-b-[60px]" />

//           <div className="w-full mt-20 pb-40">
//             <PinnedShowcase
//               heading={<>Tools that work with <br /> your mind, not against it</>}
//               items={[
//                 {
//                   pill: "Designed for calm, not chaos",
//                   card: (
//                     <div className="w-full max-h-[550px] space-y-8 p-10 bg-white/10 backdrop-blur-[2px] border-white/10 before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:border before:border-white/20 max-w-[500px] rounded-3xl">
//                       <div className="flex flex-col gap-2">
//                         <div className="w-10 h-10 rounded-full bg-white" />
//                         <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
//                       </div>
//                       <div className="flex items-center justify-center w-full">
//                         <img src="/netflix.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
//                       </div>
//                       <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
//                     </div>
//                   ),
//                 },
//                 {
//                   pill: "The effortless way to begin",
//                   card: (<div className="w-full max-h-[550px] space-y-8 p-10 glassmorphism max-w-[500px] rounded-3xl">
//                     <div className="flex flex-col gap-2">
//                       <div className="w-10 h-10 rounded-full bg-white" />
//                       <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
//                     </div>
//                     <div className="flex items-center justify-center w-full">
//                       <img src="/prime.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
//                     </div>
//                     <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
//                   </div>),
//                 },
//                 {
//                   pill: "Stay fully focused",
//                   card: (<div className="w-full max-h-[550px] space-y-8 p-10 glassmorphism max-w-[500px] rounded-3xl">
//                     <div className="flex flex-col gap-2">
//                       <div className="w-10 h-10 rounded-full bg-white" />
//                       <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
//                     </div>
//                     <div className="flex items-center justify-center w-full">
//                       <img src="/crunchyrol.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
//                     </div>
//                     <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
//                   </div>),
//                 },
//                 {
//                   pill: "Small steps, Zero guilt",
//                   card: (<div className="w-full max-h-[550px] space-y-8 p-10 glassmorphism max-w-[500px] rounded-3xl">
//                     <div className="flex flex-col gap-2">
//                       <div className="w-10 h-10 rounded-full bg-white" />
//                       <div className="font-['inter'] text-[24px] font-semibold text-white">Designed for calm, not chaos</div>
//                     </div>
//                     <div className="flex items-center justify-center w-full">
//                       <img src="/sportify.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
//                     </div>
//                     <div className="text-white/50">Fixa removes the clutter that makes planning feel exhausting. Every screen is built to be clear, gentle, and easy to follow so you can focus on doing, not figuring things out</div>
//                   </div>),
//                 },
//               ]}
//             />
//           </div>
//         </section>


//         <section id="blogs" className="flex min-h-screen flex-col px-6 rounded-t-[60px]  bg-[#EAEAEA] -mt-15 mb-15">
//           <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-20 rounded-t-[32px]  px-6 pt-40 py-16">
//             <Reveal y={60} className="mt-2 max-w-[40%] max-h-[46px] bg-black/5 px-3 py-2 text-black/50 rounded-md">
//               ADHD-Friendly
//             </Reveal>

//             <Reveal y={60} delay={0.25} className="flex flex-col gap-8 font-['inter'] font-semibold text-[28px] md:text-[32px]">
//               <div className="text-black/50">
//                 We're here to help. If you didn't find the<br className="hidden md:flex" /> answer to your question, feel free to<br />
//                 <span className="mr-3"><Highlight delay={0.2}>email us</Highlight></span>   anytime.
//               </div>
//             </Reveal>
//           </div>


//           <div className="flex flex-col items-center justify-center">
//             <Accordion
//               type="multiple"
//               className="flex flex-col md:max-w-[55%] gap-3 "
//               defaultValue={["notifications"]}
//             >
//               {items.map((item) => (
//                 <AccordionItem
//                   className="px-7 md:max-h-[160px] py-6 rounded-[24px] bg-[#000000]/5 gap-6"
//                   key={item.value}
//                   value={item.value}
//                 >
//                   <AccordionTrigger className="font-['inter']  text-[16px] md:text-[18px] font-semibold">
//                     {item.trigger}
//                   </AccordionTrigger>
//                   <AccordionContent className="font-['inter'] text-sm md:text-[16px] font-medium text-black/60">
//                     {item.content}
//                   </AccordionContent>
//                 </AccordionItem>
//               ))}
//             </Accordion>
//           </div>

//         </section>

// <section 
//   id="blogs" 
//   ref={animRef} 
//   className="grow-on-scroll h-full flex min-h-[50dvh] flex-col px-6 py-6 text-white rounded-t-[20px] font-['inter'] gap-20 bg-[#262626] mt-15 mx-6 transition-transform origin-center will-change-transform"
// >
//           <div className="h-full grid grid-cols-2 gap-12 md:grid-cols-[2fr_1fr_1fr] ">
//             <div className="flex flex-col gap-12 col-span-2 md:col-span-1">
//               <div className="text-[18px]  font-semibold ">Fixa</div>
//               <div className="flex flex-col gap-3">
//                 <div className="font-bold">Get early updates</div>
//                 <div className="tex-white/50">Just the essentials from us — never spam, never noise.</div>
//                 <Button className="bg-white w-fit text-black font-bold mr-2 hover:bg-black/40 hover:text-black/40">Become a reseller</Button>

//               </div>
//             </div>
//             <div className="flex flex-col gap-16">
//               <div className="flex flex-col gap-3">
//                 <div className="font-medium text-white/50 ">Sections</div>
//                 <div className="font-bold">Home</div>
//                 <div className="font-bold">Features</div>
//                 <div className="font-bold">Fixa AI</div>
//                 <div className="font-bold">FAQ</div>
//               </div>

//                <div className="flex flex-col gap-3 text-end md:text-start">
//                 <div className="font-medium text-white/50 text-start">Contacts</div>
//                 <div className="font-bold">info@fixaplan.com</div>
//               </div>
//             </div>
//             <div className="flex flex-col gap-12">
//               <div className="flex flex-col gap-3 text-end md:text-start">
//                 <div className="font-medium text-white/50">Social</div>
//                 <div className="font-bold">Instagram</div>
//                 <div className="font-bold">LinkedIn</div>
//               </div>
//             </div>
//           </div>

//           <div className=" flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr] gap-4 ">
//             <div className="order-3 text-white/50 md:order-1">©2026. Fixa. All Rights Reserved.</div>
//             <div className="text-bold order-2 font-bold ">Privacy Policy</div>
//             <div className="order-1 md:order-3"> Website by<span className="font-bold"> David Chuks:</span> Inspo from Fixa</div>
//           </div>
//         </section>



//       </div>
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
  { href: "#faq", label: "FAQ" },
];


export const useScrollAnimation = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('grow-on-scroll');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return ref;
};

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const typedTextRef = useRef<HTMLSpanElement>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const animRef = useScrollAnimation();

  const items = [
    {
      value: "what-is-streamsell",
      trigger: "What is StreamSell?",
      content:
        "StreamSell lets you become a reseller and sell access to popular streaming and music subscriptions at your own price.",
    },
    {
      value: "how-do-i-make-money",
      trigger: "How do I make money?",
      content:
        "You choose your selling price and keep the difference between your reseller cost and the price your customer pays.",
    },
    {
      value: "how-do-customers-get-access",
      trigger: "How do customers get their access?",
      content:
        "Once an order is completed, the customer's access details are delivered to them through a secure reference.",
    },
    {
      value: "do-i-need-inventory",
      trigger: "Do I need to manage inventory?",
      content:
        "No. You focus on taking orders and selling. StreamSell handles the fulfillment process for you.",
    },
    {
      value: "what-can-i-sell",
      trigger: "What subscriptions can I sell?",
      content:
        "You can resell a growing selection of streaming, music, anime and entertainment subscriptions available on StreamSell.",
    },
    {
      value: "how-do-i-start",
      trigger: "How do I become a reseller?",
      content:
        "Create your reseller account, choose the subscriptions you want to sell, set your prices, and share your personalized storefront.",
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
        { filter: "blur(0px)", duration: 1.1, text: "STREAMSELL", ease: "none" },
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

      <div className="flex min-h-screen flex-col bg-[#EAEAEA] font-sans text-[#1a1a1a]">
        <section
          id="hero"
          className="relative flex h-[110dvh] flex-col items-center py-25 justify-between"
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
                Netflix, Spotify and more — at your own price
              </div>
            </div>

            <div className=" md:hidden fade-in flex flex-col mx-8 text-center  md:flex-row gap-2 items-center  rounded-xl  font-['inter'] text-sm text-white">
              <div className="font-medium glassmorphism px-6 py-5 rounded-2xl">No inventory. No accounts to manage. Just your link, and your profit.</div>
                 <Button asChild className="bg-white w-fit text-black font-bold mr-2 hover:bg-[#262626] hover:text-white">
                  <Link href="/auth/login">
                    Become a reseller
                  </Link>
                </Button>
            </div>
            <div className=" md:flex hidden fade-in  flex-col mx-6 text-center  md:flex-row gap-4 items-center pl-3 py-2 rounded-xl glassmorphism font-['inter'] text-sm text-white">
              <div className="font-medium">No inventory. No accounts to manage. Just your link, and your profit.</div>
                 <Button asChild className="bg-white w-fit text-black font-bold mr-2 hover:bg-[#262626] hover:text-white">
                  <Link href="/auth/login">
                    Become a reseller
                  </Link>
                </Button>
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
        <section id="about" className="relative bg-[#EAEAEA] -mt-15 rounded-t-[60px]">
          <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-20 rounded-t-[32px]  px-6 pt-40 py-16">
            <Reveal y={60} className="mt-2 max-w-[40%] max-h-[46px] bg-black/5 px-3 py-2 text-black/50 rounded-md">
              StreamSell
            </Reveal>

            <Reveal y={60} delay={0.25} className="flex flex-col gap-8 font-['inter'] font-semibold text-[28px] md:text-[32px]">
              <div className="">
                Want to stream for less?  <br className="hidden md:flex" />
                Or make money selling access?
              </div>
              <div className="text-black/50">
                We give you a storefront to resell <br className="hidden md:flex" />
                streaming and music subscriptions.
                <br />
                Lower <span><Highlight delay={0.2}>prices</Highlight>  — more <br /></span>
                <Highlight delay={0.5}>room for profit</Highlight>
              </div>
            </Reveal>
          </div>

          <div className="relative flex min-h-[80dvh] flex-col mx-4 rounded-2xl items-center justify-end mb">
            <Image src="/ManWatchingMovie.png" alt="" fill priority className="object-cover rounded-2xl" />
            <div className="w-full flex flex-col relative z-10 text-white mb-20 items-center">
              <StatBarGroup
                stats={[
                  { label: "Retail price", from: 100, to: 60 },
                  { label: "Your markup", from: 20, to: 60 },
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
                Subscriptions cost too much
              </div>
            </RiseFromFloor>

            <RiseFromFloor delay={0.15} maskClassName="pt-3 pb-8">
              <div className="font-['Volkhov'] font-semibold leading-[40px] text-[clamp(49px,5vw+1rem,91px)] ">
                Resell them for less.
              </div>
            </RiseFromFloor>
          </div>

          <FadeInGroup className="w-full grid md:grid-cols-3 gap-3" stagger={0.5} y={60}>
            <div className="w-full flex flex-col justify-between  p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#000000]/5  rounded-3xl">
              <div className="w-10 h-10  bg-black/50 rounded-full"></div>
              <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6">
                <div className="font-semibold">Set your price</div>
                <div className="font-medium text-black/50">
                  Add your markup and sell<br /> subscriptions at your price
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col justify-between  p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#000000]/5  rounded-3xl">
              <div className="w-10 h-10  bg-black/50 rounded-full"></div>
              <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6">
                <div className="font-semibold">Share your storefront</div>
                <div className="font-medium text-black/50">
                  Send your personalized link<br /> and let customers order
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col justify-between  p-6 md:p-10 min-h-[240px] md:min-h-[380px] bg-[#000000]/5  rounded-3xl">
              <div className="w-10 h-10  bg-black/50 rounded-full"></div>
              <div className="flex flex-col font-['inter'] text-md md:text-[20px] gap-6">
                <div className="font-semibold">We handle fulfillment</div>
                <div className="font-medium text-black/50">
                  You take the order. We handle<br /> delivery from start to finish
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
              heading={<>A storefront built <br /> to make you money</>}
              items={[
                {
                  pill: "Sell popular subscriptions",
                  card: (
                    <div className="w-full max-h-[550px] space-y-8 p-10 bg-white/10 backdrop-blur-[2px] border-white/10 before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:border before:border-white/20 max-w-[500px] rounded-3xl">
                      <div className="flex flex-col gap-2">
                        <div className="w-10 h-10 rounded-full bg-white" />
                        <div className="font-['inter'] text-[24px] font-semibold text-white">Popular subscriptions, ready to sell</div>
                      </div>
                      <div className="flex items-center justify-center w-full">
                        <img src="/netflix.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                      </div>
                      <div className="text-white/50">Give your customers access to services they already love, while keeping room for your own markup.</div>
                    </div>
                  ),
                },
                {
                  pill: "Price it to sell",
                  card: (<div className="w-full max-h-[550px] space-y-8 p-10 glassmorphism max-w-[500px] rounded-3xl">
                    <div className="flex flex-col gap-2">
                      <div className="w-10 h-10 rounded-full bg-white" />
                      <div className="font-['inter'] text-[24px] font-semibold text-white">Price it to sell</div>
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <img src="/prime.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                    </div>
                    <div className="text-white/50">Undercut retail, add your markup, and keep your margin on every sale.</div>
                  </div>),
                },
                {
                  pill: "One link, more customers",
                  card: (<div className="w-full max-h-[550px] space-y-8 p-10 glassmorphism max-w-[500px] rounded-3xl">
                    <div className="flex flex-col gap-2">
                      <div className="w-10 h-10 rounded-full bg-white" />
                      <div className="font-['inter'] text-[24px] font-semibold text-white">Your storefront, your customers</div>
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <img src="/crunchyrol.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                    </div>
                    <div className="text-white/50">Share your personalized link, let customers order, and we handle the fulfillment.</div>
                  </div>),
                },
                {
                  pill: "Built for resellers",
                  card: (<div className="w-full max-h-[550px] space-y-8 p-10 glassmorphism max-w-[500px] rounded-3xl">
                    <div className="flex flex-col gap-2">
                      <div className="w-10 h-10 rounded-full bg-white" />
                      <div className="font-['inter'] text-[24px] font-semibold text-white">Built to make you money</div>
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <img src="/sportify.png" alt="" className="w-full h-full object-cover rounded-xl max-w-[350px]" />
                    </div>
                    <div className="text-white/50">Sell subscriptions for less than retail and still profit from every order.</div>
                  </div>),
                },
              ]}
            />
          </div>
        </section>


        <section id="faq" className="flex min-h-screen flex-col px-6 rounded-t-[60px]  bg-[#EAEAEA] -mt-15 mb-15">
          <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-20 rounded-t-[32px]  px-6 pt-40 py-16">
            <Reveal y={60} className="mt-2 max-w-[40%] max-h-[46px] bg-black/5 px-3 py-2 text-black/50 rounded-md">
              Built for resellers
            </Reveal>

            <Reveal y={60} delay={0.25} className="flex flex-col gap-8 font-['inter'] font-semibold text-[28px] md:text-[32px]">
              <div className="text-black/50">
                Thinking about becoming a reseller?<br className="hidden md:flex" /> We've answered the common questions to<br />
                help you <span className="mr-3"><Highlight delay={0.2}>get started</Highlight></span>.
              </div>
            </Reveal>
          </div>


          <div className="flex flex-col items-center justify-center">
            <Accordion
              type="multiple"
              className="flex flex-col md:max-w-[55%] gap-3 "
              defaultValue={["what-is-streamsell"]}
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

        <section
          id="footer"
          ref={animRef}
          className="grow-on-scroll h-full flex min-h-[50dvh] flex-col px-6 py-6 text-white rounded-t-[20px] font-['inter'] gap-20 bg-[#262626] mt-15 mx-6 transition-transform origin-center will-change-transform"
        >
          <div className="h-full grid grid-cols-2 gap-12 md:grid-cols-[2fr_1fr_1fr] ">
            <div className="flex flex-col gap-12 col-span-2 md:col-span-1">
              <div className="text-[18px]  font-semibold ">StreamSell</div>
              <div className="flex flex-col gap-3">
                <div className="font-bold">Get early updates</div>
                <div className="tex-white/50">Just the essentials from us — never spam, never noise.</div>
                <Button asChild className="bg-white w-fit text-black font-bold mr-2 hover:bg-[#262626] hover:text-white">
                  <Link href="/auth/login">
                    Become a reseller
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-3">
                <div className="font-medium text-white/50 ">Sections</div>
                <div className="font-bold">Home</div>
                <div className="font-bold">How it works</div>
                <div className="font-bold">Subscriptions</div>
                <div className="font-bold">FAQ</div>
              </div>

              <div className="flex flex-col gap-3 text-end md:text-start">
                <div className="font-medium text-white/50 text-start">Contact</div>
                <div className="font-bold">support@streamsell.com</div>
              </div>
            </div>
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-3 text-end md:text-start">
                <div className="font-medium text-white/50">Social</div>
                <div className="font-bold">Instagram</div>
                <div className="font-bold">LinkedIn</div>
              </div>
            </div>
          </div>

          <div className=" flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr] gap-4 ">
            <div className="order-3 text-white/50 md:order-1">©2026. StreamSell. All Rights Reserved.</div>
            <div className="text-bold order-2 font-bold ">Privacy Policy</div>
            <div className="order-1 md:order-3"> Website by<span className="font-bold"> David Chuks</span></div>
          </div>
        </section>



      </div>
    </div>
  );
}