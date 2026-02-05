"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hash, QrCode, ClipboardCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    icon: <ClipboardCheck className="w-8 h-8" />,
    title: "Specialty Labels",
    desc: "Created to your specifications with the highest quality, certified to follow all international guidelines.",
    tag: "Custom Spec"
  },
  {
    icon: <Hash className="w-8 h-8" />,
    title: "Consecutive Numbering",
    desc: "Digital printing with variable data allowing you to track inventory with maximum efficiency.",
    tag: "Inventory Logic"
  },
  {
    icon: <QrCode className="w-8 h-8" />,
    title: "Barcode & QR Labels",
    desc: "Maintaining strict quality standards to ensure your data is read by scanners every time.",
    tag: "Data Flow"
  }
];

export default function SpecialtyCapabilities() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".capability-card", 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          },
          clearProps: "all"
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-36 bg-gray-50 overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mb-20 capability-card">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-[#E32219]"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Technical Prowess</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-gray-900 tracking-tighter leading-none mb-8">
            The Leader in Custom <br />
            <span className="text-[#E32219] font-medium">Specialty Labels.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((item, i) => (
            <div key={i} className="capability-card group p-12 bg-white rounded-[40px] border border-gray-100 hover:border-[#E32219]/30 transition-all duration-700 shadow-sm hover:shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-[#E32219] mb-10 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 block">/ {item.tag}</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">{item.title}</h3>
              <p className="text-gray-500 font-light leading-relaxed mb-8">
                {item.desc}
              </p>
              <div className="w-10 h-px bg-gray-100 group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Ghost Text */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[20vw] font-black text-gray-100 select-none pointer-events-none z-0 opacity-40" aria-hidden="true">
        TECH
      </div>
    </section>
  );
}
