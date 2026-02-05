"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Printer, PackageCheck, ClipboardCheck } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function OurProcessSection() {
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const headerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const handleMobileScroll = useCallback((e) => {
    const scrollPosition = e.target.scrollLeft;
    // Cache the offsetWidth to avoid reflows
    const width = e.target.offsetWidth;
    const itemWidth = width * 0.85 + 24; 
    const newIndex = Math.round(scrollPosition / itemWidth);
    if (newIndex !== activeMobileIndex) {
      setActiveMobileIndex(newIndex);
    }
  }, [activeMobileIndex]);

  const steps = [
    {
      number: "01",
      title: "The Blueprint",
      subtitle: "Discovery & Analysis",
      description: "Every masterpiece begins with understanding. We analyze your product's DNA—from surface tensions to environmental stressors—to engineer a label that doesn't just stick, but performs.",
      image: "https://i.pinimg.com/1200x/ca/2f/39/ca2f393d4beeb659a5de54ba0d76d1b4.jpg",
      details: ["Substrate Chemistry", "Lifecycle Mapping", "Compliance Matrix"]
    },
    {
      number: "02",
      title: "The Craft",
      subtitle: "Precision Engineering",
      description: "Complexity made simple. Through high-frequency flexographic printing and microscopic color calibration, we translate your brand's vision into tangible, high-resolution reality.",
      image: "https://i.pinimg.com/736x/ed/5e/6a/ed5e6adf3824febf05cbbea5290abd22.jpg",
      details: ["Pantone Accuracy", "Material Durability", "In-line Finishing"]
    },
    {
      number: "03",
      title: "The Seal",
      subtitle: "Quality Mastery",
      description: "The final safeguard. Each batch undergoes automated vision inspection and stress testing, ensuring that only perfection enters your supply chain.",
      image: "https://i.pinimg.com/1200x/1d/03/88/1d03881315a20e55d2e35d69c2aafe27.jpg",
      details: ["Automated QC", "Batch Traceability", "Strategic Logistics"]
    }
  ];

  useEffect(() => {
    // Check if mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const ctx = gsap.context(() => {
      if (!isMobile && window.innerWidth >= 768) {
        // Horizontal Scroll Animation - DESKTOP ONLY
        const scrollWidth = horizontalRef.current?.offsetWidth;
        const amountToScroll = scrollWidth ? scrollWidth - window.innerWidth : 0;

        gsap.to(horizontalRef.current, {
          x: -amountToScroll,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            start: "top 100px",
            end: () => `+=${amountToScroll}`,
            invalidateOnRefresh: true,
            markers: false // Remove in production
          }
        });

        // Individual Step Content Animation
        const stepsElements = gsap.utils.toArray(".process-slide");
        stepsElements.forEach((step) => {
          gsap.from(step.querySelector(".slide-inner"), {
            opacity: 0,
            y: 30,
            duration: 1,
            scrollTrigger: {
              trigger: step,
              start: "left center",
              toggleActions: "play none none reverse"
            }
          });
        });
      }

      // Header Fade In - ALL DEVICES
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });

      // Mobile/Tablet Animations
      if (isMobile) {
        const stepElements = gsap.utils.toArray(".mobile-step");
        stepElements.forEach((step, index) => {
          gsap.from(step, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          });
        });
      }

    }, containerRef);

    return () => {
      window.removeEventListener('resize', checkMobile);
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section 
      ref={containerRef} 
      className="relative bg-white overflow-hidden  pb-16 md:pb-24 lg:pb-32 xl:pb-40"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,#000_1px,transparent_0)] bg-size-[40px_40px]"></div>
      </div>

      {/* Header Section */}
      <div className="relative px-4 md:px-8 z-20 pt-16 md:pt-0">
        <div ref={headerRef} className="text-center max-w-4xl mx-auto mb-10 md:mb-10">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="h-px w-6 md:w-8 bg-[#E32219]"></div>
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-gray-400">Our Strategic Path</span>
            <div className="h-px w-6 md:w-8 bg-[#E32219]"></div>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-900 tracking-tighter leading-[1.1]">
            How We Define <span className="font-normal text-[#E32219]">Excellence.</span>
          </h2>
        </div>
      </div>

      {/* Mobile/Tablet Layout - Horizontal Scroll */}
      <div 
        className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 py-12 gap-6 relative z-30"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleMobileScroll}
      >
        {steps.map((step, index) => (
          <div 
            key={index}
            className="mobile-step snap-center shrink-0 w-[85vw] relative bg-white border border-gray-100 rounded-3xl p-6 shadow-xl flex flex-col gap-6"
          >
            {/* Step Number Badge */}
            <div className="absolute -top-4 -left-2 bg-[#E32219] text-white text-sm font-bold px-4 py-2 rounded-full z-40 shadow-lg">
              {step.number}
            </div>
            
            {/* Header Area */}
            <div className="space-y-2 pt-2">
              <span className="text-[#E32219] text-[10px] font-bold uppercase tracking-[0.2em] block">
                {step.subtitle}
              </span>
              <h3 className="text-2xl font-medium text-gray-900 tracking-tight uppercase">
                {step.title}
              </h3>
            </div>
            
            {/* Image Area */}
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden">
              <Image 
                src={step.image} 
                alt={step.title}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 85vw, 400px"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Description Area */}
            <div className="space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                {step.description}
              </p>
              
              {/* Key Aspects Tagging */}
              <div className="flex flex-wrap gap-2 pt-2">
                {step.details.map((detail, idx) => (
                  <span 
                    key={idx}
                    className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-gray-500"
                  >
                    {detail}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Progress Footer */}
            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Phase {step.number} / 03
              </span>
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${i === activeMobileIndex ? 'w-6 bg-[#E32219]' : 'w-2 bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout - Horizontal Scroll */}
      <div className="hidden md:block h-[75vh] relative overflow-x-visible">
        <div 
          ref={horizontalRef} 
          className="flex flex-row h-full w-fit"
        >
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="process-slide w-screen h-full shrink-0 flex items-center justify-center px-8 lg:px-24 py-8"
            >
              <div className="slide-inner relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                
                {/* Background Number */}
                <div className="absolute -top-20 -left-10 text-[300px] font-black text-gray-50/50 select-none z-0 tracking-tighter leading-none">
                  {step.number}
                </div>

                {/* Left Side: Visual */}
                <div className="relative z-10 flex justify-center">
                  <div className="relative group w-full max-w-md aspect-square">
                    <div className="absolute inset-0 bg-[#E32219]/5 rounded-3xl scale-110 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative w-full h-full bg-white border border-gray-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden transform transition-all duration-700 group-hover:-translate-y-6">
                      <Image 
                        src={step.image} 
                        alt={step.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 50vw, 450px"
                        className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute top-8 right-8 flex gap-1 z-20">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/50 backdrop-blur-md"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E32219] animate-pulse"></div>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Content */}
                <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                    <span className="text-[#E32219] text-xs font-bold uppercase tracking-[0.3em]">{step.subtitle}</span>
                    <h3 className="text-4xl lg:text-6xl font-medium text-gray-900 tracking-tight leading-none uppercase">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-lg lg:text-xl text-gray-500 font-light leading-relaxed max-w-xl">
                    {step.description}
                  </p>

                  <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-gray-100">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E32219]"></div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-4 pt-4">
                    <span className="text-[10px] font-bold text-gray-300">Phase {step.number} / 03</span>
                    <div className="h-0.5 w-32 bg-gray-100 relative overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-[#E32219] transition-all duration-700" 
                        style={{ width: `${((index + 1) / steps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
}