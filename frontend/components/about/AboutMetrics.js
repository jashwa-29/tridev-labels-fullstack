"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { id: "01", label: "Printing Capacity", value: 89, unit: "%", sub: "Annual Production Throughput" },
  { id: "02", label: "Design Perfection", value: 85, unit: "%", sub: "Aesthetic Accuracy Index" },
  { id: "03", label: "Technical Staff", value: 77, unit: "%", sub: "Industrial Grade Expertise" },
  { id: "04", label: "Die Availability", value: 92, unit: "%", sub: "Precision Tooling Readiness" }
];

export default function AboutMetrics() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal the container
      gsap.from(".metrics-main-card", {
        y: 40,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        }
      });

      // Animate lines
      gsap.from(".divider-line", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%"
        }
      });

      // Character count animation - Optimized to reduce layout thrashing
      gsap.utils.toArray(".count-num").forEach((num) => {
        const val = parseInt(num.getAttribute("data-value"));
        const obj = { value: 0 };
        gsap.to(obj, {
          value: val,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: num,
            start: "top 90%"
          },
          onUpdate: () => {
            num.textContent = Math.floor(obj.value);
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="pb-16 md:pb-24 lg:pb-32 xl:pb-40 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Harmonious Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-[#E32219]"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Section 02 // Performance</span>
            <span className="w-10 h-px bg-[#E32219]"></span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight tracking-tighter">
            Metrics of <span className="font-normal text-[#E32219]">Operational Mastery.</span>
          </h2>
        </div>

        {/* Sophisticated Unified Grid Layout */}
        <div className="metrics-main-card bg-gray-50 rounded-3xl md:rounded-[40px] p-1 shadow-sm overflow-hidden border border-gray-100 perspective-1000">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white rounded-[35px] md:rounded-[38px] overflow-hidden">
            {metrics.map((m, i) => (
              <div 
                key={m.id} 
                className="relative group p-10 md:p-14 lg:p-16 flex flex-col justify-between hover:bg-gray-50/5 transition-all duration-700 cursor-default overflow-hidden"
              >
                {/* 3D Tilt Effect Wrapper (Visual only) */}
                <div className="absolute inset-0 group-hover:bg-linear-to-tr group-hover:from-transparent group-hover:to-[#E32219]/5 transition-colors duration-700"></div>
                
                {/* Sweep Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-linear-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20"></div>

                {/* Vertical Architectural Divider (Visible on Desktop) */}
                {i !== 0 && (
                  <div className="divider-line absolute left-0 top-12 bottom-12 w-px bg-gray-100 hidden lg:block"></div>
                )}
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none group-hover:text-gray-600 transition-colors">P.MT-{m.id}</span>
                    <div className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#E32219] opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_15px_rgba(227,34,25,0.8)]"></div>
                      <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#E32219] animate-ping opacity-0 group-hover:opacity-40 transition-opacity"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-1 transform group-hover:scale-110 group-hover:translate-x-2 transition-transform duration-500 origin-left">
                    <span className="count-num text-7xl md:text-8xl font-bold tracking-tighter text-gray-900 leading-none" data-value={m.value}>0</span>
                    <span className="text-2xl font-light text-[#E32219]">{m.unit}</span>
                  </div>
                </div>

                <div className="mt-12 space-y-2 relative z-10">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.2em] group-hover:text-[#E32219] transition-colors">{m.label}</h3>
                  <p className="text-gray-500 text-[10px] font-medium uppercase tracking-[0.15em] leading-relaxed">
                    {m.sub}
                  </p>
                </div>

                {/* Highly Dynamic Progress Bar */}
                <div className="mt-10 relative z-10">
                  <div className="h-[3px] w-full bg-gray-100 overflow-hidden rounded-full">
                    <div 
                      className="h-full bg-[#E32219] origin-left transition-transform duration-1500 delay-500 ease-out group-hover:brightness-125" 
                      style={{ transform: `scaleX(${m.value / 100})` }}
                    ></div>
                  </div>
                  {/* Glowing tip */}
                  <div 
                    className="absolute top-0 h-[3px] w-4 bg-white/80 blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-1000"
                    style={{ left: `calc(${m.value}% - 16px)` }}
                  ></div>
                </div>

                {/* Subtle Decorative Number in Background */}
                <div className="absolute -bottom-10 -right-10 text-[120px] font-black text-gray-900/2 group-hover:text-[#E32219]/5 transition-colors duration-700 select-none pointer-events-none">
                  {m.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
