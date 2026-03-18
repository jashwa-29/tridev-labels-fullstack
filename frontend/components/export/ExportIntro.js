"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, ShieldCheck, Zap, Crosshair, Cpu, Box, Activity } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function ExportIntro() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const scannerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main Entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      tl.from(".tech-badge", { y: -20, opacity: 0, duration: 0.8, ease: "back.out(1.7)" })
        .from(".main-headline", { y: 60, opacity: 0, duration: 1, ease: "expo.out" }, "-=0.4")
        .from(".sub-content", { y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.6")
        .from(".image-pod", { x: 100, opacity: 0, duration: 1.5, ease: "expo.out" }, "-=1");

      // Scanner Animation
      gsap.to(".scanner-line", {
        top: "100%",
        duration: 2.5,
        repeat: -1,
        ease: "none",
      });

      // Interactive Mouse Move for Scoped Scanning
      const handleMouseMove = (e) => {
        if (!scannerRef.current) return;
        const { left, top, width, height } = scannerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        gsap.to(".scan-target", {
          x: x - 40,
          y: y - 40,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      scannerRef.current?.addEventListener("mousemove", handleMouseMove);
      return () => scannerRef.current?.removeEventListener("mousemove", handleMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-48 overflow-hidden bg-white">
      {/* Background Technical Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none" style={{ backgroundImage: "radial-gradient(#050505 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-start">
          
          <div className="w-full lg:w-1/2 space-y-12">
            <div className="tech-badge flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-[#050505] rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E32219] animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">System Live</span>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gray-400">Export Protocol 01</span>
            </div>

            <div className="space-y-8">
              <h2 className="main-headline text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter text-gray-900 leading-[0.95]">
                Precision <br />
                <span className="text-[#E32219] font-medium italic">Branding.</span>
              </h2>
              
              <div className="sub-content max-w-lg space-y-10">
                <p className="text-lg md:text-xl font-light text-gray-600 leading-relaxed tracking-wide">
                  Trridev transforms global logistics into a seamless branding experience through high-speed automation and industrial mastery.
                </p>

                <div className="grid grid-cols-2 gap-8 py-10 border-y border-gray-100">
                   <div className="space-y-4 group">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-[#E32219]" />
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">Automation</h4>
                      </div>
                      <p className="text-xs text-gray-500 font-light leading-relaxed tracking-wide group-hover:text-gray-900 transition-colors">Mark Andy powered production lines.</p>
                   </div>
                   <div className="space-y-4 group">
                      <div className="flex items-center gap-3">
                        <Box className="w-5 h-5 text-[#E32219]" />
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">Logistics</h4>
                      </div>
                      <p className="text-xs text-gray-500 font-light leading-relaxed tracking-wide group-hover:text-gray-900 transition-colors">Direct global air-freight integration.</p>
                   </div>
                </div>

                <div className="flex items-center gap-8">
                  <button className="group relative px-10 py-5 bg-[#050505] text-white rounded-full overflow-hidden transition-all duration-500 active:scale-95">
                    <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.25em] flex items-center gap-3">
                      Technical Specs
                      <Zap className="w-3.5 h-3.5 fill-[#E32219] text-[#E32219]" />
                    </span>
                    <div className="absolute inset-0 bg-[#E32219] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                  
                  <div className="hidden sm:flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">ISO 9001:2015</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Certified Facility</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 pt-10 lg:pt-0">
            <div className="image-pod relative" style={{ perspective: "2000px" }}>
              {/* Scanning Interface Overlay */}
              <div 
                ref={scannerRef}
                className="relative aspect-[3/4] md:aspect-square rounded-[60px] overflow-hidden shadow-2xl group cursor-none"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d" 
                  alt="Modern Logistics" 
                  fill
                  priority
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                />
                
                {/* Visual Anchors */}
                <div className="absolute inset-0 border-[20px] border-white/10 z-20 pointer-events-none"></div>
                <div className="absolute top-10 left-10 z-30 flex flex-col gap-1">
                   <div className="w-8 h-px bg-white/40"></div>
                   <div className="w-px h-8 bg-white/40"></div>
                </div>
                <div className="absolute bottom-10 right-10 z-30 flex items-end justify-end gap-1 rotate-180">
                   <div className="w-8 h-px bg-white/40"></div>
                   <div className="w-px h-8 bg-white/40"></div>
                </div>

                {/* Animated Scanner Line */}
                <div className="scanner-line absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-[#E32219] to-transparent z-40 shadow-[0_0_20px_#E32219]"></div>

                {/* Interactive Scan Target */}
                <div className="scan-target absolute z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <div className="relative w-20 h-20">
                      <Crosshair className="absolute inset-0 w-full h-full text-[#E32219] stroke-[1px]" />
                      <div className="absolute inset-0 border border-[#E32219]/30 rounded-full animate-ping"></div>
                   </div>
                </div>

                {/* Data Overlay */}
                <div className="absolute bottom-12 left-12 z-40 space-y-2">
                   <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3 text-[#E32219]" />
                      <span className="text-[8px] font-bold text-white/60 uppercase tracking-[0.4em]">Latency: 12ms</span>
                   </div>
                   <div className="text-[8px] font-bold text-white/60 uppercase tracking-[0.4em]">Coords: 13.0827°N, 80.2707°E</div>
                </div>
              </div>

              {/* Floating Glass Box */}
              <div className="absolute -bottom-12 -right-12 md:right-auto md:-left-20 bg-white/90 backdrop-blur-3xl p-10 rounded-[40px] border border-white max-w-xs shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] z-50">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#E32219] flex items-center justify-center text-white">
                       <Zap className="w-5 h-5 fill-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Expertise Core</span>
                 </div>
                 <p className="text-sm font-light text-gray-600 leading-relaxed tracking-wide">
                    Our team provides hands-on technical consultation, drawing from decades of physical press experience to optimize your export labels for any global environment.
                 </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Side Label */}
      <div className="absolute right-0 top-1/2 -rotate-90 origin-right translate-x-12 translate-y-12 hidden xl:block">
         <span className="text-[10px] font-bold text-gray-200 uppercase tracking-[2em] whitespace-nowrap">GLOBAL SUPPLY CHAIN INTEGRATION</span>
      </div>

    </section>
  );
}
