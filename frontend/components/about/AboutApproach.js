"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ShieldCheck, Cog, Ruler } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function AboutApproach() {
  const containerRef = useRef(null);
  const columnsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Desktop Parallax Columns
      if (window.innerWidth >= 1024) {
        gsap.to(".col-slow", {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
        
        gsap.to(".col-medium", {
          y: -120,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

        gsap.to(".col-fast", {
          y: -200,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
      
      // Reveal Animation
      gsap.from(".approach-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%"
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 lg:py-32 xl:py-35 overflow-hidden relative">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(45deg, #000 1px, transparent 1px),
                                 linear-gradient(-45deg, #000 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }} 
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">
        
        {/* Mobile Layout (Stacked) */}
        <div className="lg:hidden flex flex-col gap-12">
           <div className="approach-card space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E32219]">Our Methodology</span>
              <h2 className="text-4xl font-light text-gray-900 leading-tight">
                Engineering <br/> <span className="font-medium">Perfection.</span>
              </h2>
              <p className="text-gray-500 font-light leading-relaxed">
                We combine artisan craftsmanship with industrial automation to deliver labels that define global brands.
              </p>
           </div>
           
           <div className="space-y-8">
              {/* Step 01 - Mobile */}
              <div className="approach-card space-y-4">
                 <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-xl relative">
                    <Image 
                       src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1000" 
                       alt="Color Calibration" 
                       fill
                       sizes="(max-width: 768px) 100vw, 33vw"
                       className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                       <span className="text-[8px] font-bold uppercase tracking-widest text-[#E32219]">Step 01</span>
                       <h3 className="text-xl font-medium">Precision Calibration</h3>
                    </div>
                 </div>
                 <p className="text-gray-500 text-sm font-light leading-relaxed px-2">
                    Advanced spectrophotometers ensure absolute color fidelity and brand consistency across every substrate we print on.
                 </p>
              </div>

              {/* Step 02 - Mobile */}
              <div className="approach-card space-y-4">
                 <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-xl relative">
                    <Image 
                       src="/label-printing-approach.png" 
                       alt="Industrial Execution" 
                       fill
                       sizes="(max-width: 768px) 100vw, 33vw"
                       className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                       <span className="text-[8px] font-bold uppercase tracking-widest text-[#E32219]">Step 02</span>
                       <h3 className="text-xl font-medium">High-Speed Execution</h3>
                    </div>
                 </div>
                 <p className="text-gray-500 text-sm font-light leading-relaxed px-2">
                    State-of-the-art rotary and digital presses allow for high-volume output while maintaining micro-level detail and precision.
                 </p>
              </div>

              {/* Step 03 - Mobile */}
              <div className="approach-card space-y-4">
                 <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-xl relative">
                    <Image 
                       src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000" 
                       alt="Quality Assurance" 
                       fill
                       sizes="(max-width: 768px) 100vw, 33vw"
                       className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                       <span className="text-[8px] font-bold uppercase tracking-widest text-[#E32219]">Step 03</span>
                       <h3 className="text-xl font-medium">Quality Assurance</h3>
                    </div>
                 </div>
                 <p className="text-gray-500 text-sm font-light leading-relaxed px-2">
                    A zero-defect protocol ensures every label undergoes rigorous multi-stage checks for durability and scannability.
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-6">
              <div className="approach-card bg-[#050505] p-8 rounded-3xl text-white">
                 <Cog className="w-8 h-8 text-[#E32219] mb-4" />
                 <h3 className="text-xl font-bold mb-2">Technical Analysis</h3>
                 <p className="text-gray-400 font-light text-sm">Every project begins with a deep-dive substrate analysis to ensure performance in any environment.</p>
              </div>

              <div className="approach-card bg-gray-50 p-8 rounded-3xl border border-gray-100">
                 <ShieldCheck className="w-8 h-8 text-gray-900 mb-4" />
                 <h3 className="text-xl font-bold mb-2">ISO Certified</h3>
                 <p className="text-gray-500 font-light text-sm">Adhering to international quality standards for manufacturing excellence since 2008.</p>
              </div>
           </div>
        </div>

        {/* Desktop Layout (Parallax Columns) */}
        <div className="hidden lg:grid grid-cols-3 gap-8 items-start">
          
          {/* Column 1: Slow */}
          <div className="col-slow space-y-8 pt-0">
             <div className="approach-card p-12 bg-white rounded-[32px] border border-gray-200 shadow-2xl shadow-gray-100/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E32219]/5 rounded-full blur-3xl group-hover:bg-[#E32219]/10 transition-all"></div>
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-3">
                       <span className="w-8 h-px bg-[#E32219]"></span>
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Methodology</span>
                    </div>
                   <h2 className="text-6xl font-light text-gray-900 leading-[0.95] tracking-tighter">
                      Beyond <br/> <span className="text-[#E32219] font-medium">Standard.</span>
                   </h2>
                   <p className="text-gray-500 text-lg font-light leading-relaxed">
                      At Tridev Labels, we don't just print; we engineer brand assets designed to withstand the rigorous demands of the global supply chain, ensuring your identity remains pristine from factory to consumer.
                   </p>
                </div>
             </div>

             <div className="approach-card aspect-4/5 rounded-[32px] overflow-hidden shadow-2xl relative group">
                <Image 
                   src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1000" 
                   alt="Color Calibration" 
                   fill
                   priority
                   sizes="(max-width: 768px) 100vw, 33vw"
                   className="w-full h-full object-cover grayscale brightness-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="text-xs font-bold uppercase tracking-widest mb-3 text-[#E32219]">Step 01</div>
                   <h3 className="text-2xl font-medium mb-3">Precision Calibration</h3>
                   <p className="text-gray-300 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500">
                      We utilize advanced spectrophotometers to ensure absolute color fidelity. Every brand asset is calibrated to meet global standards, ensuring consistency across all substrates.
                   </p>
                </div>
             </div>
          </div>

          {/* Column 2: Medium */}
          <div className="col-medium space-y-8 pt-24">
             <div className="approach-card aspect-square rounded-[32px] overflow-hidden shadow-2xl relative group">
                <Image 
                   src="/label-printing-approach.png" 
                   alt="Industrial Machine" 
                   fill
                   sizes="(max-width: 768px) 100vw, 33vw"
                   className="w-full h-full object-cover grayscale brightness-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="text-xs font-bold uppercase tracking-widest mb-3 text-[#E32219]">Step 02</div>
                   <h3 className="text-2xl font-medium mb-3">High-Speed Execution</h3>
                   <p className="text-gray-300 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500">
                      Our facility houses state-of-the-art rotary and digital presses capable of high-volume output without compromising on detail. We engineer efficiency into every print run.
                   </p>
                </div>
             </div>

             <div className="approach-card p-10 bg-[#050505] rounded-[32px] text-white relative overflow-hidden group">
                <Cog className="w-12 h-12 text-[#E32219] mb-6 animate-spin-slow opacity-20 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-3xl font-light mb-4">Architectural <br/> Integrity.</h3>
                <p className="text-gray-400 font-light leading-relaxed mb-8">
                   Every label substrate we source undergoes exhaustive laboratory testing for chemical resistance, humidity tolerance, and extreme temperature variations to guarantee performance in any industrial environment.
                </p>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#ff4b42]">
                   Technical Specs <ArrowUpRight className="w-4 h-4" />
                </div>
             </div>
          </div>

          {/* Column 3: Fast */}
          <div className="col-fast space-y-8 pt-12">
             <div className="approach-card p-10 bg-gray-50 rounded-[32px] border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                <Ruler className="w-10 h-10 text-gray-300 mb-6 group-hover:text-[#E32219] transition-colors" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Micro-Precision</h3>
                <p className="text-gray-500 font-light text-sm leading-relaxed">
                   Our laser-guided finishing systems are calibrated to a 0.01mm tolerance, ensuring that every contour is crisp, every corner is clean, and every batch mirrors the master design perfectly.
                </p>
             </div>

             <div className="approach-card aspect-5/4 rounded-[32px] overflow-hidden shadow-2xl relative group">
                <Image 
                   src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000" 
                   alt="Quality Check" 
                   fill
                   sizes="(max-width: 768px) 100vw, 33vw"
                   className="w-full h-full object-cover grayscale brightness-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="text-xs font-bold uppercase tracking-widest mb-3 text-[#E32219]">Step 03</div>
                   <h3 className="text-2xl font-medium mb-3">Quality Assurance</h3>
                   <p className="text-gray-300 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500">
                      Zero-defect is our baseline. Every millimeter of our production is subjected to rigorous multi-stage inspections, from material durability to barcode scannability.
                   </p>
                </div>
             </div>

              <div className="approach-card p-10 bg-white rounded-[32px] border border-gray-100 shadow-lg group hover:border-[#E32219]/30 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                   <span className="text-4xl font-bold text-[#E32219]">16+</span>
                   <span className="text-xs font-bold uppercase tracking-widest text-gray-500 leading-tight">Years Of <br/> Excellence</span>
                </div>
                <p className="text-gray-500 font-light text-sm leading-relaxed">
                   Since our inception in 2008, we have evolved from a small letterpress unit into a 20,000 sq ft industrial powerhouse trusted by global pharmaceutical and beverage institutions.
                </p>
             </div>
          </div>

        </div>
      </div>
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </section>
  );
}
