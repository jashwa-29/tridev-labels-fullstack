"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Plane, Award } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function GlobalReachSection() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced Parallax
      gsap.fromTo(bgRef.current, 
        { scale: 1.3, yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

      // Content reveal
      gsap.fromTo(".reach-reveal", 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true
          }
        }
      );

      setTimeout(() => ScrollTrigger.refresh(), 1000);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-48 overflow-hidden bg-[#050505]">
      <div ref={bgRef} className="absolute inset-0 z-0 opacity-40">
        <Image 
          src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff" 
          alt="Global Logistics Background"
          fill
          loading="lazy"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-[#050505] via-[#050505]/60 to-[#050505] z-10"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="reach-reveal flex justify-center">
            <div className="px-8 py-2.5 border border-[#E32219]/30 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white bg-white/5 backdrop-blur-xl">
               Seamless Global Operations
            </div>
          </div>
          
          <h2 className="reach-reveal text-5xl md:text-7xl lg:text-9xl font-light tracking-tighter text-white leading-none">
            Exporting <br />
            <span className="text-[#E32219] font-medium italic">Across Horizons.</span>
          </h2>
          
          <p className="reach-reveal text-gray-400 text-lg md:text-2xl font-light leading-relaxed max-w-3xl mx-auto px-4">
            Trridev Labelss bridges distances, delivering world-class branding solutions to international markets through relentless innovation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-12">
            <div className="reach-reveal p-10 md:p-14 bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 text-left group hover:bg-[#E32219] transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(227,34,25,0.4)]">
               <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#E32219] mb-10 group-hover:bg-white/20 group-hover:text-white transition-all duration-500">
                  <Award className="w-8 h-8" />
               </div>
               <h3 className="text-3xl font-bold text-white mb-6 group-hover:translate-x-2 transition-transform duration-500">Excellence Hub</h3>
               <p className="text-gray-400 font-light text-base md:text-lg leading-relaxed group-hover:text-white/90">
                 Operating from our Chennai HQ since 2008, we maintain complete control over end-to-end quality.
               </p>
            </div>
            <div className="reach-reveal p-10 md:p-14 bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 text-left group hover:bg-[#E32219] transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(227,34,25,0.4)]">
               <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#E32219] mb-10 group-hover:bg-white/20 group-hover:text-white transition-all duration-500">
                  <Plane className="w-8 h-8" />
               </div>
               <h3 className="text-3xl font-bold text-white mb-6 group-hover:translate-x-2 transition-transform duration-500">Global Logistics</h3>
               <p className="text-gray-400 font-light text-base md:text-lg leading-relaxed group-hover:text-white/90">
                 Integrated with the Mark Andy system, we service premium international requirements with speed.
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
