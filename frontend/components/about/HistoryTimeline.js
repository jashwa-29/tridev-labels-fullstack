"use client";

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ArrowRight, Calendar, Target, Settings, Award } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const timelineData = [
  {
    year: "2008",
    date: "JANUARY 2008",
    title: "The Genesis",
    label: "FOUNDATION",
    description: "Trridev Labelss was founded in Chennai with a humble team of five and a bold vision. We started with traditional letterpress machines, delivering dependability and care with every print.",
    details: [
      "Founded with 5 precision experts",
      "Traditional Letterpress start",
      "Focus on Industrial Durability"
    ],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
    stat: "5 Members"
  },
  {
    year: "2010",
    date: "JUNE 2010",
    title: "Scaling Up",
    label: "EXPANSION",
    description: "Growth demanded precision. We integrated the Onda 250 machine, doubling our production capacity and setting new benchmarks for efficiency in the local market.",
    details: [
      "Onda 250 System Integration",
      "2× Production Capacity",
      "In-House Quality Control"
    ],
    image: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=1200",
    stat: "2× Output"
  },
  {
    year: "2014",
    date: "JUNE 2014",
    title: "Flexo Leap",
    label: "INNOVATION",
    description: "A pivotal technological jump. Installation of the Mark Andy 2200 Flexographic Press opened new possibilities in high-resolution, long-run industrial labeling.",
    details: [
      "Mark Andy 2200 Installation",
      "Multi-Color Printing Precision",
      "Accurate Repeat Consistency"
    ],
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200",
    stat: "Mark Andy 2200"
  },
  {
    year: "2021",
    date: "AUGUST 2021",
    title: "Servo Era",
    label: "TECHNOLOGY",
    description: "High-speed servo letterpress machines with integrated hot foil units arrived, enabling premium finishing and sharper detail for top-tier branding.",
    details: [
      "LED Ink Curing Technology",
      "High-Speed Servo Systems",
      "Premium Hot Foil Finishing"
    ],
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200",
    stat: "Hot Foil"
  },
  {
    year: "2023",
    date: "DECEMBER 2023",
    title: "Modern Chapter",
    label: "FACILITY",
    description: "Moved into a state-of-the-art 25,000 sq.ft facility — a statement of commitment to our team, our clients, and the future of precision manufacturing.",
    details: [
      "25,000 Sq.ft Technical Hub",
      "Integrated Converting Units",
      "Automated QC Workflow"
    ],
    image: "https://peppy-moonbeam-9fe49c.netlify.app/images/background-img-1.jpeg",
    stat: "25,000 Sq.ft"
  },
  {
    year: "2025",
    date: "OCTOBER 2025",
    title: "Nilpeter Legend",
    label: "PRESENT",
    description: "The 9-colour Nilpeter FB-350 crossover system set a new standard for multi-color precision, reinforcing our position as industrial printing leaders.",
    details: [
      "Nilpeter FB-350 Operations",
      "Advanced Digital Integration",
      "Unrivaled Color Adhesion"
    ],
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1200",
    stat: "9-Color FB350"
  }
];

export default function HistoryTimeline() {
  const triggerRef = useRef(null);
  const horizontalRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const track = horizontalRef.current;
      const slides = gsap.utils.toArray('.tl-slide');
      if (!track || !slides.length) return;

      const totalWidth = track.scrollWidth;
      const amountToScroll = totalWidth - window.innerWidth;

      // CORE HORIZONTAL SCROLL
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: () => `+=${amountToScroll + window.innerWidth}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.floor(self.progress * (slides.length - 0.01));
            setActiveIdx(idx);
          }
        }
      });

      mainTl.to(track, { x: -amountToScroll, ease: "none" });

      // PER-SLIDE ANIMATIONS
      slides.forEach((slide) => {
        const card = slide.querySelector('.card-inner');
        const heading = slide.querySelector('.slide-heading');
        const fades = slide.querySelectorAll('.slide-fade');
        const img = slide.querySelector('.card-image');
        const yearBg = slide.querySelector('.year-bg');

        if (card) {
          gsap.fromTo(card,
            { y: 100, opacity: 0, scale: 0.92 },
            { y: 0, opacity: 1, scale: 1, ease: "power3.out", duration: 1,
              scrollTrigger: { trigger: slide, containerAnimation: mainTl, start: "left 90%", toggleActions: "play none none reverse" }
            }
          );
        }

        if (heading) {
          gsap.fromTo(heading,
            { x: -60, opacity: 0 },
            { x: 0, opacity: 1, ease: "power4.out", duration: 0.9,
              scrollTrigger: { trigger: slide, containerAnimation: mainTl, start: "left 80%", toggleActions: "play none none reverse" }
            }
          );
        }

        if (fades.length) {
          gsap.fromTo(fades,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.07, ease: "power3.out",
              scrollTrigger: { trigger: slide, containerAnimation: mainTl, start: "left 75%", toggleActions: "play none none reverse" }
            }
          );
        }

        if (img) {
          gsap.fromTo(img,
            { scale: 1.18 },
            { scale: 1.02, ease: "none",
              scrollTrigger: { trigger: slide, containerAnimation: mainTl, start: "left right", end: "right left", scrub: true }
            }
          );
        }

        if (yearBg) {
          gsap.fromTo(yearBg,
            { x: 80, opacity: 0 },
            { x: -80, opacity: 0.04, ease: "none",
              scrollTrigger: { trigger: slide, containerAnimation: mainTl, start: "left right", end: "right left", scrub: 2 }
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const activeItem = timelineData[activeIdx - 1];

  return (
    <section ref={triggerRef} className="relative bg-white text-gray-900 overflow-hidden font-sans selection:bg-[#E32219] selection:text-white">

      {/* ── FIXED GUI ── */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <AnimatePresence>
          {activeIdx > 0 && activeItem && (
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute top-6 left-8 lg:left-16 flex items-center gap-3"
            >
              <div className="size-8 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm">
                <History size={14} className="text-[#E32219]" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#E32219] leading-none">{activeItem.label}</p>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">Trridev Labels Mfg Co.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FIXED PROGRESS DOTS ── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-full shadow-lg">
        {timelineData.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`rounded-full transition-all duration-500 ${
              activeIdx === i + 1
                ? 'w-8 h-[3px] bg-[#E32219] shadow-[0_0_8px_rgba(227,34,25,0.4)]'
                : activeIdx > i + 1
                  ? 'w-2 h-[3px] bg-[#E32219]/40'
                  : 'w-2 h-[3px] bg-gray-200'
            }`} />
          </div>
        ))}
      </div>

      {/* ── HORIZONTAL TRACK ── */}
      <div ref={horizontalRef} className="flex flex-nowrap h-screen items-stretch w-max">

        {/* INTRO SLIDE — CINEMATIC EDITORIAL */}
        <div className="tl-slide flex-shrink-0 w-screen h-screen flex items-center overflow-hidden relative">
          
          {/* Left Vertical Timeline Indicator */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 z-20">
            <div className="h-24 w-px bg-[#E32219]" />
            <div className="flex flex-col items-center gap-2">
              {timelineData.map((_, i) => (
                <div key={i} className="size-1 rounded-full bg-gray-200 hover:bg-[#E32219] transition-colors cursor-default" />
              ))}
            </div>
            <div className="h-24 w-px bg-gray-100" />
          </div>

          {/* Main Grid Layout */}
          <div className="card-inner w-full max-w-[1440px] mx-auto px-16 lg:px-32 grid grid-cols-12 gap-8 items-center">
            
            {/* LEFT: Editorial Text Block */}
            <div className="col-span-12 lg:col-span-6 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4 slide-fade">
                  <span className="w-8 h-[2px] bg-[#E32219]" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gray-400">Est. 2008 · Chennai, India</span>
                </div>

                <h1 className="slide-heading text-[8.5vw] font-light text-gray-900 leading-[0.88] tracking-tight uppercase">
                  Crafting<br />
                  <span className="font-normal text-[#E32219] relative">
                    History.
                    <span className="absolute -bottom-2 left-0 w-full h-px bg-linear-to-r from-[#E32219]/60 to-transparent" />
                  </span>
                </h1>
              </div>

              <p className="text-lg lg:text-xl text-gray-500 font-light leading-relaxed max-w-md tracking-wide slide-fade">
                17 years of manufacturing excellence, redefining the possibilities of label printing in India with precision and innovation.
              </p>

              {/* Animated Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100 slide-fade">
                {[
                  { num: "2B+", label: "Labels Printed" },
                  { num: "17", label: "Years of Growth" },
                  { num: "ISO", label: "9001:2015 Cert." },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-3xl lg:text-4xl font-light text-gray-900 tracking-tighter leading-none">{s.num}</span>
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.3em] leading-tight">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 group cursor-pointer slide-fade">
                <div className="relative px-10 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.25em] rounded-sm group overflow-hidden shadow-xl transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-4">
                    Explore Journey
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-[#E32219] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </div>
                <div className="flex flex-col gap-1 slide-fade">
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Scroll to navigate</span>
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i} className="size-1 rounded-full bg-gray-200 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Clean Asymmetric Image Grid */}
            <div className="col-span-12 lg:col-span-6 hidden lg:grid grid-cols-2 grid-rows-2 gap-4 h-[72vh] slide-fade">
              
              {/* Main tall image — left column spans 2 rows */}
              <div className="row-span-2 relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/80 group">
                <Image 
                  src={timelineData[0].image} 
                  alt="2008 Foundation" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-[3s]" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-gray-900/10 to-transparent" />
                <div className="absolute bottom-6 left-6 space-y-1">
                  <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.4em] block">Foundation Year</span>
                  <span className="text-4xl font-light text-white tracking-tighter leading-none">2008</span>
                </div>
                <div className="absolute top-5 right-5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">Origin</span>
                </div>
              </div>

              {/* Top-right image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60 group border border-gray-100">
                <Image 
                  src={timelineData[2].image} 
                  alt="2014 Flexo Leap" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-[3s]" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xl font-light text-white tracking-tighter">2014</span>
                  <p className="text-[8px] text-white/60 uppercase tracking-widest font-bold">Flexo Leap</p>
                </div>
              </div>

              {/* Bottom-right image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60 group border border-gray-100">
                <Image 
                  src={timelineData[5].image} 
                  alt="2025 Nilpeter" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-[3s]" 
                />
                <div className="absolute inset-0 bg-[#E32219]/20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xl font-light text-white tracking-tighter">2025</span>
                  <p className="text-[8px] text-white/60 uppercase tracking-widest font-bold">Present</p>
                </div>
                {/* Live indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-[#E32219] rounded-full shadow-lg shadow-red-200">
                  <div className="size-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[8px] font-bold text-white uppercase tracking-widest">Now</span>
                </div>
              </div>

            </div>


          </div>
        </div>

        {/* MILESTONE SLIDES */}
        {timelineData.map((item, idx) => (
          <div key={idx} className="tl-slide flex-shrink-0 w-[90vw] lg:w-screen h-screen flex items-center px-12 lg:px-24 relative overflow-hidden">

            {/* ── KINETIC INDUSTRIAL BACKGROUND (WOW MOMENT) ── */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
              
              {/* Floating Aura Blobs */}
              <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#E32219]/[0.03] rounded-full blur-[140px] animate-pulse" />
              <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-gray-100/40 rounded-full blur-[140px]" />

              {/* Drifting Technical Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:60px_60px] opacity-[0.15] animate-[drift_30s_linear_infinite]" />
              
              {/* Scroll-Synced Mechanical Gear */}
              <div className="year-bg absolute -right-20 -bottom-20 size-[700px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <svg viewBox="0 0 100 100" className="w-full h-full text-gray-100 fill-current">
                   <path d="M50 0c-1.3 0-2.5 1-2.7 2.3l-1.2 7.1c-2.4.6-4.6 1.6-6.7 2.8l-5.6-4.5c-1-.8-2.5-.7-3.4.2l-4.2 4.2c-.9.9-1 2.4-.2 3.4l4.5 5.6c-1.2 2.1-2.2 4.3-2.8 6.7l-7.1 1.2c-1.3.2-2.3 1.4-2.3 2.7v6c0 1.3 1 2.5 2.3 2.7l7.1 1.2c.6 2.4 1.6 4.6 2.8 6.7l-4.5 5.6c-.8 1-.7 2.5.2 3.4l4.2 4.2c.9.9 2.4 1 3.4.2l5.6-4.5c2.1 1.2 4.3 2.2 6.7 2.8l1.2 7.1c.2 1.3 1.4 2.3 2.7 2.3h6c1.3 0 2.5-1 2.7-2.3l1.2-7.1c2.4-.6 4.6-1.6 6.7-2.8l5.6 4.5c1 .8 2.5.7 3.4-.2l4.2-4.2c.9-.9 1-2.4.2-3.4l-4.5-5.6c1.2-2.1 2.2-4.3 2.8-6.7l7.1-1.2c1.3-.2 2.3-1.4 2.3-2.7v-6c0-1.3-1-2.5-2.3-2.7l-7.1-1.2c-.6-2.4-1.6-4.6-2.8-6.7l4.5-5.6c.8-1 .7-2.5-.2-3.4l-4.2-4.2c-.9-.9-2.4-1-3.4-.2l-5.6 4.5c-2.1-1.2-4.3-2.2-6.7-2.8l-1.2-7.1c-.2-1.3-1.4-2.3-2.7-2.3h-6zm0 30a20 20 0 1 1 0 40 20 20 0 0 1 0-40z" />
                </svg>
              </div>

              {/* Vertical Data Stream */}
              <div className="absolute left-[8%] top-0 bottom-0 w-px bg-linear-to-b from-transparent via-gray-200 to-transparent hidden xl:block">
                <div className="flex flex-col gap-12 py-10 animate-[v-slide_25s_linear_infinite]">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <span key={i} className="text-[7px] font-mono text-gray-300 -rotate-90 whitespace-nowrap uppercase tracking-[0.5em] font-black opacity-30">
                      SYSTEM_ANALYSIS // {item.year} // 0{idx + 1} // PRECISION_ACTIVE
                    </span>
                  ))}
                </div>
              </div>

              {/* Horizontal Scanning Line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-linear-to-b from-transparent via-[#E32219]/30 to-transparent animate-[h-scan_10s_ease-in-out_infinite]" />
            </div>

            {/* Parallax Giant Year */}
            <div className="year-bg absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden">
              <span className="text-[40vw] font-black tracking-tighter text-gray-900 opacity-0 leading-none whitespace-nowrap pl-12 scale-110">
                {item.year}
              </span>
            </div>

            <div className="card-inner relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

              {/* IMAGE CARD — BLUEPRINT STYLE */}
              <div className="relative group">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.08)] bg-gray-50 border border-gray-100/50 p-2">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <div className="card-image w-full h-full">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-[5s] ease-out group-hover:scale-110 saturate-[0.9] hover:saturate-100"
                        sizes="50vw"
                        priority={idx < 2}
                      />
                    </div>
                    
                    {/* Atmospheric Overlays */}
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-transparent to-black/10 z-10" />
                    
                    {/* Technical HUD Corners */}
                    <div className="absolute top-4 left-4 size-8 border-t border-l border-white/40 z-20" />
                    <div className="absolute bottom-4 right-4 size-8 border-b border-r border-white/40 z-20" />

                    {/* High-End Stat Chip */}
                    <div className="absolute bottom-6 right-6 z-30 px-5 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-500 group-hover:bg-white group-hover:border-white group-hover:-translate-y-2 group group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                      <div className="flex items-center gap-3">
                        <div className="relative size-8 rounded-lg bg-[#E32219] flex items-center justify-center text-white shadow-[0_0_15px_rgba(227,34,25,0.4)]">
                          <Target size={14} />
                          <div className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-white animate-pulse" />
                        </div>
                        <div>
                          <p className="text-[7px] font-bold text-white/50 group-hover:text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Peak Logic</p>
                          <p className="text-xs font-black text-white group-hover:text-gray-900 tracking-tight leading-none">{item.stat}</p>
                        </div>
                      </div>
                    </div>

                    {/* Year Watermark */}
                    <div className="absolute top-8 left-8 z-20 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                      <span className="text-6xl font-black italic text-white tracking-tighter leading-none">{item.year}</span>
                    </div>
                  </div>
                </div>

                {/* Ambient Glow */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#E32219]/5 rounded-full blur-[100px] -z-10 animate-pulse" />
              </div>

              {/* CONTENT — REFINED EDITORIAL */}
              <div className="relative space-y-10 lg:pl-4">
                
                {/* Visual Blueprint Brackets */}
                <div className="absolute -left-8 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-gray-100 to-transparent hidden lg:block" />

                <div className="space-y-6">
                  <div className="flex items-center gap-4 slide-fade">
                    <div className="size-2 rounded-full bg-[#E32219]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#E32219] italic">{item.date}</span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="slide-heading text-5xl lg:text-[5vw] font-light text-gray-900 leading-[0.9] tracking-tighter uppercase">
                      {item.title.split(' ').map((word, i) => (
                        <span key={i} className="inline-block mr-3">
                          {i === 1
                            ? <span className="font-normal text-[#E32219]">{word}</span>
                            : word}
                        </span>
                      ))}
                    </h2>
                    <div className="h-px w-24 bg-[#E32219]/60 slide-fade" />
                  </div>

                  <p className="text-lg text-gray-500 font-light leading-relaxed max-w-md tracking-wide slide-fade opacity-80 decoration-gray-100">
                    {item.description}
                  </p>

                  {/* Technical Spec List */}
                  <div className="grid grid-cols-1 gap-3 pt-4 slide-fade">
                    {item.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-4 group/item">
                        <div className="mt-2 h-px w-4 bg-gray-200 group-hover/item:w-6 group-hover/item:bg-[#E32219] transition-all duration-300" />
                        <span className="text-[11px] text-gray-400 group-hover/item:text-gray-900 font-medium uppercase tracking-[0.15em] transition-colors">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Chip */}
                <div className="flex items-center gap-6 slide-fade">
                  <span className="px-6 py-2.5 border border-gray-100 bg-gray-50/50 text-[#E32219] text-[9px] font-black uppercase tracking-[0.4em] rounded-sm shadow-sm hover:shadow-md transition-all duration-500">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-px bg-gray-100" />
                    <span className="text-[10px] font-bold text-gray-300 tracking-[0.3em] font-mono">{idx + 1} // 0{timelineData.length}</span>
                  </div>
                </div>

                {/* Background Coordinate Decoration */}
                <div className="absolute bottom-0 right-0 opacity-[0.03] select-none pointer-events-none hidden lg:block">
                  <span className="text-8xl font-black tracking-tighter leading-none">PRECISION_SYSTEM_v1.0</span>
                </div>
              </div>
            </div>

          </div>
        ))}

        {/* OUTRO SLIDE */}
        <div className="tl-slide flex-shrink-0 w-screen h-screen flex items-center justify-center px-12">
          <div className="card-inner text-center space-y-8 max-w-2xl">
            <div className="relative size-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-[#E32219]/5 scale-[2] animate-pulse" />
              <div className="h-full w-full rounded-full bg-[#E32219]/10 border border-[#E32219]/20 flex items-center justify-center shadow-xl">
                <Award size={36} className="text-[#E32219]" />
              </div>
            </div>
            <h2 className="text-6xl lg:text-[6vw] font-light text-gray-900 tracking-tight leading-none uppercase slide-fade">
              Vision for the <br />
              <span className="font-normal text-[#E32219]">Future.</span>
            </h2>
            <p className="text-xl text-gray-500 font-light leading-relaxed max-w-xl mx-auto tracking-wide slide-fade">
              Our story doesn&apos;t end here. Every milestone is a new beginning as we continue to push the boundaries of precision printing.
            </p>
            <div className="slide-fade">
              <button className="relative px-12 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.25em] rounded-sm group overflow-hidden shadow-xl transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-4">
                  Partner With Us
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-[#E32219] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* MOBILE */}
      <div className="lg:hidden px-6 pt-28 pb-24 space-y-16 bg-white relative z-20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#E32219]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gray-500">Our Journey</span>
          </div>
          <h2 className="text-5xl font-light text-gray-900 leading-tight tracking-tight uppercase">
            Crafting <span className="font-normal text-[#E32219]">History.</span>
          </h2>
        </div>
        {timelineData.map((item, idx) => (
          <div key={idx} className="space-y-5 pb-10 border-b border-gray-100">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-gray-900/40 to-transparent" />
              <div className="absolute top-5 left-5 text-4xl font-light text-white/70 tracking-tighter">{item.year}</div>
            </div>
            <div className="space-y-3 px-1">
              <div className="flex items-center gap-3">
                <Calendar size={12} className="text-[#E32219]" />
                <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-gray-400">{item.date}</span>
              </div>
              <h3 className="text-3xl font-light text-gray-900 tracking-tight">{item.title}</h3>
              <p className="text-gray-600 text-base font-light leading-relaxed tracking-wide">{item.description}</p>
              <span className="inline-block px-4 py-1.5 border border-[#E32219]/30 text-[#E32219] text-[9px] font-bold uppercase tracking-[0.4em] rounded-sm">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}