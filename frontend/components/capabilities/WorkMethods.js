"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scan, Printer, ShieldCheck, Microscope } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const methods = [
  {
    id: 1,
    title: "Consultation & Audit",
    description: "We begin by analyzing your application environment, substrate requirements, and design goals to recommend the perfect material stack.",
    icon: <Scan className="w-8 h-8 text-[#E32219]" />
  },
  {
    id: 2,
    title: "Pre-Press Precision",
    description: "Our pre-press team optimizes artwork for print producibility, managing color profiles and trapping to ensure the final output matches your vision.",
    icon: <Microscope className="w-8 h-8 text-[#E32219]" />
  },
  {
    id: 3,
    title: "Hybrid Production",
    description: "Utilizing both Flexographic and Digital offset technologies, we select the most efficient production route based on your volume and complexity needs.",
    icon: <Printer className="w-8 h-8 text-[#E32219]" />
  },
  {
    id: 4,
    title: "Automated Finishing",
    description: "From precision die-cutting to automated inspection rewinding, our finishing lines ensure every roll is perfect before it leaves our floor.",
    icon: <ShieldCheck className="w-8 h-8 text-[#E32219]" />
  }
];

export default function WorkMethods() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".method-card", 
        { y: 50, opacity: 0, autoAlpha: 0 },
        {
          y: 0,
          opacity: 1,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#E32219] font-bold tracking-widest uppercase text-xs mb-2 block">Our Process</span>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Engineered for <span className="font-medium">Perfection</span>
          </h2>
          <p className="text-gray-500 font-light text-lg">
            Our workflow is designed to eliminate variables and guarantee consistency. From the first pixel to the final spool, every step is calculated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {methods.map((method) => (
            <div key={method.id} className="method-card p-8 bg-gray-50 rounded-[2rem] hover:shadow-xl hover:bg-white transition-all duration-300 border border-transparent hover:border-gray-100 group">
              <div className="mb-6 p-4 bg-white rounded-2xl inline-block shadow-sm group-hover:scale-110 transition-transform duration-300">
                {method.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
