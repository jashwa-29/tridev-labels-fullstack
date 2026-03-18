"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FutureAdvancements() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Left Text
      gsap.fromTo(".future-text",
        { x: -50, opacity: 0, autoAlpha: 0 },
        {
          x: 0,
          opacity: 1,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%"
          }
        }
      );

      // Animate Right List Items
      gsap.fromTo(".future-item",
        { x: 50, opacity: 0, autoAlpha: 0 },
        {
          x: 0,
          opacity: 1,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%"
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden">
       {/* Abstract Background */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E32219]/10 rounded-full blur-[100px] pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="lg:w-1/2 future-text">
                <span className="text-[#E32219] font-bold tracking-widest uppercase text-xs mb-4 block">Innovation</span>
                <h2 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
                    Future <br/> <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Ready.</span>
                </h2>
                <div className="w-20 h-1 bg-[#E32219] mb-8"></div>
                <p className="text-gray-400 font-light text-xl leading-relaxed mb-8">
                    We are constantly evolving. Our R&D team is pioneering smart label integration, sustainable biodegradable materials, and AI-driven quality control systems to keep your brand ahead of the curve.
                </p>
                <button className="group flex items-center gap-3 text-white border-b border-white/20 pb-2 hover:border-[#E32219] transition-colors">
                    <span className="text-sm font-bold uppercase tracking-widest">Explore R&D</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                </button>
            </div>

            <div className="lg:w-1/2 relative">
                <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem]">
                    <h3 className="text-2xl font-bold mb-6">Upcoming Integrations</h3>
                    <div className="space-y-6">
                        <div className="future-item flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#E32219]/20 flex items-center justify-center text-[#E32219] font-bold text-lg">01</div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">NFC Smart Packaging</h4>
                                <p className="text-sm text-gray-400 font-light">Interactive consumer experiences directly from the shelf.</p>
                            </div>
                        </div>
                        <div className="future-item flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#E32219]/20 flex items-center justify-center text-[#E32219] font-bold text-lg">02</div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">Eco-Ultra Substrates</h4>
                                <p className="text-sm text-gray-400 font-light">100% compostable materials with zero performance compromise.</p>
                            </div>
                        </div>
                        <div className="future-item flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#E32219]/20 flex items-center justify-center text-[#E32219] font-bold text-lg">03</div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">AI Color Matching</h4>
                                <p className="text-sm text-gray-400 font-light">Real-time adaptive color correction for absolute consistency.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}
