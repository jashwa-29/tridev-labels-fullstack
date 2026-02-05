"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, FileText, CheckCircle2, PackageCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Enquiry",
    desc: "Send us quantities, colors, size, and application details via our form or email Kiruba@trridevlabelss.com.",
    icon: <Mail className="w-6 h-6" />
  },
  {
    title: "Quote & Approval",
    desc: "We send a competitive quote. Once approved, we request files in .cdr (Curves) or .ai (Create Online) format.",
    icon: <FileText className="w-6 h-6" />
  },
  {
    title: "Proofing",
    desc: "A .jpg or .pdf proof is sent. Upon approval, we ask for exact Pantone shades or label samples for 100% accuracy.",
    icon: <CheckCircle2 className="w-6 h-6" />
  },
  {
    title: "Production & Delivery",
    desc: "Upon sign-off and PO, samples reach you within 12 days. Full production follows with guaranteed quality.",
    icon: <PackageCheck className="w-6 h-6" />
  }
];

export default function ExportProcess() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".step-node", 
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          },
          clearProps: "all"
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-36 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="flex justify-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d6201a]">Strategic Workflow</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-gray-900 tracking-tighter leading-none mb-8">
            Our Export <span className="font-medium">Protocol.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Horizontal Line for Desktop */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 hidden lg:block -translate-y-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="step-node group bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-[#E32219] flex items-center justify-center text-white mb-8 shadow-lg shadow-[#E32219]/20 transform group-hover:rotate-6 transition-transform">
                  {step.icon}
                </div>
                <span className="text-[10px] font-black text-gray-300 block mb-4 tracking-tighter italic">STEP 0{i + 1}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-[#E32219] transition-colors">{step.title}</h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
