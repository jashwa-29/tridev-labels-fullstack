"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Zap, Target, Award, Plus } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Trusted",
    num: "01",
    desc: "Built on an unwavering commitment to solve the most complex branding challenges. Trust is our substrate."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Reliable",
    num: "02",
    desc: "A 'never let you down' approach ensuring high-quality finishes across billion-label runs consistently."
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Competitive",
    num: "03",
    desc: "Beyond price, we offer first-class service refined over more than 16 years of strategic industrial mastery."
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Dedicated",
    num: "04",
    desc: "Driving branding goals with extreme dedication and uncompromising quality standards since 2008."
  }
];

export default function AboutValues() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Background
      gsap.to(bgRef.current, {
        y: "15%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 lg:py-30 mb-16 md:mb-24 lg:mb-32 xl:mb-40 bg-[#0a0a0a] overflow-hidden">
      
      {/* Background with Image + Parallax + Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div ref={bgRef} className="absolute -top-[20%] left-0 w-full h-[140%]">
          <Image
            src="https://peppy-moonbeam-9fe49c.netlify.app/images/background-img-1.jpeg"
            alt="Institutional Background"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
        </div>
        {/* Semi-transparent dark overlay to ensure text visibility */}
        <div className="absolute inset-0 bg-[#0a0a0a]/50 z-10"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-20">
        
        {/* Editorial Left-Aligned Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24 lg:mb-20">
          <div className="max-w-6xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#E32219]"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">Institutional DNA</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-white mb-8 leading-tight tracking-tighter">
              Architectural Foundations <br />
              <span className="font-medium text-[#E32219]">of Global Scale.</span>
            </h2>
          </div>
        </div>

        {/* 4-Column Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((v, i) => (
            <div 
              key={i} 
              className="group relative p-10 lg:p-12 rounded-[40px] bg-white/3 border border-white/10 hover:bg-white/7 hover:border-white/20 transition-all duration-700 h-full flex flex-col justify-between"
            >
              <div className="space-y-10">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-[#E32219] flex items-center justify-center text-white shadow-lg shadow-[#E32219]/30">
                    {v.icon}
                  </div>
                  <span className="text-white/20 font-bold text-xs">/ {v.num}</span>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white tracking-tighter uppercase group-hover:text-[#E32219] transition-colors">
                    {v.title}
                  </h3>
                  <div className="h-px w-8 bg-[#E32219] group-hover:w-full transition-all duration-700"></div>
                </div>
              </div>

              <div className="mt-12 space-y-8">
                <p className="text-gray-300 text-lg font-light leading-relaxed">
                  {v.desc}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white">Value Standard</span>
                   <Plus className="w-4 h-4 text-[#E32219]" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
